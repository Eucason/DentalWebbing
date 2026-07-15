# Task B10: case_study CPT + smile-stories band

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Create a brand-new Custom Post Type `case_study` with a smile-stories band section. NATIVE CPT — mirror `useDoctors()` pattern.

## Files to create/modify

1. **`src/hooks/useCaseStudies.ts`** — New hook mirroring `useDoctors()`:
   - Fetches `GET /wp-json/wp/v2/case-study?_embed&per_page=100`
   - Maps to `CaseStudy` type
   - Uses useQuery with new QUERY_KEYS entry
   - Feature flag: `caseStudies` (pass `{ defaultValue: false }` per R3)

2. **`src/types/caseStudy.ts`** — New type:
   - `patient_name` (string — pseudonym only, R7)
   - `treatment_type` (string)
   - `story_body` (string)
   - `before_image` (string URL)
   - `after_image` (string URL)
   - `video_url` (string, optional)
   - `doctor` (relationship — doctor ID or name)
   - `display_order` (number)

3. **`src/components/sections/CaseStudiesSection.tsx`** — Smile-stories band:
   - Cards showing before/after images (can use BeforeAfterSlider from B4)
   - Shows patient_name (pseudonym), treatment_type, story_body excerpt
   - If video_url present, show play button/link
   - Band self-hides with zero case studies (R2 — render null)
   - Feature flag gated

4. **`src/api/queryKeys.ts`** — Add `caseStudies` key

5. **`src/api/endpoints.ts`** — Add `fetchCaseStudies` mirroring `fetchDoctors`

6. **`src/mocks/data.ts`** — Add fixtures: at least 3 items, one with video_url, one without before/after images (tests edge case)

7. **`src/components/sections/index.ts`** — Export new section

8. **`src/pages/HomePage.tsx`** — Include section (behind flag)

## Guardrails
- **R1 Zero Hardcoding** — no hardcoded values
- **R2 Self-hide** — null when zero case studies
- **R3 Flag default** — useFeatureFlag('caseStudies', { defaultValue: false })
- **R7 Pseudonymization** — patient_name is pseudonym only, no diagnosis/procedure dates
- **R8 Tenant scoping** — QUERY_KEYS factory + mirror useDoctors()
- **R9 Mock parity** — fixtures required

## Definition of Done
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. Confirmed: mock fixtures, QUERY_KEYS entry, section wiring
5. `node scripts/progress-tracker.js update B10 complete`

Do NOT touch files outside this scope. Do NOT weaken R3.
