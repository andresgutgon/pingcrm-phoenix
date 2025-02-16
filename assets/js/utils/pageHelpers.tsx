import { ReactNode } from 'react'
import Layout from '../Layouts/Layout'

export async function resolvePage(name: string) {
  const currentPage = await import(`../Pages/${name}/index.tsx`)

  // Setup default layout
  currentPage.default.layout =
    currentPage.default.layout ||
    ((page: ReactNode) => <Layout children={page} />)

  return currentPage
}
