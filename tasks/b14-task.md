# Task B14: Full CMP cookie consent

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Create a full Consent Management Platform (CMP) cookie consent banner that integrates with the existing analytics layer (B12). Must have granular reject/accept controls, be branded via tenant CSS vars, and block trackers pre-consent.

## Files to create/modify

1. **`src/components/consent/CookieConsentModal.tsx`** — Full consent modal:
   - Two-step UX: initial banner with Accept All / Reject All / Preferences buttons
   - Preferences modal with granular toggles per category: Necessary (always on, disabled), Analytics, Marketing
   - Branded via tenant CSS vars (colors, fonts from useTenantColors())
   - Feature flag: `cookieConsent` (pass `{ defaultValue: false }` per R3)

2. **`src/utils/consent.ts`** (may already exist from B12) — Consent storage + management:
   - `hasConsented(): boolean` — returns current consent state
   - `getConsentPreferences()` — returns per-category consent
   - `setConsentPreferences(prefs)` — stores user choice
   - Persists to localStorage (tenant-scoped key)
   - NO tracking scripts load until `hasConsented()` returns true

3. **`src/types/tenant.ts`** — Add `cookieConsent?: boolean` flag

4. **`src/mocks/data.ts`** — Add cookieConsent flag to mock tenant config

5. **`src/App.tsx`** (or provider tree) — Integrate consent modal + gate analytics behind it

## Guardrails
- **R1 Zero Hardcoding** — no hardcoded copy/colors (tenant CSS vars)
- **R6 Script isolation** — blocks trackers pre-consent
- **R3 Flag default** — useFeatureFlag('cookieConsent', { defaultValue: false })
- Granular reject/accept controls (all-or-nothing is NOT acceptable)

## Definition of Done
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. Confirmed: granular controls, tenant branding, pre-consent blocking, mock data
5. `node scripts/progress-tracker.js update B14 complete`
