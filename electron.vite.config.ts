import path from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { loadEnv } from 'vite'
import tsConfigPathsPlugin from 'vite-tsconfig-paths'

const tsConfigPaths = tsConfigPathsPlugin({
  projects: [path.resolve('tsconfig.json')],
})
export default () => {
  process.env = { ...process.env, ...loadEnv('', process.cwd()) }

  return defineConfig({
    main: {
      server: {
        port: 3001,
      },
      envDir: path.resolve('.env'),
      plugins: [tsConfigPaths, externalizeDepsPlugin()],
      publicDir: path.resolve('resources'),
    },
    preload: {
      server: {
        port: 3001,
      },
      plugins: [tsConfigPaths, externalizeDepsPlugin()],
    },
    renderer: {
      server: {
        port: 3001,
      },

      css: {
        postcss: {
          plugins: [
            tailwindcss({
              config: './tailwind.config.js',
            }),
          ],
        },
      },

      resolve: {
        alias: {
          '@renderer': path.resolve('src/renderer/src'),
        },
      },
      plugins: [tsConfigPaths, react()],
    },
  })
}
