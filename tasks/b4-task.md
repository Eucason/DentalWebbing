# Task B4: Service pricing fields + interactive before/after slider

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Extend the existing services CPT with pricing fields AND create a new interactive before/after slider component that consumes the before/after image shape from B1.

## Files to create/modify

1. **`src/types/service.ts`** (or wherever Service type lives) — Extend Service type with:
   - `starting_price` (number | null)
   - `price_range_max` (number | null)
   - `price_suffix` (string, e.g. "per tooth", "per arch")
   - `is_price_upon_request` (boolean)
   - `price_fine_print` (string)
   - `financing_note` (string)
   - `procedure_time` (string)
   - `recovery_time` (string)
   - `gallery` (string[] — array of image URLs)
   - `icon_override` (string URL)

2. **`src/hooks/useServices.ts`** — Extend the mapper to read new ACF fields from the existing endpoint response. NO new endpoint.

3. **`src/components/sections/ServicesSection.tsx`** — Update to render:
   - Price band: show `starting_price`–`price_range_max` with `price_suffix`
   - When `is_price_upon_request` is true, hide price band and show "Price upon request" text
   - Show `price_fine_print` as small note
   - Show `financing_note` if present
   - Show `procedure_time` and `recovery_time` as metadata

4. **`src/components/ui/BeforeAfterSlider.tsx`** — NEW shared component:
   - Keyboard-operable slider comparing two images (before/after)
   - Touch-friendly drag handle
   - ARIA `role="slider"` with proper aria-valuemin/aria-valuemax/aria-valuenow
   - Respects `prefers-reduced-motion`
   - Props: `beforeImage: string`, `afterImage: string`, `alt?: string`
   - Tenant CSS vars only — no hardcoded colors

5. **`src/mocks/data.ts`** — Update service fixtures to include new fields (mix: some with price, some with is_price_upon_request=true)

## Guardrails
- **R1 Zero Hardcoding** — no hardcoded values
- **R2 Self-hide** — price band hides when is_price_upon_request=true
- **R3 Flag default** — gate new pricing display with `useFeatureFlag('servicePricing', { defaultValue: false })`
- **R9 Mock parity** — fixtures required

## Definition of Done
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. Confirmed: slider has ARIA role, respects prefers-reduced-motion, mock fixtures updated
5. `node scripts/progress-tracker.js update B4 complete`
