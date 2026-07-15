import { Suspense, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AccessibilityProvider } from './context/AccessibilitySuiteContext'
import { BaaRegistryProvider } from './context/BaaRegistry'
import { RouteLoadingFallback } from './components/layout/RouteLoadingFallback'
import { TenantProvider, useTenantConfig } from './context/TenantContext'
import { CookieConsentModal } from './components/consent/CookieConsentModal'
import { initAnalytics } from './utils/analytics'
import { router } from './router'

// ---------------------------------------------------------------------------
// Analytics initialiser — runs after the tenant config is resolved.
// ---------------------------------------------------------------------------
// `initAnalytics` is internally consent-gated and PHI-route-excluded (R5):
// it queues the config and only activates scripts / fires events once the
// user has granted consent off a non-excluded route. Calling it here is
// therefore safe even before the banner is answered — the analytic layer
// stays dormant until consent flips to granted (R5). We wait for the tenant
// config to resolve first so we have the tenant's tracking IDs in hand.
//
// The CookieBanner sits beside the router so it is visible on every route.
function AnalyticsBootstrap() {
  const config = useTenantConfig()

  useEffect(() => {
    if (config.analytics) {
      initAnalytics(config.analytics)
    }
  }, [config])

  // The full CMP modal (B14) replaces the minimal B12 banner when the
  // tenant opts in via the `cookieConsent` Phase-4 feature flag. It renders
  // alongside the router so it is reachable from every route, and it drives
  // the same consent.ts binary layer that gates analytics (R5 / R6).
  return <CookieConsentModal />
}

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
          <AnalyticsBootstrap />
          <Suspense fallback={<RouteLoadingFallback />}>
            <RouterProvider router={router} />
          </Suspense>
        </AccessibilityProvider>
      </BaaRegistryProvider>
    </TenantProvider>
  )
}

export default App
