# Task B6: Extend ContactForm for location-aware appointment requests + non-PHI intake handoff

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Extend the existing ContactForm to support location-aware appointment requests with non-PHI intake fields. Add a new REST endpoint for form submission.

## Existing code to reuse
- `src/components/sections/ContactForm.tsx` — already Zod-validates name/email/phone with a non-PHI disclaimer. REUSE this scaffolding.

## Files to modify

1. **`src/components/sections/ContactForm.tsx`** — Add new fields (all optional):
   - `location_id` (string, only relevant once location CPT exists — include as hidden/text field, no validation beyond string type)
   - `preferred_time` (string, free text like "morning", "afternoon", or specific time)
   - `reason_for_visit` (string, textarea, non-PHI free text)
   - Keep existing non-PHI disclaimer visible
   - Zod schema extends with these new optional fields

2. **`src/api/endpoints.ts`** — Add `submitContactLease` function:
   - POST to `/wp-json/dentalwebbing/v1/contact-lease`
   - Accepts the form data object
   - Uses existing `apiClient` POST method

3. **`src/api/queryKeys.ts`** — No new key needed (mutation, not query)

## Guardrails
- **R1** — no hardcoded endpoints beyond the REST path pattern
- **R2** — form still self-handles within ContactSection
- **R4** — NO medical history, meds, SSN, subscriber ID, or chart data. If any medical-history step is needed, it must be a hand-off link to a BAA-covered vendor (NexHealth/Phreesia), never a native field
- **R6** — any third-party handoff must be sandboxed
- Works with `VITE_USE_MOCKS=true` (mock submit path — just log to console and resolve)

## Definition of Done
After all changes:
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. `node scripts/progress-tracker.js update B6 complete`
