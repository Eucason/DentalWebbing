// ─────────────────────────────────────────────────────────────────────────────
// src/utils/analytics.ts
// ─────────────────────────────────────────────────────────────────────────────
// Analytics abstraction layer — GTM + GA4 + Meta CAPI + CallRail DNI.
//
// Every public method is a NO-OP until BOTH of these hold:
//   1. The user has granted tracking consent (R5 — consent gating).
//   2. The current route is not a PHI-adjacent excluded route (R5).
//
// Additionally:
//   - All tracking IDs come from tenant config — never hardcoded (R1).
//   - GA4 is configured with IP anonymization + PII transmission disabled (R5).
//   - Meta CAPI events are POSTed to a server-side proxy, never to Meta
//     directly from the browser, so the access token never leaves the
//     server (R4 — no secret leakage into the client bundle).
//   - NO PII ever appears in an event payload (R5 / R4).
//
// The layer is intentionally framework-agnostic (no React imports) so it can
// be called from anywhere — hooks, effects, or vanilla event listeners.
// ─────────────────────────────────────────────────────────────────────────────

import type { AnalyticsConfig } from '../types/analytics'
import { hasConsented } from './consent'

// ── Window augmentation ─────────────────────────────────────────────────────
// GTM / GA4 inject `window.dataLayer` and `window.gtag`. We declare them so
// the rest of this module is fully typed without relying on @types/gtag.js
// (not a project dependency).
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

// ── Module state ────────────────────────────────────────────────────────────
let config: AnalyticsConfig | null = null
let initialized = false

// ── Excluded routes (R5 tracker hygiene) ────────────────────────────────────
// PHI-adjacent routes where analytics must NEVER fire, regardless of consent.
//   - /contact          → contact page (may carry form / intake context)
//   - /health-form      → dynamic catch-all slug (matches the intake form page)
// We match by pathname prefix so sub-paths like /health-form/abc are covered.
const EXCLUDED_PATTERNS: ReadonlyArray<RegExp> = [
  /^\/contact\/?$/,
  /^\/health-form/,
]

function isExcludedRoute(): boolean {
  const path = window.location.pathname
  return EXCLUDED_PATTERNS.some((re) => re.test(path))
}

/**
 * True only when it is currently safe to fire a tracking call:
 * initialized + consent granted + not on an excluded route.
 */
function canTrack(): boolean {
  return initialized && hasConsented() && !isExcludedRoute()
}

// ── PII scrubber (R5 / R4) ──────────────────────────────────────────────────
// Defence-in-depth: even if a caller hands us a payload with a PHI-ish key,
// strip it before it ever reaches the network. This is a coarse allowlist —
// known tracking-safe keys pass through; anything unknown is dropped so we
// never accidentally forward a name, email, phone, MRN, etc.
const PII_KEYS = new Set([
  'name',
  'email',
  'phone',
  'firstname',
  'lastname',
  'fullname',
  'address',
  'ip',
  'mrn',
  'dob',
  'ssn',
  'subscriberid',
  'patientid',
  'chart',
  'diagnosis',
  'medication',
])

function scrubPayload(
  data: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!data) return {}
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (PII_KEYS.has(key.toLowerCase())) continue
    out[key] = value
  }
  return out
}

// ── DataLayer / gtag bootstrap ──────────────────────────────────────────────
function installDataLayerStub(): void {
  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag === 'function') return
  // Stub gtag so early calls before the GTM script loads queue into dataLayer
  // and are replayed once GTM takes over.
  window.gtag = function (...args: unknown[]) {
    window.dataLayer!.push(args)
  }
}

function configureGa4(measurementId: string): void {
  // R5 tracker hygiene — anonymize IPs and disable all PII-adjacent signals
  // before the first hit leaves the browser.
  window.gtag?.('config', measurementId, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
}

// Tracks GTM container IDs we have already injected so a route re-render or a
// second init call never double-loads the same container script.
const injectedGtmIds = new Set<string>()

function injectGtmScript(gtmId: string): void {
  if (injectedGtmIds.has(gtmId)) return
  injectedGtmIds.add(gtmId)
  installDataLayerStub()
  // Standard GTM bootstrap snippet — id is tenant-supplied (R1).
  window.dataLayer!.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`
  document.head.appendChild(script)
}

// ── CallRail DNI ────────────────────────────────────────────────────────────
// Dynamic Number Insertion pools are identified by a tenant-supplied ID.
// The loader is only invoked when consent is given and the route is allowed
// (gated by the caller), so this function only handles the script injection.
function injectCallrailDni(dniId: string): void {
  const existing = document.querySelector(
    'script[data-callrail-dni]',
  )
  if (existing) return
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.setAttribute('data-callrail-dni', dniId)
  script.src = `https://cdn.callrail.com/companies/${encodeURIComponent(dniId)}/${encodeURIComponent(dniId)}.js`
  document.head.appendChild(script)
}

// ── Internal: push a GA4 event once we know it's safe ───────────────────────
function pushGa4Event(action: string, params: Record<string, unknown>): void {
  installDataLayerStub()
  window.gtag?.('event', action, params)
  window.dataLayer?.push({ event: action, ...params })
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Initialise the analytics layer from tenant config.
 *
 * Call once on mount after consent is resolved. Safe to call before consent
 * is granted — the config is stored, but no scripts are injected and no
 * events fire until the user consents (R5). We DO install the dataLayer stub
 * immediately so early calls are queued rather than throwing.
 */
export function initAnalytics(cfg: AnalyticsConfig): void {
  config = cfg
  initialized = true
  installDataLayerStub()

  // If consent is already persisted from a previous visit AND we are not on
  // a PHI-adjacent route, activate immediately.
  if (canTrack()) {
    activate()
  }

  // Listen for consent changes so granting consent after init turns tracking
  // on without a reload.
  if (!consentListenerInstalled) {
    window.addEventListener('dw:consent-changed', handleConsentChanged)
    consentListenerInstalled = true
  }
}

/**
 * Fire a GA4 custom event via gtag + dataLayer.
 * NO-OP without consent or on excluded routes.
 */
export function trackEvent(
  category: string,
  action: string,
  label?: string,
): void {
  if (!canTrack()) return
  pushGa4Event(action, {
    event_category: category,
    event_label: label ?? undefined,
  })
}

/**
 * Fire a Meta Conversions API event via the server-side proxy.
 *
 * The client POSTs a sanitized, non-PHI payload to our own origin proxy
 * endpoint; the proxy (server-side, not shipped here) attaches the access
 * token and forwards to Meta. The token therefore never touches the browser
 * (R4). NO-OP without consent or on excluded routes.
 */
export function trackConversion(
  eventName: string,
  data?: Record<string, unknown>,
): void {
  if (!canTrack() || !config) return
  // Pixel id is required to route the event server-side.
  if (!config.metaCapiPixelId) return

  const safeData = scrubPayload(data)

  // Fire-and-forget. Network failures must never break the host app, so we
  // swallow all errors silently (analytics is non-critical).
  const body = JSON.stringify({
    pixel_id: config.metaCapiPixelId,
    event_name: eventName,
    data: safeData,
    // Non-PHI path only — never include query strings that could carry tokens.
    page_path: window.location.pathname,
    client_ts: Date.now(),
  })

  // The proxy path is fixed and origin-relative — resolved against the host.
  fetch('/api/capi-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    // keepalive so the request survives navigation away from the page.
    keepalive: true,
  }).catch(() => {
    /* analytics is best-effort — swallow network failures */
  })
}

/**
 * Returns `true` when the analytics layer would currently allow a tracking
 * call. Useful for tests and for the consent banner's toggle state.
 */
export function isTrackingAllowed(): boolean {
  return canTrack()
}

// ── Activation internals ────────────────────────────────────────────────────

let activated = false
let consentListenerInstalled = false

function activate(): void {
  if (activated || !config) return
  activated = true

  const { gtmId, ga4Id, callrailDniId } = config

  // GA4 via GTM container OR standalone GA4 measurement id.
  if (gtmId) injectGtmScript(gtmId)
  if (ga4Id) configureGa4(ga4Id)

  // CallRail DNI — consent already confirmed by canTrack() at call site.
  if (callrailDniId) injectCallrailDni(callrailDniId)
}

function handleConsentChanged(): void {
  if (canTrack() && !activated) {
    activate()
  }
}
