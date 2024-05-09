import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    server:{
      port:3000
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    server:{
      port:3000
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    server:{
      port:3000
    },
    
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
