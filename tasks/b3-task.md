# Task B3: special_offer CPT + offer band

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Create a brand-new Custom Post Type `special_offer` with an offer band section. NATIVE CPT — mirror `useTestimonials()` hook pattern (client-side filtering).

## Files to create/modify

1. **`src/hooks/useSpecialOffers.ts`** — New hook mirroring `useTestimonials()`:
   - Fetches `GET /wp-json/wp/v2/special-offer?_embed&per_page=100`
   - Maps to `SpecialOffer` type
   - CLIENT-SIDE filters expired offers (outside start_date/end_date window) and is_active=false
   - Uses useQuery with new QUERY_KEYS entry
   - Feature flag: `specialOffers` (pass `{ defaultValue: false }` per R3)

2. **`src/types/specialOffer.ts`** — New type:
   - `headline` (string)
   - `offer_description` (string)
   - `price_display` (string)
   - `regular_price` (string, optional)
   - `image` (string URL)
   - `cta_label` (string)
   - `cta_url` (string)
   - `start_date` (string, ISO date)
   - `end_date` (string, ISO date)
   - `is_active` (boolean)
   - `display_order` (number)

3. **`src/components/sections/SpecialOffersSection.tsx`** — Offer band:
   - Renders active offers as a horizontal band/cards
   - Each card shows headline, price_display, regular_price (strikethrough if present), CTA button
   - Auto-hides outside start_date/end_date window (client-side filter)
   - Self-hides band with zero active offers (R2 — render null)
   - Feature flag gated

4. **`src/api/queryKeys.ts`** — Add `specialOffers` key

5. **`src/api/endpoints.ts`** — Add `fetchSpecialOffers` mirroring `fetchTestimonials`

6. **`src/mocks/data.ts`** — Add fixtures: at least 3 items, mix of active/inactive, mix of in-window/expired dates, one with regular_price

7. **`src/components/sections/index.ts`** — Export new section

8. **`src/pages/HomePage.tsx`** — Include section (behind flag)

## Guardrails
- **R1 Zero Hardcoding** — no hardcoded values
- **R2 Self-hide** — null when zero active offers
- **R3 Flag default** — useFeatureFlag('specialOffers', { defaultValue: false })
- **R8 Tenant scoping** — QUERY_KEYS factory + mirror existing hook pattern
- **R9 Mock parity** — fixtures required

## Definition of Done
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. Confirmed: mock fixtures, QUERY_KEYS entry, section wiring
5. `node scripts/progress-tracker.js update B3 complete`

Do NOT touch files outside this scope. Do NOT weaken R3.
