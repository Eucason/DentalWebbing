# Task B21: BAA registry + PHI-flow gate + script isolation enforcement

You are working on the DentalWebbing multi-tenant TypeScript/React project at C:/MASTER/DentalWebbing.

## What to do
Create a per-tenant BAA (Business Associate Agreement) registry that gates PHI-adjacent flows. This is an INFRA task — it's a data layer + conditional logic, not a UI section.

## Files to create/modify

1. **`src/context/BaaRegistry.tsx`** — New React context provider:
   - Maintains a per-tenant registry of vendor BAA status
   - Shape: ` Record<string, { hasBaa: boolean, vendorName: string }> `
   - Provides `isBaaCleared(vendorKey: string): boolean` function
   - Reads initial data from tenant config (BaaRegistry field)
   - Provides `auditLog(action: string, vendorKey: string)` — logs PHI-adjacent reads/writes

2. **`src/hooks/useBaaGate.ts`** — Hook that wraps BAA checking:
   - `useBaaGate(vendorKey)` returns `{ cleared: boolean, audit: (action: string) => void }`
   - If a PHI-adjacent flow is attempted without a BAA on file, it blocks the operation

3. **`src/types/tenant.ts`** — Add `baa_registry?: Record<string, { hasBaa: boolean, vendorName: string }>` to tenant config type

4. **`src/mocks/data.ts`** — Add BAA registry mock data: at least 2 vendors, one with BAA, one without

5. **`src/App.tsx`** (or main provider tree) — Wrap app with `<BaaRegistryProvider>`

## Guardrails
- **R4 HIPAA non-PHI** — PHI-adjacent flows blocked if no BAA on file
- **R6 Script isolation** — vendors without BAA cannot load their scripts/embeds
- Audit log on every PHI-adjacent read/write

## Definition of Done
1. `npm test` (exit 0)
2. `node scripts/arch-lint.js` (exit 0)
3. `npm run build` (succeed)
4. Confirmed: BAA registry gates PHI flows, audit logging works, mock data present
5. `node scripts/progress-tracker.js update B21 complete`
