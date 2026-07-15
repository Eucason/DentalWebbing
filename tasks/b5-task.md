# Task B5: Tenant-scoped LocalBusiness + Review schema

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Extend the existing JSON-LD schema generator to emit LocalBusiness (Dentist), Review, and AggregateRating schema types, tenant-scoped, from existing data (clinic-info + testimonials).

## Existing code to reuse
- `src/utils/jsonLd.ts` already builds Organization + FAQPage schema from clinic-info/faqs. EXTEND this file, don't rebuild.

## Files to modify

1. **`src/utils/jsonLd.ts`** — Add generators for:
   - `LocalBusiness` with `@type: "Dentist"` — uses clinic-info address, phone, name, geo (if available)
   - `Review` — built from testimonials data (quote + author + rating). Use pseudonyms only (R7).
   - `AggregateRating` — computed from testimonials collection (ratingValue, reviewCount). Auto-omit if zero reviews.

2. **`src/components/SEO.tsx`** (or wherever JSON-LD is rendered) — include the new schema types in the `<script type="application/ld+json">` output.

## Guardrails
- **R1 Zero Hardcoding** — no tenant-specific values in the generator; everything from clinic-info/testimonials data
- **R8 Tenant scoping** — schema is per-tenant via existing TenantContext
- Self-hides/omits schema blocks gracefully when source data is absent
- No diagnosis codes, meds, or procedure dates in schema (R7)

## Definition of Done
After all changes:
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. `node scripts/progress-tracker.js update B5 complete`
