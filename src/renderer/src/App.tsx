import { AppRoutes } from './Routes'

export function App() {
  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col">
      <main className="flex flex-1 flex-col max-h-screen">
        <AppRoutes />
      </main>
    </div>
  )
}
