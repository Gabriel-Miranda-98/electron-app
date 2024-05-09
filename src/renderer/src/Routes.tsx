import { Router, Route } from 'electron-router-dom'
import { Login } from './pages/Login'
import { Monitor } from './pages/Monitor'

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<Login />} />
          <Route path="/monitor" element={<Monitor />} />
        </>
      }
    />
  )
}
