import { Router, Route } from 'electron-router-dom'
import { Login } from './pages/Login'
import { Monitor } from './pages/Monitor'
import { Tracer } from './pages/Tracer'

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<Login />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/tracer" element={<Tracer />} />
        </>
      }
    />
  )
}
