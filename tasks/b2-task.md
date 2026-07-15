# Task B2: Testimonial video + source fields

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Extend the existing testimonials CPT to support video testimonials and source tracking. This is an ACF extension only — no new endpoint.

## Files to modify

1. **`src/hooks/useTestimonials.ts`** — Extend the Testimonial type and mapper to include: `video_url` (string), `video_thumbnail` (string), `source_platform` (string), `treatment_received` (string). These come through the existing WP REST API response as ACF properties.

2. **`src/components/sections/TestimonialsSection.tsx`** — When a testimonial has a `video_url`, render an inline HTML5 `<video>` player (with `controls` attr and `poster=video_thumbnail`) INSTEAD of the text quote layout. Otherwise keep existing layout. Show `source_platform` and `treatment_received` as small metadata text.

3. **`src/mocks/data.ts`** — Update testimonial fixtures to include the new fields. At least one fixture MUST have `video_url` set.

## Guardrails (MUST follow)
- **R1 Zero Hardcoding** — no hardcoded URLs, strings, or tenant-specific values in code
- **R2 Self-hide** — section renders null when testimonials array is empty (already does this, maintain it)
- **R9 Mock parity** — new fields MUST have fixtures in src/mocks/data.ts
- Do NOT add new feature flags
- Do NOT modify QUERY_KEYS (reuses existing testimonials key)
- Do NOT run `hermes` — you are already inside a hermes session

## Type
Extend the existing Testimonial type (add optional fields). No new type file needed.

## Definition of Done
After all changes, run in order:
1. `npm test` (must exit 0)
2. `node scripts/arch-lint.js` (must exit 0)
3. `npm run build` (must succeed)
4. `node scripts/progress-tracker.js update B2 complete`

Do NOT touch any files outside this scope. Do NOT weaken R3 flag defaults.
