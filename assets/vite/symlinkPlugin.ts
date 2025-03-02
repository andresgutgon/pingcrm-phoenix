import fs from 'node:fs'
import path from 'node:path'

/**
 * This is a little hack to symlink the node_modules from assets/node_modules to priv/node_modules
 * this hoist the modules so `priv/ssr-js/ssr.mjs` can import them with `import 'module-name'
 *
 * There are different solutions.
 * 1. This one is the simplest and works well for development.
 * 2. Change how NODE_PATH is set in elixirt-interiajs and elixir-nodejs packages
 * 3. Put all the JS project (package.json, tsconfig.json, etc) in the root of the project
 *
 * Option (2) was discussed here: https://github.com/inertiajs/inertia-phoenix/issues/37
 * Option (3) It's the most techically correct and don't require changing the code. But
 * it feels weird to have the JS project in the root of the Elixir project.
 */
export function symlinkNodeModulesPlugin() {
  return {
    name: 'symlink-node-modules',
    buildStart() {
      console.error('Symlinking node_modules')
      const target = path.resolve(__dirname, '../node_modules')
      const dest = path.resolve(__dirname, '../../priv/node_modules')

      try {
        const stat = fs.lstatSync(dest)

        if (stat.isSymbolicLink()) {
          const existingTarget = fs.readlinkSync(dest)
          if (path.resolve(existingTarget) === target) {
            return
          } else {
            fs.unlinkSync(dest)
          }
        } else {
          // Exists but not a symlink
          fs.rmSync(dest, { recursive: true, force: true })
        }
      } catch {
        // Does not exist — fine
      }

      fs.symlinkSync(target, dest, 'junction')
    },
  }
}
