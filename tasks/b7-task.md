# Task B7: Doctor credentials repeater + drawer

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Extend the existing doctors CPT with a credentials repeater and add a drawer/modal that shows full credential details. This is an ACF EXTENSION — no new endpoint.

## Files to create/modify

1. **`src/types/doctor.ts`** — Extend Doctor type with:
   - `credentials` (array of: `{ credential_title: string, credential_type: string, institution: string, year: string }`)
   - `years_in_practice` (number)
   - `languages_spoken` (string[])
   - `personal_bio_video_url` (string, optional)
   - `fun_fact` (string, optional)

2. **`src/hooks/useDoctors.ts`** — Extend the mapper to read the new ACF fields from the existing endpoint response.

3. **`src/components/sections/DoctorsSection.tsx`** — Update to:
   - Show a subset of credentials as chips on the doctor card
   - Include a clickable element that opens a drawer/modal with full credentials list
   - Drawer self-hides with zero credentials (R2)
   - Show years_in_practice, languages_spoken as metadata
   - If `personal_bio_video_url` present, render small video thumbnail/link
   - Show `fun_fact` in drawer if present

4. **`src/mocks/data.ts`** — Update doctor fixtures: at least one doctor with 2+ credentials, one with zero credentials (to test drawer self-hide), one with personal_bio_video_url

## Guardrails
- **R1 Zero Hardcoding** — no hardcoded values
- **R2 Self-hide** — drawer self-hides with zero credentials
- **R3 Flag default** — gate new credential display with `useFeatureFlag('teamCredentials', { defaultValue: false })`
- **R8 Tenant scoping** — extend existing hook, no new endpoint
- **R9 Mock parity** — fixtures required with edge cases (0 credentials, many credentials)
- Mapper must normalise both legacy `qualifications[]` and new `credentials[]` repeater into one chip list — never branch UI on which shape arrived

## Definition of Done
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. Confirmed: mock fixtures have 0-credential doctor, multi-credential doctor, normalised chip list
5. `node scripts/progress-tracker.js update B7 complete`
