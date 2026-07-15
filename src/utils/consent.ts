// ─────────────────────────────────────────────────────────────────────────────
// src/utils/consent.ts
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight consent state management for analytics tracking.
//
// Consent is persisted in localStorage so it survives reloads. The state is
// one of:
//   - 'granted' → user opted in to tracking
//   - 'denied'  → user opted out
//   - 'pending' → no choice made yet (default — analytics must NO-OP)
//
// R5: analytics must not fire before consent. The analytics layer reads
// `hasConsented()` on every call, so a 'pending' or 'denied' state means
// every tracking method is a silent NO-OP.
// ─────────────────────────────────────────────────────────────────────────────

const CONSENT_KEY = 'dw_analytics_consent'

export type ConsentState = 'granted' | 'denied' | 'pending'

/** Read the current consent state from localStorage. */
export function getConsentState(): ConsentState {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    if (v === 'granted') return 'granted'
    if (v === 'denied') return 'denied'
    return 'pending'
  } catch {
    // localStorage unavailable (private mode, SSR) → treat as pending.
    return 'pending'
  }
}

/** True only when the user has explicitly granted tracking consent. */
export function hasConsented(): boolean {
  return getConsentState() === 'granted'
}

/** Grant tracking consent and persist. */
export function grantConsent(): void {
  try {
    localStorage.setItem(CONSENT_KEY, 'granted')
  } catch {
    /* localStorage unavailable — ignore */
  }
  notify('granted')
}

/** Deny tracking consent and persist. */
export function denyConsent(): void {
  try {
    localStorage.setItem(CONSENT_KEY, 'denied')
  } catch {
    /* localStorage unavailable — ignore */
  }
  notify('denied')
}

// ── Change notification ─────────────────────────────────────────────────────
// Lets the analytics layer re-evaluate activation when consent flips after
// init (e.g. the user accepts the cookie banner).

function notify(state: ConsentState): void {
  window.dispatchEvent(new CustomEvent('dw:consent-changed', { detail: state }))
}
