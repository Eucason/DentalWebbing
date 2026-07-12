import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AccessibilityProvider } from './context/AccessibilitySuiteContext'
import { RouteLoadingFallback } from './components/layout/RouteLoadingFallback'
import { TenantProvider } from './context/TenantContext'
import { router } from './router'

function App() {
  // AccessibilityProvider sits INSIDE TenantProvider (it reads useTenantConfig
  // to scope localStorage per clinic) and OUTSIDE the router (it owns the
  // single global assertive live region that route changes will feed).
  return (
    <TenantProvider>
      <AccessibilityProvider>
        <Suspense fallback={<RouteLoadingFallback />}>
          <RouterProvider router={router} />
        </Suspense>
      </AccessibilityProvider>
    </TenantProvider>
  )
}

export default App
