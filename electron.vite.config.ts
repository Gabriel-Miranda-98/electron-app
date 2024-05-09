import path from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
export default defineConfig({
  main: {
    server: {
      port: 3001,
    },

    plugins: [externalizeDepsPlugin()],
    publicDir: path.resolve('resources'),
  },
  preload: {
    server: {
      port: 3001,
    },
    plugins: [externalizeDepsPlugin()],
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
    plugins: [react()],
  },
})
