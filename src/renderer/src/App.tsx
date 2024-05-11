import { QueryClientProvider } from '@tanstack/react-query'
import { AppRoutes } from './Routes'
import { queryClient } from '~/src/lib/react-query'

export function App() {
  return (
    <div
      className={` bg-slate-100   dark:bg-stone-950 flex flex-1 w-screen h-screen flex-col justify-center items-center `}
    >
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </div>
  )
}
