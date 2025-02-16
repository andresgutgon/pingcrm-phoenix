import path from 'path'
import { fileURLToPath } from 'url'
import esbuild, { type Loader, type BuildOptions } from 'esbuild'
import stylePlugin from 'esbuild-style-plugin'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

const args = globalThis.process.argv.slice(2)
const watch = args.includes('--watch')
const deploy = args.includes('--deploy')
const ssr = args.includes('--ssr')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const OUT_DIR_CLIENT = path.resolve(__dirname, '../../priv/static/assets')
const OUT_DIR_SERVER = path.resolve(__dirname, '../../priv')

const FILE_LOADER = 'file' as Loader
const LOADERS = {
  '.ttf': FILE_LOADER,
  '.woff': FILE_LOADER,
  '.woff2': FILE_LOADER,
  '.eot': FILE_LOADER,
  '.svg': FILE_LOADER,
}

const PLUGINS = [
  stylePlugin({
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  }),
]

const clientOpts: BuildOptions = {
  entryPoints: ['./js/app.tsx'],
  bundle: true,
  minify: deploy,
  sourcemap: watch && 'inline',
  logLevel: 'info',
  format: 'esm',
  target: 'es2020',
  outdir: OUT_DIR_CLIENT,
  external: ['*.css', 'fonts/*', 'images/*'],
  nodePaths: ['../deps'],
  plugins: PLUGINS,
  loader: LOADERS,
}

const serverOpts: BuildOptions = {
  entryPoints: ['./js/ssr.tsx'],
  bundle: true,
  minify: false,
  sourcemap: watch && 'inline',
  logLevel: 'info',
  platform: 'node',
  target: 'es2020',
  format: 'cjs',
  outdir: OUT_DIR_SERVER,
  external: ['fonts/*', 'images/*'],
  nodePaths: ['../deps'],
  plugins: PLUGINS,
  loader: LOADERS,
}

const opts = ssr ? serverOpts : clientOpts

if (watch) {
  esbuild
    .context(opts)
    .then(async (ctx) => {
      await ctx.watch()

      process.stdin.on('close', () => {
        process.exit(0)
      })

      return process.stdin.resume()
    })
    .catch((_error) => {
      globalThis.process.exit(1)
    })
} else {
  esbuild.build(opts)
}
