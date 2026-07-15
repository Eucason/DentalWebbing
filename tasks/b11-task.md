# Task B11: Multi-tenant NexHealth-style scheduling embed

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Create a sandboxed third-party scheduling embed component. This is a THIRD-PARTY EMBED pattern — iframe or JS snippet, sandboxed per tenant.

## Files to create/modify

1. **`src/components/sections/SchedulingSection.tsx`** — New section:
   - Renders a sandboxed iframe for the scheduling vendor (NexHealth-style)
   - The iframe URL comes from tenant config (no hardcoded URLs — R1)
   - `sandbox` attribute on iframe per R6 (script but no top-navigation)
   - Feature flag: `scheduling` (pass `{ defaultValue: false }` per R3)
   - Self-hides when no scheduling URL is configured (R2 — render null)
   - Loading skeleton while iframe loads

2. **`src/types/tenant.ts`** — Add `scheduling_url?: string` and `scheduling?: boolean` flag to tenant config type

3. **`src/mocks/data.ts`** — Add `scheduling_url` to mock tenant config

4. **`src/components/sections/index.ts`** — Export new section

5. **`src/pages/HomePage.tsx`** — Include section (behind flag)

## Guardrails
- **R1 Zero Hardcoding** — URL from tenant config only
- **R4 HIPAA non-PHI** — no PHI crosses into analytics on this route
- **R6 Script isolation** — iframe sandboxed
- **R8 Tenant scoping** — per-tenant URL from config

## Definition of Done
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. Confirmed: iframe sandboxed, URL from tenant config, mock fixture
5. `node scripts/progress-tracker.js update B11 complete`
