import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AccessibilityProvider } from './context/AccessibilitySuiteContext'
import { BaaRegistryProvider } from './context/BaaRegistry'
import { RouteLoadingFallback } from './components/layout/RouteLoadingFallback'
import { TenantProvider } from './context/TenantContext'
import { router } from './router'

function App() {
  // AccessibilityProvider sits INSIDE TenantProvider (it reads useTenantConfig
  // to scope localStorage per clinic) and OUTSIDE the router (it owns the
  // single global assertive live region that route changes will feed).
  //
  // BaaRegistryProvider sits INSIDE TenantProvider because it reads the
  // per-tenant baa_registry from the resolved config, and OUTSIDE the router
  // so every route (and every vendor embed it renders) can run the PHI gate.
  return (
    <TenantProvider>
      <BaaRegistryProvider>
        <AccessibilityProvider>
          <Suspense fallback={<RouteLoadingFallback />}>
            <RouterProvider router={router} />
          </Suspense>
        </AccessibilityProvider>
      </BaaRegistryProvider>
    </TenantProvider>
  )
}

export default App
