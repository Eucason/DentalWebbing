// ─────────────────────────────────────────────────────────────────────────────
// src/utils/consent.ts
// ─────────────────────────────────────────────────────────────────────────────
// Consent state management for analytics tracking (B12 + B14).
//
// Two layers live here, both backed by tenant-scoped localStorage keys:
//
//   1. Binary layer (B12 — kept intact for analytics.ts / CookieBanner compat):
//        ConsentState = 'granted' | 'denied' | 'pending'
//        - 'pending' → no choice made yet. Analytics MUST NO-OP (R5).
//        - 'granted' → at least one tracking category opted in (analytics fires).
//        - 'denied'  → every tracking category opted out.
//        The analytics layer reads `hasConsented()` on every call, so a
//        'pending' or 'denied' state makes every tracking method a silent NO-OP.
//
//   2. Granular layer (B14 — full CMP, per-category controls):
//        preferences: { necessary, analytics, marketing }
//        - `necessary` is ALWAYS true and immutable (Strictly-necessary cookies
//          are exempt from consent under ePrivacy — the user cannot toggle it).
//        - `analytics` + `analytics` gates GA4 / GTM / CallRail (category key
//          'analytics'); `marketing` gates Meta CAPI / ad pixels (key 'marketing').
//        - `hasConsentFor(category)` answers the per-category question.
//
// R5: analytics must not fire before consent. R1: storage key is tenant-scoped.
// ─────────────────────────────────────────────────────────────────────────────

// ── Binary storage (B12) ─────────────────────────────────────────────────────
const CONSENT_KEY = 'dw_analytics_consent'

// ── Granular storage (B14) ───────────────────────────────────────────────────
// One record per tenant so a switch between clinics resurrects the right
// preferences (R1 — never a global key shared across tenants).
const CONSENTS_KEY = 'dw_consents'

export type ConsentState = 'granted' | 'denied' | 'pending'

/** Tracking categories surfaced in the CMP preferences modal (B14). */
export type ConsentCategory = 'necessary' | 'analytics' | 'marketing'

/**
 * The granular consent preferences of a single tenant.
 *
 * `necessary` is always `true`. It is stored alongside the others purely so a
 * persisted record is self-describing; setters MUST NOT flip it to false.
 */
export interface ConsentPreferences {
  necessary: true
  analytics: boolean
  marketing: boolean
}

// The categories that actually gate tracking calls — `necessary` is exempt from
// consent, so it never appears in the canTrack() calc.
const TRACKING_CATEGORIES: ReadonlyArray<Exclude<ConsentCategory, 'necessary'>> = [
  'analytics',
  'marketing',
]

// ── Granular storage helpers ─────────────────────────────────────────────────

/** Build the per-tenant storage key for a tenant's granular preferences. */
function consentsKey(tenantId: string): string {
  return `${CONSENTS_KEY}:${tenantId}`
}

/** Default preferences for a tenant the visitor has never seen. */
export function defaultPreferences(): ConsentPreferences {
  return { necessary: true, analytics: false, marketing: false }
}

/**
 * Read a tenant's granular preferences from localStorage.
 * Always returns a complete object — for a never-seen tenant this is the
 * pre-consent default (necessary on, everything else off).
 */
export function getConsentPreferences(tenantId: string): ConsentPreferences {
  try {
    const raw = localStorage.getItem(consentsKey(tenantId))
    if (!raw) return defaultPreferences()
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>
    // Defensive: never honor a persisted record that somehow disabled necessary.
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    }
  } catch {
    return defaultPreferences()
  }
}

/**
 * Persist a tenant's granular preferences.
 *
 * `necessary` is forced to `true` regardless of the input — strictly-necessary
 * cookies are exempt from consent under ePrivacy and MUST remain writable by the
 * site; the preferences modal disables that toggle accordingly.
 */
export function setConsentPreferences(
  tenantId: string,
  prefs: ConsentPreferences,
): void {
  const safe: ConsentPreferences = {
    necessary: true,
    analytics: Boolean(prefs.analytics),
    marketing: Boolean(prefs.marketing),
  }
  try {
    localStorage.setItem(consentsKey(tenantId), JSON.stringify(safe))
  } catch {
    /* localStorage unavailable (private mode, SSR) — ignore */
  }
  // Mirror the new granular choice onto the binary layer that the analytics
  // layer reads, then ping any listener. Without this, toggling a category from
  // the preferences modal would never wake the analytics layer (R5).
  syncBinaryState(tenantId)
  notifyBinary(getConsentState(tenantId))
}

// ── Binary layer → granular bridge ────────────────────────────────────────────
// The B12 analytics layer (`analytics.ts`, `CookieBanner`) reads the BINARY
// API only. To stay backward-compatible, every binary getter re-derives its
// answer from the tenant's granular preferences, and `grantConsent`/`denyConsent`
// write a fully-granted / fully-denied granular record then persist the legacy
// string. The two layers therefore cannot drift.

/** True when at least one tracking category is opted in for this tenant. */
function isEffectivelyGranted(tenantId: string): boolean {
  const prefs = getConsentPreferences(tenantId)
  return TRACKING_CATEGORIES.some((c) => prefs[c])
}

/** Re-derive + persist the legacy binary string for a tenant's preferences. */
function syncBinaryState(tenantId?: string): void {
  if (!tenantId) return // tenant-scoped prefs are stored granularly; no global write
  const state: ConsentState = isEffectivelyGranted(tenantId)
    ? 'granted'
    : 'denied'
  try {
    // Tenant-scoped binary mirror so getConsentState(tenantId) stays honest
    // without polluting the global legacy key (which would break isolation).
    localStorage.setItem(CONSENT_KEY + ':' + tenantId, state)
  } catch {
    /* localStorage unavailable — ignore */
  }
}

// ── Binary API (B12 — unchanged contract) ─────────────────────────────────────

/** Read the current binary consent state. Re-derived from granular prefs. */
export function getConsentState(tenantId?: string): ConsentState {
  try {
    // Check tenant-scoped binary mirror first (B14 tenant isolation).
    if (tenantId) {
      const scoped = localStorage.getItem(CONSENT_KEY + ':' + tenantId)
      if (scoped === 'granted' || scoped === 'denied' || scoped === 'pending') return scoped
    }
    // Fall back to the global legacy key (B12 single-tenant contract).
    const legacy = localStorage.getItem(CONSENT_KEY)
    if (legacy === 'granted') return 'granted'
    if (legacy === 'denied') return 'denied'
    if (legacy === 'pending') return 'pending'
  } catch {
    return 'pending'
  }
  // No binary record yet — derive from granular prefs if we have a tenant.
  if (tenantId && isEffectivelyGranted(tenantId)) return 'granted'
  return 'pending'
}

/** True only when at least one tracking category is opted in (B12 contract). */
export function hasConsented(tenantId?: string): boolean {
  return getConsentState(tenantId) === 'granted'
}

/**
 * Per-category consent check (B14). Returns false for unknown categories and
 * for `necessary`, which is consent-exempt and therefore never "consented" in
 * the tracking sense (it is simply always allowed).
 *
 * Pass `'any'` (or omit `category`) to replicate `hasConsented()` semantics.
 */
export function hasConsentFor(
  tenantId: string,
  category: ConsentCategory | 'any' = 'any',
): boolean {
  if (category === 'any') {
    // Fall back to the binary layer so identical callers get identical answers.
    return hasConsented(tenantId)
  }
  if (category === 'necessary') return true
  if (!TRACKING_CATEGORIES.includes(category as (typeof TRACKING_CATEGORIES)[number])) {
    return false
  }
  return getConsentPreferences(tenantId)[category]
}

/** Grant tracking consent (B12) — opts in every tracking category, then pings. */
export function grantConsent(tenantId?: string): void {
  if (tenantId) {
    setConsentPreferences(tenantId, {
      necessary: true,
      analytics: true,
      marketing: true,
    })
    notifyBinary('granted')
    return
  }
  // No tenant id → only the legacy binary record exists. Honor the B12 path.
  try {
    localStorage.setItem(CONSENT_KEY, 'granted')
  } catch {
    /* localStorage unavailable — ignore */
  }
  notifyBinary('granted')
}

/** Deny tracking consent (B12) — opts out every tracking category, then pings. */
export function denyConsent(tenantId?: string): void {
  if (tenantId) {
    setConsentPreferences(tenantId, {
      necessary: true,
      analytics: false,
      marketing: false,
    })
    notifyBinary('denied')
    return
  }
  try {
    localStorage.setItem(CONSENT_KEY, 'denied')
  } catch {
    /* localStorage unavailable — ignore */
  }
  notifyBinary('denied')
}

// ── Change notification (B12 — drives analytics layer activation) ─────────────

function notifyBinary(state: ConsentState): void {
  // Guard for non-browser contexts (node:test has no `window`).
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('dw:consent-changed', { detail: state }))
}
