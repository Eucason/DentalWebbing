# Task B8: financing_option CPT + financing band

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Create a brand-new Custom Post Type `financing_option` with a financing band section. NATIVE CPT — mirror `useDoctors()` pattern.

## Files to create/modify

1. **`src/hooks/useFinancingOptions.ts`** — New hook mirroring `useDoctors()`:
   - Fetches `GET /wp-json/wp/v2/financing-option?_embed&per_page=100`
   - Maps to `FinancingOption` type
   - Uses useQuery with new QUERY_KEYS entry
   - Feature flag: `financing` (pass `{ defaultValue: false }` per R3)

2. **`src/types/financingOption.ts`** — New type:
   - `provider_name` (string)
   - `description` (string)
   - `is_in_house_plan` (boolean)
   - `monthly_payment_display` (string)
   - `pre_qualify_url` (string)
   - `accepted` (boolean)
   - `logo` (string URL)
   - `display_order` (number)

3. **`src/components/sections/FinancingSection.tsx`** — Financing band:
   - Renders financing options as cards/badges
   - `is_in_house_plan` drives distinct styling from third-party badges
   - Each card: logo, provider_name, description, monthly_payment_display, CTA linking to pre_qualify_url
   - Self-hides band with zero options (R2 — render null)
   - Feature flag gated

4. **`src/api/queryKeys.ts`** — Add `financingOptions` key

5. **`src/api/endpoints.ts`** — Add `fetchFinancingOptions` mirroring `fetchDoctors`

6. **`src/mocks/data.ts`** — Add fixtures: at least 3 items, mix of is_in_house_plan=true/false, one with pre_qualify_url

7. **`src/components/sections/index.ts`** — Export new section

8. **`src/pages/HomePage.tsx`** — Include section (behind flag)

## Guardrails
- **R1 Zero Hardcoding** — no hardcoded values
- **R2 Self-hide** — null when zero options
- **R3 Flag default** — useFeatureFlag('financing', { defaultValue: false })
- **R8 Tenant scoping** — QUERY_KEYS factory + mirror useDoctors()
- **R9 Mock parity** — fixtures required

## Definition of Done
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. Confirmed: mock fixtures, QUERY_KEYS entry, section wiring
5. `node scripts/progress-tracker.js update B8 complete`

Do NOT touch files outside this scope. Do NOT weaken R3.
