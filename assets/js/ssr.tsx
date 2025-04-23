import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import type { Page } from '@inertiajs/core'
import { resolvePage } from './utils/pageHelpers'

// NOTE: ESM module caching. To improve DEV experience with HMR, we need to import here so Vite can know this exists and hot reload it.
import '@/Layouts/MainLayout'

export async function render(page: Page) {
  return createInertiaApp({
    page,
    resolve: resolvePage,
    render: ReactDOMServer.renderToString,
    setup: ({ App, props }) => <App {...props} />,
  })
}
