# DentalWebbing

> A **multi-tenant headless React platform** that turns a single frontend build into branded websites for 50+ US dental practices — each with its own domain, colors, content, and feature set — deployed once to an Edge CDN at near-zero incremental hosting cost.

---

## Table of Contents

- [Overview & Economics](#overview--economics)
- [Why This Architecture](#why-this-architecture)
- [Core Section Matrix](#core-section-matrix)
- [Dual-Pipeline Data Architecture](#dual-pipeline-data-architecture)
- [Scaling 1 → 50 Clients](#scaling-1--50-clients)
- [Tech Stack & Dependencies](#tech-stack--dependencies)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Roadmap / Current Status](#roadmap--current-status)
- [Accessibility & Compliance](#accessibility--compliance)
- [Scripts](#scripts)

---

## Overview & Economics

DentalWebbing decouples the public-facing website of a dental clinic from its content store. One compiled frontend bundle is served globally from an Edge CDN and, at runtime, re-skins itself entirely from data based on which domain the visitor landed on.

| Metric | Value |
|---|---|
| Target scale | 50+ active US dental clinics |
| Incremental hosting overhead | **~$0/client/mo** — static assets on Cloudflare Pages / Netlify / Vercel Edge |
| Recurring revenue target | **$150 – $200/client/mo** → **$7,500 – $10,000/mo** at 50 clinics |
| Backend compute | Single headless **WordPress Multisite** engine on a small DigitalOcean Droplet (~$4 – $12/mo) |

A single production deployment rolls the whole network. One compliance patch, one shared-component upgrade, one security fix lands once and propagates to every live clinic instantly.

**Target market:** independent US dental practices, solo practitioners, and small multi-location groups. Content editors fall into two profiles — the ~85% who email the agency with changes ("do it for me"), and the ~15% who manage their own content through an isolated subsite dashboard ("control & content"). Neither profile ever touches frontend code.

---

## Why This Architecture

Five pillars govern every design decision (see `BuildPhilosophy.md`):

1. **Zero Hardcoding** — No string, color, route, or domain may assume a single clinic's identity. All context flows through the runtime `TenantContext`.
2. **Structural Layout Variance (presence-gating)** — Sections query their data and **self-hide** (render `null`) when the data is absent, so the layout snaps shut cleanly instead of leaving empty voids.
3. **Dynamic Page Scaling (catch-all routing)** — Bespoke pages (`/pages/:pageSlug`) resolve against the WordPress REST API. An operator can create unlimited pages without frontend changes.
4. **Design Isolation** — Visual identity lives in CSS custom properties injected onto `:root` (`document.documentElement`). Tailwind `tenant-*` tokens map to those variables via `var()`. No hex colors reach component code.
5. **Feature Flagging Matrix** — Every tenant carries a boolean feature vector. Toggling a flag mounts or suppresses a functional block without a redeploy.

---

## Core Section Matrix

Nine section components render the clinic site. Each is **data-driven**, **flag- or section-gated**, and degrades gracefully through a shared loading → error → resolved → (optional) self-hide state machine.

| # | Section | File | Data source | Gate | Behavior when data is missing |
|---|---|---|---|---|---|
| 1 | **Hero** | `HeroSection.tsx` | `useClinicInfo()` · `GET /dentalwebbing/v1/clinic-info` | `useSectionVisible('hero')` | Neutral error alert (always present — hero is the lead block) |
| 2 | **Services** | `ServicesSection.tsx` | `useServices()` · `GET /wp-json/wp/v2/services?_embed` | `useSectionVisible('services')` | Inline "coming soon" placeholder |
| 3 | **Doctors** | `DoctorsSection.tsx` | `useDoctors()` · `GET /wp-json/wp/v2/doctors?_embed` | `useSectionVisible('team')` | Inline "coming soon" placeholder |
| 4 | **Testimonials** | `TestimonialsSection.tsx` | `useTestimonials()` · `GET /wp-json/wp/v2/testimonials?_embed` | `useSectionVisible('testimonials')` | Inline "coming soon" placeholder; < 3 items degrade to a centered layout |
| 5 | **Social Proof** | `SocialProofSection.tsx` | `useClinicInfo().socialMetrics` · clinic-info | `useSectionVisible('socialProof')` | **Self-hides (`null`)** when no metrics; emits Organization JSON-LD |
| 6 | **Insurance** | `InsuranceSection.tsx` | `useClinicInfo().insurance` · clinic-info | `useSectionVisible('insurance')` | **Self-hides (`null`)** when no providers/plans/offer |
| 7 | **FAQ** | `FaqAccordionSection.tsx` | `useFaqs()` · `GET /wp-json/wp/v2/faqs?_embed` | `useSectionVisible('faq')` | **Self-hides (`null`)** when list is empty; grouped by category; emits FAQPage JSON-LD |
| 8 | **Contact** | `ContactSection.tsx` + `ContactForm.tsx` | `useClinicInfo()` (address / hours / phone / email) · clinic-info | `useSectionVisible('contact')` + `useFeatureFlag('contactForm')` | Form suppressed when flag is off; address/hours present when the section is on |
| 9 | **Map** | `MapSection.tsx` | `useClinicInfo()` (address / `mapIframeUrl`) + `useTenant().config.name` | Internal presence gate (`!address` → `null`) | Falls back to an address-card + directions panel when no `mapIframeUrl`; full section self-hides for online-only clinics |

**Status model shared by every section:** `isLoading` → shape-matched skeleton · `isError || !data` → neutral inline alert (no tenant colors, no crash) · `resolved` → content · (optional) empty-data self-hide to `null`.

---

## Dual-Pipeline Data Architecture

Two independent data pipelines hydrate the app on every page load.

### Pipeline A — The Routing Engine (`TenantContext`)

Reads `window.location.hostname`, resolves it to a **tenant config row**, injects branding, and gates the whole render.

```
window.location.hostname
   └─ resolveDomain()                       // honors VITE_DEV_OVERRIDE_DOMAIN in dev only
       └─ fetchTenantConfig()               // mount-only, single-shot
           ├─ 1. VITE_USE_MOCKS === 'true'  → MOCK_TENANT_CONFIG.colors, ready, return
           ├─ 2. sessionStorage cache         → valid inside the 30-min TTL? apply + return
           └─ 3. network fetch               → GET ${VITE_API_HOST}${VITE_TENANT_CONFIG_PATH}?domain=<domain>
                                              → apply colors + persistConfig (sessionStorage)
```

`applyTenantColors()` writes exactly three CSS custom properties onto `document.documentElement`:

```ts
root.style.setProperty('--tenant-primary',   colors.primary)
root.style.setProperty('--tenant-secondary', colors.secondary)
root.style.setProperty('--tenant-accent',    colors.accent)
```

Tailwind classes (`bg-tenant-primary`, `text-[var(--tenant-primary)]`, `--tenant-primary/90` alpha shorthands) resolve at runtime via those variables. **No Tailwind config is mutated at runtime; only the CSS custom properties change per tenant.**

The provider renders children only when `status === 'ready'` — `loading` shows an unbranded grey spinner and `error` shows a `Retry` page. Cache lives in **sessionStorage** (per-tab, 30-minute TTL, distinct from the localStorage-persisted a11y prefs).

Exports: `useTenant()` → `{ state, config | null }`; `useTenantConfig()` → guaranteed `TenantConfig` (throws before ready).

### Pipeline B — The Content Hydrator (`useClinicInfo()` + siblings)

Hooks hydrate localized schema and collection data through the WordPress REST API, scoped to the active tenant's `baseURL`:

| Hook | REST endpoint (relative to `baseURL`) | Default staleTime |
|---|---|---|
| `useClinicInfo()` | `GET /dentalwebbing/v1/clinic-info` | 10 min |
| `useDoctors()` | `GET /wp-json/wp/v2/doctors?_embed&per_page=100` | 5 min |
| `useServices()` | `GET /wp-json/wp/v2/services?_embed&per_page=100` | 5 min |
| `useTestimonials()` | `GET /wp-json/wp/v2/testimonials?_embed&per_page=100` | 5 min |
| `useFaqs()` | `GET /wp-json/wp/v2/faqs?_embed&per_page=100` | 10 min |
| `useWpPage(slug)` | `GET /wp-json/wp/v2/pages?slug=<slug>&_embed&per_page=1` | 10 min |

`createApiClient(tenantConfig)` builds `baseURL` from `${VITE_API_HOST}${tenantConfig.apiSubdirectoryPath}`, sets a 15 s timeout, and normalizes every error into `ApiError { status, message, code?, details? }`. The frozen QUERY_KEYS factory in `src/api/queryKeys.ts` embeds `tenantId` on every key, so multi-tenant dev-override domain swaps stay in isolated React-Query cache buckets.

### Mock toggle

Set `VITE_USE_MOCKS=true` and both pipelines short-circuit to typed local data in `src/mocks/data.ts`: a mock tenant (`mock-tenant-1`, domain `apexorthodontics.net`), six services, three doctors, six testimonials, five FAQs, and one mock WP page. Each hook and `ContactForm` checks the flag independently, so offline/local development touches no network.

---

## Scaling 1 → 50 Clients

### Zero-code onboarding

Adding **client #47** requires no frontend change and no redeploy:

1. Provision a subsite row in WordPress Multisite.
2. Add the tenant config row (domain → `TenantConfig`) returned by the tenant-config endpoint.
3. Configure ACF content (NAP + hours + `mapIframeUrl`, services, doctors, testimonials, FAQs, insurance, social metrics) through the headless dashboard.
4. Point the clinic's custom domain at the Edge CDN.

The bundle ingests the new domain at runtime and constructs every request path dynamically. `TenantContext` resolves the domain, `useSectionVisible` / `useFeatureFlag` apply the new row's section + feature matrix, and presence-gating takes care of the rest.

### Asymmetric layout mechanics

A "solo practitioner with no staff" and a "multi-location group with 12 surgeons" share one file tree. Sections self-hide when their data arrays are empty (`SocialProofSection` when no `socialMetrics`; `InsuranceSection` when no providers/plans/offer; `FaqAccordionSection` when the FAQ list is empty; `MapSection` when `address` is absent). List sections without data render inline "coming soon" placeholders so the layout never collapses into a mid-page void.

### Catch-all page routing

`/pages/:pageSlug` is a catch-all route resolved against `GET /wp-json/wp/v2/pages?slug=<slug>`. Rendered body HTML is sanitized client-side with **DOMPurify** before injection into a universal template wrapper. An unknown slug falls through to a clean 404 state with `<SEO title="Page not found">` and a "Return home" link. (The standalone `NotFoundPage.tsx` is currently orphaned legacy code; active 404 handling lives inside `DynamicPage.tsx`.) Operators can create unlimited pages from the admin panel without touching code.

### Operator profiles

- **~85% "do it for me"** — receptionists email the agency; the engineer updates content through the master dashboard. No CMS login, no layout tools.
- **~15% "control & content"** — multi-location / marketing coordinators get an isolated subsite upload dashboard for transformation photos and blogs, without access to the frontend repo.

---

## Tech Stack & Dependencies

### Runtime (exact pins)

| Package | Version |
|---|---|
| react / react-dom | `^19.2.6` |
| react-router-dom | `^7.18.0` |
| @tanstack/react-query | `^5.101.0` |
| axios | `^1.18.1` |
| tailwindcss | `^3.4.19` |
| react-hook-form | `^7.80.0` |
| @hookform/resolvers | `^5.4.0` |
| zod | `^4.4.3` |
| dompurify | `^3.4.11` |
| react-helmet-async | `^3.0.0` |
| react-error-boundary | `^6.1.2` |

### Dev

| Package | Version |
|---|---|
| typescript | `~6.0.2` (strict) |
| vite | `^8.0.12` |
| eslint | `^10.3.0` |
| prettier | `^3.8.4` |
| @vitejs/plugin-react | `^6.0.1` |

The production build emits minified static assets with `sourcemap: 'hidden'`, `assetsInlineLimit: 0`, and manual chunks split into `vendor-react`, `vendor-router`, `vendor-query`, and `vendor-http`. There is no base path, no proxy, and no tenant build-time define — tenancy is fully runtime.

---

## Getting Started

### Prerequisites

- Node.js (and npm).

### Install & run

```bash
npm install
npm run dev        # local Vite dev server
npm run build      # tsc -b && vite build  →  dist/
npm run preview    # preview the production build locally
npm run lint       # eslint .
npm run format     # prettier --write .
```

> There is **no `test` script** in `package.json` at this time.

### Environment variables

Create `.env.development` (and `.env.production` for deploy) from `.env.example`. The canonical variable list is inferred from `TenantContext.tsx` and `src/api/client.ts` (the `.env.*` files themselves are permission-denied in this session):

| Variable | Purpose |
|---|---|
| `VITE_API_HOST` | Base origin of the WordPress REST API |
| `VITE_TENANT_CONFIG_PATH` | Path of the tenant-config lookup endpoint |
| `VITE_DEV_OVERRIDE_DOMAIN` | Dev-only: force-resolve a specific clinic's hostname |
| `VITE_USE_MOCKS` | `true` to short-circuit both data pipelines to local mock data |
| `VITE_APP_ENV` (`development`/`production`) | Gates dev-only behaviors such as the domain override |

The tenant-config endpoint must return a `TenantConfig` JSON object at `GET ${VITE_API_HOST}${VITE_TENANT_CONFIG_PATH}?domain=<domain>`.

---

## Project Structure

```
DentalWebbing/
├── index.html                         # title "temp-vite" (placeholder), entry /src/main.tsx
├── vite.config.ts                     # sourcemap hidden, assetsInlineLimit 0, 4 vendor manualChunks
├── tailwind.config.js                 # tenant color scale (var-backed) + safelist regex
├── scripts/
│   ├── arch-lint.js                   # pre-commit zero-hex architectural gate (exit 0/1)
│   └── progress-tracker.js            # progress.json state machine + markdown mirror
├── src/
│   ├── main.tsx                       # mount root + dev-only React Query devtools
│   ├── App.tsx                        # Helmet → QueryClient → Tenant → Accessibility → Router
│   ├── router.tsx                     # / , /services, /team, /contact , * (DynamicPage)
│   ├── context/
│   │   ├── TenantContext.tsx          # domain → config resolution + CSS-var injection
│   │   ├── useTenant.ts               # re-export barrel for useTenant / useTenantConfig
│   │   └── AccessibilitySuiteContext.tsx  # tenant-scoped, localStorage WCAG prefs
│   ├── hooks/
│   │   ├── useApiClient.ts            # memoized Axios client keyed by tenant id + path
│   │   ├── useClinicInfo.ts           # NAP + hours + social + insurance + map payload
│   │   ├── useDoctors.ts · useServices.ts · useTestimonials.ts · useFaqs.ts
│   │   ├── useWpPage.ts               # catch-all page hydration
│   │   ├── useSectionVisible.ts       # opt-out section matrix (?? true)
│   │   └── useFeatureFlag.ts          # opt-out feature matrix (?? true)
│   ├── api/
│   │   ├── client.ts                  # createApiClient: baseURL + 15s timeout + error normalize
│   │   ├── endpoints.ts               # pre-Axios fetchTenantConfig + decode helpers
│   │   └── queryKeys.ts               # frozen, tenantId-scoped QUERY_KEYS factory
│   ├── types/                         # tenant, clinic (NAP), faq, doctor, service, api, page
│   ├── mocks/data.ts                  # mock tenant + collection fixtures for offline dev
│   ├── utils/jsonLd.ts                # Organization + FAQPage Schema.org builders
│   ├── pages/                         # HomePage, ServicesPage, TeamPage, ContactPage, DynamicPage
│   └── components/
│       ├── sections/                  # 9 tenant-driven sections
│       ├── ui/                        # Button (branded), Card + Skeleton (neutral)
│       ├── layout/                    # AppLayout (skip-link + polite announcer), Header, Footer
│       ├── accessibility/             # AccessibilityPanel (floating WCAG dock)
│       └── SEO.tsx                    # per-route react-helmet-async wrapper
├── progress.json                      # phase + blockers + Up Next / complete task ledger
├── Goal.md                            # macro vision, economics, operator profiles, HIPAA stance
└── BuildPhilosophy.md                 # 5 architectural pillars
```

Note: `src/pages/NotFoundPage.tsx` is currently unreferenced; all 404 handling is consolidated in `DynamicPage.tsx`.

---

## Roadmap / Current Status

Sourced directly from `progress.json` — the `tasks` and `blockers` arrays are the source of truth over the ornamental top-level `status` object.

### Phase

**Phase 3 in review.** Frontend foundations (Phases 1–2) and the Doctors/Services/Testimonials collection layer are in place; remaining work is dominated by backend contracts.

### Open blockers

1. **Backend tenant config endpoint** required before real clinics can manage nav, section visibility, or feature flags.
2. **Feature flags default to `true`** for backwards compatibility — confirm this business rule before onboarding tiered plans.
3. **DOMPurify allowlist** — rich embeds in dynamic-page HTML still need an explicit allowlist decision.

"Replace placeholder prod env values" is **not** a blocker — it is **Up Next task T_306**; no `.env.production` file exists to replace yet.

### Up Next

| ID | Task |
|---|---|
| T_301 | Commit + review `feat/testimonials-collection`; wire a dedicated `TestimonialsPage` if a full-list route is wanted |
| T_302 | Update the WordPress tenant-config endpoint to return `sections`, `navigation`, and `features` |
| T_303 | Verify `GET /wp-json/wp/v2/pages?slug=…&_embed=true` against a real tenant; confirm the base-URL/path contract |
| T_304 | Verify the `testimonials` CPT is registered and returns title + content + `rating`/`location` ACF fields |
| T_305 | Decide nested-page resolution: final-slug-only vs full path hierarchy |
| T_306 | Replace placeholder production API values in `.env.production` before deployment |

### Complete

- **T_307** — High-conversion sections (FAQ accordion + SEO JSON-LD, Social Proof trust bar + Organization JSON-LD, Insurance & payment options). Tenant-data-driven, self-hiding, flag-gated, zero hardcoding.
- **T_308** — WCAG 2.1 AA pass: skip-link, route focus reset, mobile-menu focus trap + Esc, global `:focus-visible` ring, fallback alt text, `<address>` for NAP, list structures, `sr-only` announcements.
- **ACCESSIBILITY_WIDGET** — Dynamic Accessibility Suite: `AccessibilitySuiteContext` provider, floating `<AccessibilityPanel />` dock, overlay classes applied to `<html>`.

---

## Accessibility & Compliance

### WCAG 2.1 AA suite

Tenant-scoped and persisted to `localStorage` keyed `dentalwebbing:a11y:${tenantId}`:

- **Text scale** — normal / large / large+ (root `font-size` 100% / 112.5% / 125%).
- **Contrast** — default / high (`contrast(175%)`) / inverted (`invert(1) hue-rotate(180deg)`, double-inverted on media) / monochrome (`grayscale(100%)`).
- **Dyslexic font** — `OpenDyslexic` / `Comic Sans MS` stack, `letter-spacing: 0.05em`.
- **Text spacing** — `letter-spacing: 0.12em`, `word-spacing: 0.16em`, `line-height: 1.6`.
- **Screen reader mode** — mounts an **assertive** live region (`role="alert"`) with clear-then-re-announce semantics.
- **Virtual pointer** — forces `min-width/min-height: 48px` on interactive targets.
- **Skip-link**, **route focus reset**, **mobile-menu focus trap** (WCAG 2.1.2), **global `:focus-visible` ring** (tenant-aware, `#2563eb` fallback), **keyboard-map cheat sheet**, **reset-to-defaults**.

Overlay colors for the panel are derived from `useTenantColors()` — no hardcoded hex reaches the panel control surface. (The pre-branding `TenantLoadingFallback` / `TenantErrorPage` fallback UI intentionally uses inline neutral hex; this is by design and falls outside the arch-lint scope.)

### HIPAA safe zone

DentalWebbing legally avoids **Business Associate** status under HIPAA by restricting the contact form to **non-PHI** routing parameters only: `name`, `email`, `phone` (optional, nullable), validated by **Zod**. The form carries an explicit "do not include PHI" disclaimer. Any request for deep clinical or insurance-data synchronization (Dentrix, Eaglesoft) is delegated — via embedded native scheduling widgets or a vetted middleware API such as NexHealth's Synchronizer API — rather than persisted through this frontend.

---

## Scripts

### `scripts/arch-lint.js`

A pre-commit architectural gate that catches what `git diff HEAD` silently skips: untracked files. It collects staged + modified + untracked `.tsx` paths under `src/components` and `src/pages`, and rejects any raw hex color literal (`/#[0-9a-fA-F]{3,6}\b/`, 3/4/6-digit) that isn't part of an innocuous `var(--tenant-*)` fallback.

```bash
node scripts/arch-lint.js        # exit 0 clean · exit 1 violation (lists file:line + hex)
```

- **Blind spot (by design):** `SCAN_DIRS` is scoped to `src/components` + `src/pages`. It does not inspect `src/context/*` (the unbranded fallback UIs) or `.css` / `.ts` files.
- **Not currently wired** to any hook, Husky, or CI pipeline — it is a **manual-only** gate. No CI/CD configuration exists in the repository at this time.

The script enforces BuildPhilosophy §1 (zero hardcoding) and §4 (design isolation): every component/presentation `.tsx` resolves color through tenant CSS custom properties or neutral Tailwind tokens.

### `scripts/progress-tracker.js`

A mutex-locked (5 min, `.tracker.lock`) state machine over `progress.json`.

```bash
node progress-tracker.js status
node progress-tracker.js update <TASK_ID> <pending|in_progress|complete>
```

On `complete` it runs architectural audits (no hardcoded URLs/IPv4 beyond localhost, no inline hex in the component diff) and runs `npm run build` as a sanity check, then marks the task and rewrites `progress.json`.
