# Task B9: location CPT + amenity chips + office-tour gallery

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## DECISION (already recorded)
**`decision:B9-location-model`**: location CPT COEXISTS with clinic-info. clinic-info remains the single source of truth for single-location tenants. location CPT is additive for multi-location tenants only. MapSection/ContactSection read from clinic-info for single-location, and render one card per location for multi-location tenants. Single-location tenants are unaffected.

## What to do
Create a brand-new Custom Post Type `location` with amenity chips and office-tour gallery. NATIVE CPT — mirror `useDoctors()` pattern.

## Files to create/modify

1. **`src/hooks/useLocations.ts`** — New hook mirroring `useDoctors()`:
   - Fetches `GET /wp-json/wp/v2/location?_embed&per_page=100`
   - Maps to `Location` type
   - Uses useQuery with new QUERY_KEYS entry
   - Feature flag: `locationAmenities` (pass `{ defaultValue: false }` per R3)

2. **`src/types/location.ts`** — New type:
   - `address_line_1` (string)
   - `address_line_2` (string, optional)
   - `city` (string)
   - `state` (string)
   - `zip` (string)
   - `phone` (string)
   - `map_iframe_url` (string)
   - `hours` (array of `{ day: string, open: string, close: string }`)
   - `amenity_tags` (string[])
   - `office_photos` (string[] — image URLs)
   - `parking_notes` (string)

3. **`src/components/sections/LocationSection.tsx`** — Location cards + amenities + gallery:
   - For multi-location tenants: render one card per location
   - Each card: address, phone, hours, amenity chips (self-hide per-tag when absent)
   - Office-tour photo gallery (grid of office_photos)
   - Map embed via map_iframe_url (sandboxed iframe per R6)
   - Self-hides when zero locations (R2 — render null)
   - Feature flag gated

4. **`src/api/queryKeys.ts`** — Add `locations` key

5. **`src/api/endpoints.ts`** — Add `fetchLocations` mirroring `fetchDoctors`

6. **`src/mocks/data.ts`** — Add fixtures: at least 2 locations, one with full amenities, one with minimal data (edge case)

7. **`src/components/sections/index.ts`** — Export new section

8. **`src/pages/HomePage.tsx`** — Include section (behind flag)

## Guardrails
- **R1 Zero Hardcoding** — no hardcoded values
- **R2 Self-hide** — null when zero locations
- **R3 Flag default** — useFeatureFlag('locationAmenities', { defaultValue: false })
- **R6 Script isolation** — map iframe sandboxed
- **R8 Tenant scoping** — QUERY_KEYS factory + mirror useDoctors()
- **R9 Mock parity** — fixtures required

## Definition of Done
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. Confirmed: decision:B9-location-model recorded, mock fixtures, QUERY_KEYS entry, section wiring
5. `node scripts/progress-tracker.js update B9 complete`

Do NOT touch files outside this scope. Do NOT weaken R3.
