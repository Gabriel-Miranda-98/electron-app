import { AppRoutes } from './Routes'

export function App() {
  return (
    <div
      className={`w-screen h-screen bg-slate-100 flex flex-col dark:bg-stone-950`}
    >
      <main className="flex flex-1 flex-col max-h-screen justify-center items-center">
        <AppRoutes />
      </main>
    </div>
  )
}
