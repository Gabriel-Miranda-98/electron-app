import { QueryClientProvider } from '@tanstack/react-query'
import { AppRoutes } from './Routes'
import { queryClient } from '~/src/lib/react-query'

export function App() {
  return (
    <div
      className={`w-screen h-screen bg-slate-100 flex flex-col  dark:bg-stone-950  `}
    >
      <main className="flex flex-1 flex-col max-h-screen justify-center items-center">
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </main>
    </div>
  )
}
