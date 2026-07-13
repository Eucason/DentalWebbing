# DentalWebbing - Progress

**Project:** A multi-tenant dental clinic frontend that resolves clinic branding, content, navigation, and API configuration from a WordPress-backed SaaS backend.
**Stack:** Vite 8 - React 19 - TypeScript 6 strict - React Router v7 - TanStack Query v5 - Axios - Tailwind CSS v3 - React Hook Form - Zod
**Last Updated:** 2026-07-13 - Claude Code

---

## Status
**In Progress**

Map & Location section shipped across the type, API, mock, skeleton, component, and layout layers. Verified green build and lint-clean.

---

## Up Next
- [ ] Update the WordPress tenant config endpoint to return `sections`, `navigation`, and `features`.
- [ ] Update the WordPress `dentalwebbing/v1/clinic-info` endpoint to return `mapIframeUrl` (sanitized Google Maps embed URL).
- [ ] Verify `GET /wp-json/wp/v2/pages?slug=...&_embed=true` against a real tenant and confirm the resolved base URL/path contract.
- [ ] Decide whether nested WordPress page paths should resolve by final slug only or full path hierarchy.
- [ ] Replace placeholder production API values in `.env.production` before deployment.

## Blockers / Open Questions
- Backend tenant config support is required before real clinics can manage nav, section visibility, or feature flags.
- Feature flags currently default to `true` for backwards compatibility. Confirm this business rule before onboarding tiered plans.
- Dynamic WordPress HTML is sanitized client-side with DOMPurify, but rich embeds may need an allowlist decision later.

---

## Completed Work

### Repository Formatting Baseline
Added a root `.editorconfig` and `.gitattributes` so the repo now standardizes on UTF-8, LF line endings, final newlines, and 2-space indentation for the main text-based file types. Normalized the tracked `vite.config.ts` blob to LF so Git no longer carries the mixed-ending outlier.

### Tenant Awareness And Theming
Implemented domain-based tenant resolution, sessionStorage caching, globally available tenant context, and runtime CSS custom properties for tenant colors. Tenant colors flow through Tailwind via `tenant.primary`, `tenant.secondary`, and `tenant.accent`.

### Data Layer And Page Assembly
Centralized WordPress REST fetching behind typed endpoint functions and React Query hooks. Built the visitor-facing pages, layout shell, SEO component, skeleton states, service/team/contact sections, and contact form workflow.

### Dynamic Pages And Tenant Controls
Added frontend contracts for tenant `sections`, `navigation`, and `features`. Header and footer now read navigation from tenant config with a safe default fallback. Home, Services, Team, and Contact page composition honors section visibility, and ContactSection gates the contact form behind the `contactForm` feature flag.

Added `DynamicPage`, `useWpPage`, `WpPage`, and `fetchPageBySlug` so unmatched routes can render WordPress pages by slug. WordPress-rendered HTML is sanitized with DOMPurify before DOM injection and styled with a local `.wp-content` Tailwind layer. React Query keys are tenant-scoped to prevent cross-tenant cache bleed.

Memoized tenant-scoped Axios clients across all data hooks via `useApiClient` to avoid garbage collection churn on query re-fetches.

### Mock Coverage
Mock mode now includes tenant navigation plus a sample `invisalign-special` WordPress page so the dynamic route can be tested offline with `VITE_USE_MOCKS=true`.

### Map & Location Section
Added a fully dynamic, accessible, responsive Map & Location section (`MapSection`). It shares the tenant `ClinicInfo` pipeline (extended with an optional `mapIframeUrl` field), so address, phone, hours and the embedded map resolve at runtime from the headless backend — zero hardcoded coordinates, keys or brand colours (all via `var(--tenant-*)` tokens and neutral slate). Includes a `map` section-visibility flag, a matching `MapSkeleton` for no-shift loading, presence-gating (online-only clinics return null), an `<dl>/<dt>/<dd>` hours list, a dynamic iframe `title`, an adjacent text address link for screen-reader/keyboard users, and a Google Directions fallback when no embed URL is present. Verified green build and lint-clean.

---

## Session Log

### 2026-07-13 - Claude Code
- Implemented `src/components/sections/MapSection.tsx` — dynamic, accessible (WCAG 2.1 AA), responsive map + location/contact section gating on a new `map` section flag.
- Extended `ClinicInfo` type + `fetchClinicInfo` ACF mapper + `MOCK_CLINIC_INFO` with `mapIframeUrl`.
- Added `MapSkeleton` to avoid layout shift during data load.
- Mounted `<MapSection />` (and `<ContactSection />`) on the Contact page, each independently gated by `useSectionVisible`.
- Excluded generated `.claude/` scaffolding from the ESLint pass (analogous to `dist`).
- Verified `npm run build` (tsc + vite) and `npm run lint` are green on app source.

### 2026-07-04 - GitHub Copilot
- Added root `.editorconfig` and `.gitattributes` to enforce UTF-8, LF, final newlines, and 2-space indentation across the repo.
- Normalized the only tracked text outlier, `vite.config.ts`, so both the working tree and Git index now report LF.
- Confirmed there were no existing root editor or Git attributes files causing conflicting formatting rules.
- Verified the repo baseline with `git ls-files --eol` after normalization.

### 2026-06-24
- Finished the partially started Phase 5/6 frontend work: dynamic catch-all routing, WordPress page fetching, tenant navigation, section visibility hooks, and feature flag hooks.
- Added DOMPurify for client-side sanitization of rendered WordPress page HTML.
- Scoped existing React Query keys by `tenantConfig.id` and added a page query key.
- Added mock navigation and a mock dynamic WordPress page for offline browser verification.
- Verified mock endpoints and 404 behavior.
- Cleaned up uncommitted progress and memoized `useApiClient` hook to prevent redundant client instantiation.
- Verified final state passes `npm run lint` and `npm run build`.
