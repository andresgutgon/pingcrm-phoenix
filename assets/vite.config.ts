import path from 'node:path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { symlinkNodeModulesPlugin } from './vite/symlinkPlugin'
const isSSR = process.env.VITE_SSR === 'true'

const ALIAS = {
  '@': path.resolve(__dirname, './js'),
}
export default defineConfig(({ mode }: ConfigEnv) => {
  const isProd = mode === 'production'
  const isDev = mode === 'development'

  if (isDev) {
    // Terminate the watcher when Phoenix quits
    process.stdin.on('close', () => {
      process.exit(0)
    })

    process.stdin.resume()
  }

  if (isSSR) {
    const config: UserConfig = {
      plugins: [react(), ...(isProd ? [] : [symlinkNodeModulesPlugin()])],
      resolve: { alias: ALIAS },
      build: {
        ssr: true,
        outDir: '../priv/ssr-js',
        emptyOutDir: true,
        sourcemap: isDev ? 'inline' : false,
        minify: isProd,
        rollupOptions: {
          external: ['fonts/*', 'images/*'],
          input: {
            ssr: './js/ssr.tsx',
          },
          output: {
            entryFileNames: '[name].mjs',
            chunkFileNames: 'assets/[name]-[hash].mjs',
            format: 'esm',
          },
        },
      },
    }

    return config
  } else {
    return {
      publicDir: 'static',
      plugins: [react()],
      resolve: { alias: ALIAS },
      build: {
        target: 'esnext',
        emptyOutDir: false,
        polyfillDynamicImport: true,
        outDir: '../priv/static',
        sourcemap: isDev,
        manifest: 'assets/vite_manifest.json',
        minify: !isDev,
        rollupOptions: {
          input: {
            app: './js/app.tsx',
          },
          output: {
            entryFileNames: 'assets/[name].[hash].js',
            chunkFileNames: 'assets/[name].[hash].js',
            assetFileNames: 'assets/[name].[hash][extname]',
          },
          external: ['fonts/*', 'images/*'],
        },
      },
    }
  }
})
