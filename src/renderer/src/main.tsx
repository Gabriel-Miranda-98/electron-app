import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './styles/global.css'

import { ThemeProvider } from './providers/theme.provider'
import { Toaster } from './components/ui/toaster'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system">
      <App />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
)
