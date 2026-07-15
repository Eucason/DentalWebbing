# Task B13: Multi-channel mobile sticky CTA bar

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Create a tenant-configurable mobile sticky CTA bar at the bottom of the screen with expandable inline forms (no navigation away). Reference pattern: Dallas Cosmetic Dental 4-tab Phone/SMS/Email/Callback.

## Files to create/modify

1. **`src/components/sections/StickyCtaBar.tsx`** — New section/component:
   - Fixed position at bottom of viewport (mobile-first, can show on all sizes)
   - 4 configurable tabs: Phone, SMS, Email, Callback
   - Each tab expands an inline form when clicked (no navigation away — R2)
   - Tab config (icon, label, action) from tenant config — ZERO hardcoding (R1)
   - Feature flag: `stickyCta` (pass `{ defaultValue: false }` per R3)
   - Self-hides when no CTA channels configured (R2 — render null)
   - Smooth expand/collapse animation (respects prefers-reduced-motion)
   - Each expanded form: compact inline form matching the channel

2. **`src/types/tenant.ts`** — Add sticky CTA config type:
   - `stickyCta?: { channels: Array<'phone' | 'sms' | 'email' | 'callback'> }`

3. **`src/mocks/data.ts`** — Add `stickyCta` config to mock tenant config

4. **`src/components/sections/index.ts`** — Export new section

5. **`src/pages/HomePage.tsx`** — Include section (behind flag)

## Guardrails
- **R1 Zero Hardcoding** — tab labels/icons/actions from tenant config
- **R2 Self-hide** — null when no channels
- **R3 Flag default** — useFeatureFlag('stickyCta', { defaultValue: false })
- **R4 Non-PHI** — email/callback forms follow ContactForm Zod validation + disclaimer

## Definition of Done
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. Confirmed: tabs configurable per tenant, inline expand, mock data present
5. `node scripts/progress-tracker.js update B13 complete`
