// ─────────────────────────────────────────────────────────────────────────────
// src/components/consent/CookieBanner.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Minimal consent banner. Renders only while consent is still 'pending' —
// once the user accepts or dismisses, the banner unmounts and analytics
// either activates (accept) or stays dormant (deny), per R5.
//
// Brand colours come from CSS custom properties set by TenantContext, so the
// banner inherits the tenant palette without any hex literals (arch-lint).
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { denyConsent, getConsentState, grantConsent } from '../../utils/consent'
import type { ConsentState } from '../../utils/consent'

export function CookieBanner() {
  const [state, setState] = useState<ConsentState>('pending')

  // Sync with the persisted state on mount (covers the case where the banner
  // mounts after another code path already wrote consent).
  useEffect(() => {
    setState(getConsentState())
  }, [])

  if (state !== 'pending') return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700">
          We use cookies and similar tools to measure site performance and
          improve your experience. No personal health information is ever
          collected. You can accept or decline analytics tracking below.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              denyConsent()
              setState('denied')
            }}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => {
              grantConsent()
              setState('granted')
            }}
            className="rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--tenant-primary)' }}
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  )
}
