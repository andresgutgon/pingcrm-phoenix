import { ReactNode, ComponentType } from 'react'
import Layout from '../Layouts/Layout'

type KindOfProps = Record<string, unknown>

interface PageModule {
  default: ComponentType<KindOfProps>
  layout?: (page: ReactNode) => ReactNode
}

type ClientPageModule = () => Promise<PageModule>
let pages: Record<string, PageModule> | Record<string, ClientPageModule>

if (import.meta.env.SSR) {
  pages = import.meta.glob<PageModule>('../Pages/**/*.tsx', { eager: true })
} else {
  pages = import.meta.glob<PageModule>('../Pages/**/*.tsx')
}

function buildSrrPage(pageModule: PageModule) {
  const { default: Component, layout } = pageModule

  const Wrapped = (props: KindOfProps) =>
    (layout ?? ((page: ReactNode) => <Layout>{page}</Layout>))(
      <Component {...props} />,
    )

  return Wrapped
}

async function buildClientPage(pageModule: ClientPageModule) {
  const { default: Component, layout } = await pageModule()

  const Wrapped = (props: KindOfProps) =>
    (layout ?? ((page: ReactNode) => <Layout>{page}</Layout>))(
      <Component {...props} />,
    )

  return Wrapped
}

export function resolvePage(name: string) {
  const pageModule = pages[`../Pages/${name}/index.tsx`]

  if (!pageModule) {
    throw new Error(`Page ${name} not found.`)
  }

  if (import.meta.env.SSR) {
    return buildSrrPage(pageModule as PageModule)
  }

  return buildClientPage(pageModule as ClientPageModule)
}
