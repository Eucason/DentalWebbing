# Task B1: before_after CPT + gallery section

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Create a brand-new Custom Post Type `before_after` with a gallery section. This is a NATIVE CPT — mirror the `useDoctors()` hook pattern exactly.

## Files to create/modify

1. **`src/hooks/useBeforeAfter.ts`** — New hook mirroring `useDoctors()`:
   - Fetches `GET /wp-json/wp/v2/before-after?_embed&per_page=100`
   - Maps response to `BeforeAfter` type
   - Uses `useQuery` with a new QUERY_KEYS entry
   - Feature flag: `beforeAfterGallery` (must pass `{ defaultValue: false }` per R3)

2. **`src/types/beforeAfter.ts`** — New type with fields:
   - `case_title` (string)
   - `treatment_type` (string)
   - `description` (string)
   - `dentist` (relationship — doctor ID or name)
   - `before_image` (string URL)
   - `after_image` (string URL)
   - `is_featured` (boolean)
   - `display_order` (number)

3. **`src/components/sections/BeforeAfterSection.tsx`** — New section component:
   - Gallery/grid layout showing before/after cases
   - Filterable by treatment_type (client-side)
   - Sorted by display_order ASC, featured cases pin to top
   - Self-hides when array is empty (R2 — render null)
   - Feature flag gated

4. **`src/api/queryKeys.ts`** — Add `beforeAfter` key to the QUERY_KEYS factory

5. **`src/api/endpoints.ts`** — Add `fetchBeforeAfter` function mirroring `fetchDoctors`

6. **`src/mocks/data.ts`** — Add fixtures: at least 3 items, one with `is_featured: true`, varied `treatment_type`, varied `display_order`

7. **`src/components/sections/index.ts`** (or wherever sections are exported) — export the new section

8. **`src/pages/HomePage.tsx`** (or router) — include the new section in the home page layout (behind flag)

## Guardrails
- **R1 Zero Hardcoding** — no hardcoded URLs/strings/tenant values
- **R2 Self-hide** — render null when empty
- **R3 Flag default** — useFeatureFlag('beforeAfterGallery', { defaultValue: false })
- **R7 Pseudonymization** — no real patient names
- **R8 Tenant scoping** — new hook through QUERY_KEYS factory, mirror useDoctors()
- **R9 Mock parity** — fixtures in src/mocks/data.ts

## Definition of Done
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. Confirmed: mock fixtures exist, QUERY_KEYS entry exists, section exports/imports wired
5. `node scripts/progress-tracker.js update B1 complete`

Do NOT touch files outside this scope. Do NOT weaken R3. Do NOT add more than one new flag (`beforeAfterGallery`).
