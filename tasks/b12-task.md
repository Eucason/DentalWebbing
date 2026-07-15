# Task B12: Analytics blueprint (GTM + GA4 + Meta CAPI + CallRail DNI)

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Create an analytics integration layer that supports GTM, GA4, Meta CAPI (Conversions API), and CallRail DNI (Dynamic Number Insertion). This is an INFRA task — the analytics must NOT fire before cookie consent and must exclude PHI-adjacent routes.

## Files to create/modify

1. **`src/utils/analytics.ts`** — Analytics abstraction layer:
   - `initAnalytics(config: AnalyticsConfig)` — initializes GTM/GA4 from tenant config
   - `trackEvent(category, action, label?)` — fires GA4 event via gtag/dataLayer
   - `trackConversion(eventName, data?)` — fires Meta CAPI event via fetch (server-side proxy)
   - All methods are NO-OP if consent not yet given (gated by consent state)
   - All methods are NO-OP on health-form/contact routes (R5 — excluded routes)

2. **`src/types/analytics.ts`** — AnalyticsConfig type:
   - `gtmId?: string`
   - `ga4Id?: string`
   - `metaCapiPixelId?: string`
   - `metaCapiAccessToken?: string`
   - `callrailDniId?: string`

3. **`src/types/tenant.ts`** — Add `analytics?: AnalyticsConfig` to tenant config type

4. **`src/mocks/data.ts`** — Add analytics config to mock tenant config (use placeholder IDs like `GTM-XXXXXXX`)

5. **`src/App.tsx`** (or router level) — Initialize analytics on mount after consent is resolved

## Guardrails
- **R5 Tracker hygiene** — IP anonymization on, PII transmission disabled, health-form routes excluded
- NO hardcoded tracking IDs — all from tenant config
- Analytics MUST be consent-gated (no tracking before user consents)
- NO PII in any event payload

## Definition of Done
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. Confirmed: analytics no-ops without consent, excluded routes, mock data, no hardcoded IDs
5. `node scripts/progress-tracker.js update B12 complete`
