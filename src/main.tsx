import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

// ---------------------------------------------------------------------------
// Global QueryClient
// Defaults follow Phase 2 Architecture §2.10:
//   staleTime        — 5 minutes, avoids re-fetching data that hasn't changed
//   retry            — 1, retries once on failure before surfacing the error
//   refetchOnWindowFocus — false, prevents background refetches on tab-switch
// ---------------------------------------------------------------------------
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const isDev = import.meta.env.VITE_APP_ENV === 'development'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        {isDev && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
)
