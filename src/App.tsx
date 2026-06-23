import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { RouteLoadingFallback } from './components/layout/RouteLoadingFallback'
import { TenantProvider } from './context/TenantContext'
import { router } from './router'

function App() {
  return (
    <TenantProvider>
      <Suspense fallback={<RouteLoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </TenantProvider>
  )
}

export default App
