# DentalWebbing — Phase 4 Rules

Supplements `BuildPhilosophy.md` / `Goal.md` / `progress.json`. Task detail lives in
`phase4-tasks.json` — pull only the relevant card, never the full competitor report.

## Known conflict with root CLAUDE.md

- Root rule says `npm run build && npm test` after every change. **This repo has no
  test script yet.** Until one exists, Definition of Done below replaces `npm test`
  with `node scripts/arch-lint.js`. Don't silently skip the conflict — flag it if a
  task needs real test coverage added.

## Rules

- **R1 Zero Hardcoding** — no tenant-specific string/URL/ID/copy in code. Everything
  through `TenantContext`, ACF, or the feature/section matrix.
- **R2 Self-hide** — new Phase-4 sections render `null` on empty data (Insurance/FAQ
  pattern), not the Doctors/Services "coming soon" pattern.
- **R3 Flag default — BLOCKS ALL PHASE-4 FLAG WORK until resolved.**
  `useFeatureFlag`/`useSectionVisible` are opt-out (`?? true`). New flags will default
  `true` for existing tenants unless: (a) hooks take an explicit per-call default, or
  (b) tenant-config always returns explicit `false` for new keys. Resolve first. Don't
  add a flag before this lands.
- **R4 HIPAA non-PHI** — reuse `ContactForm.tsx`'s existing Zod/disclaimer scaffolding.
  Never add medical history, meds, SSN, subscriber ID, or chart data to any native
  form/CPT. PHI-adjacent → hand off to BAA vendor (NexHealth, Phreesia, Yapi,
  Solutionreach, Docbookey), never persisted here.
- **R5 Tracker hygiene** — IP anonymized, PII disabled, health-form routes excluded.
- **R6 Script isolation** — third-party widgets sandboxed iframe or per-tenant CSP.
- **R7 Pseudonymization** — `case_study.patient_name` / identifiable testimonials are
  pseudonyms only. No diagnosis codes, meds, or procedure dates in any schema.
- **R8 Tenant scoping** — new hooks go through the frozen `QUERY_KEYS` factory
  (`src/api/queryKeys.ts`). New CPTs use `GET /wp-json/wp/v2/{cpt}?_embed&per_page=100`
  (mirror `useDoctors()`) — not a new `dentalwebbing/v1` endpoint, unless it's a genuine
  aggregation/write like `clinic-info` or the `contact-lease` endpoint.
- **R9 Mock parity** — every new collection gets a fixture in `src/mocks/data.ts`.
  Not done if it only works against a live backend.

## Definition of Done (per task, overrides root `npm test` per above)

```bash
node scripts/arch-lint.js          # exit 0
npm run build                      # must succeed
# confirm mocks fixture + QUERY_KEYS entry exist for new collections
node scripts/progress-tracker.js update <TASK_ID> complete
```

## Coordination

Map each Phase-4 task to a named-agent pipeline (researcher → architect → coder →
tester → reviewer), scoped to one `phase4-tasks.json` item per pipeline run. Spawn all
agents in one message, `run_in_background: true`.

## Git

- Short-lived branch per task (`phase4/<TASK_ID>-<slug>`), merged to `main` immediately
  after Definition of Done passes — no long-lived `feat/phase4` branch. New flags ship
  `false` by default (once R3 is resolved), so merging early is safe.
- Branch dependents off `main` after the prerequisite merges, not off a sibling's open
  branch (`B1`→`B4`/`B10`, `B6`→`B11`→`B21`→`B20`).
- `--no-ff` merge so each task stays a single revertible unit.

## Open question — resolve before B9 (location CPT)

Does `location` supersede `clinic-info`'s singleton address/hours for multi-location
tenants, or coexist? `MapSection.tsx`/`ContactSection.tsx` currently read off
`clinic-info` directly. Record as `decision:B9-location-model` before writing code.
