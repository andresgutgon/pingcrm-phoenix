import { resolve } from 'node:path'
import { defineConfig, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import vitexPlugin from '../deps/vitex/priv/vitejs/vitePlugin.js'

const isSSR = process.env.VITE_SSR === 'true'
const input: Record<string, string> = isSSR
  ? { ssr: './js/ssr.tsx' }
  : { app: './js/app.tsx' }

/**
 * Vite runs under Traefik in development inside Docker.
 */
function buildDevServerUrl(isDev: boolean) {
  if (!isDev) return undefined

  return {
    host: true, // listen on all interfaces inside Docker
    port: 5173,
    hmr: {
      protocol: 'wss',
      host: process.env.VITE_HOST,
    },
    cors: {
      origin: [
        `https://${process.env.MAIN_DOMAIN}`,
        `https://${process.env.APP_DOMAIN}`,
      ],
      credentials: true,
    },
  }
}

export default defineConfig(({ mode }: ConfigEnv) => {
  const isProd = mode === 'production'
  const isDev = mode === 'development'

  return {
    publicDir: 'static',
    plugins: [
      react(),
      tailwindcss(),
      vitexPlugin({ inertiaSSREntrypoint: './js/ssr.tsx' }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './js'),
      },
    },
    server: buildDevServerUrl(isDev),
    build: {
      target: 'esnext',
      sourcemap: isDev && !isSSR,
      minify: isProd && !isSSR,
      ssr: isSSR,
      emptyOutDir: isSSR,
      polyfillDynamicImport: !isSSR,
      outDir: isSSR ? '../priv/ssr-js' : '../priv/static',
      manifest: !isSSR ? 'assets/vite_manifest.json' : false,
      rollupOptions: {
        external: ['fonts/*', 'images/*'],
        input,
        output: {
          entryFileNames: isSSR ? '[name].js' : 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },
    },
  }
})
