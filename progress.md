# DentalWebbing - Progress

**Project:** A multi-tenant dental clinic frontend. Dynamically resolves clinic branding, content, and API configuration from a WordPress-backed SaaS backend. Built on Vite + React + TypeScript.
**Stack:** Vite 8 - React 19 - TypeScript 6 (strict) - React Router v7 - TanStack Query v5 - Axios - Tailwind CSS v3 - Prettier - ESLint
**Last Updated:** 2026-06-23 - Antigravity

---

## Status
In Progress

---

## Completed Tasks

| # | Task | Status |
|---|------|--------|
| 01 | Local Repository Setup | Done |
| 02 | Dependency Installation | Done |
| 03 | Environment Variables Configuration | Done |
| 04 | Folder Structure | Done |
| 05 | TypeScript Interface Definitions | Done |
| 06 | TenantContext Implementation | Done |
| 07 | Tailwind Theme Configuration | Done |
| 08 | Routing Setup | Done |
| 09 | API Client Layer | ✅ Done |
| 10 | React Query Configuration | ✅ Done |
| 11 | Skeleton UI Component System | 🔜 Next |
| 12 | Base UI Components | Pending |

---

## Up Next
- [ ] **Task 11:** Skeleton UI Component System — build `src/components/ui/Skeleton.tsx` as a reusable animated placeholder; create layout-matching skeleton variants for each data-fetching section.

## Blockers / Open Questions
- The real production API host and tenant config endpoint URL have placeholder values in `.env.production`. Update before any production deployment.
- `TenantLoadingFallback` and `TenantErrorPage` are inline plain-CSS. Once Task 11 (Skeleton) and Task 12 (Base UI) are done, consider replacing with those shared components.

---

## Completed Work (Detail)

### Task 10 — React Query Configuration
**File:** `src/main.tsx`

Added `QueryClient` with the global defaults specified by Phase 2 §2.10:
- `staleTime: 5 * 60 * 1000` — 5 minutes. Avoids redundant re-fetches for data that rarely changes.
- `retry: 1` — retries a failed request once before surfacing the error to the UI.
- `refetchOnWindowFocus: false` — prevents silent background refetches on tab-switch, which would cause unexpected loading states.

Wrapped the entire app tree in `<QueryClientProvider client={queryClient}>` in `main.tsx` (outermost provider, inside `StrictMode`, outside `App` so the client is accessible everywhere including `TenantProvider`).

`ReactQueryDevtools` is mounted inside the provider, conditionally rendered only when `import.meta.env.VITE_APP_ENV === 'development'` — no devtools bundle ever ships to production. The `isDev` constant is evaluated at module load time.

All checks pass: `tsc --noEmit` ✅ · `eslint .` ✅ · `prettier --write .` ✅

---

### Task 09 — API Client Layer
**Files:** `src/api/client.ts`, `src/api/endpoints.ts`

Built the centralized, tenant-aware API layer:

- **`createApiClient(tenantConfig)`** — Axios instance factory in `client.ts`. `baseURL` is built from `VITE_API_HOST` + `tenantConfig.apiSubdirectoryPath` so no infrastructure address exists anywhere else in source. Timeout set to 15 s.
- **Response interceptor** — all Axios errors are normalized into `ApiError` via `normalizeError()`. Handles three cases: server response with non-2xx status, no response (network/timeout), and request-setup failures. Downstream code (hooks, components) only ever sees the `ApiError` shape.
- **`endpoints.ts`** — all API calls as pure async functions that accept an `AxiosInstance` and return strict typed promises. No Axios calls exist outside this file.
  - `fetchTenantConfig(apiHost, configPath, domain)` — uses native `fetch` since it's called before the Axios client is created (in `TenantContext`).
  - `fetchDoctors(api)` — calls `/wp-json/wp/v2/doctors?_embed=true`, maps raw `WpPost` → `Doctor`, strips HTML from WP rendered fields.
  - `fetchServices(api)` — calls `/wp-json/wp/v2/services?_embed=true`, maps raw `WpPost` → `Service`.
  - `fetchClinicInfo(api)` — calls `/wp-json/dentalwebbing/v1/clinic-info`, maps ACF fields → `ClinicInfo`.
- `WpPost` raw type is private to `endpoints.ts` — nothing outside should know about WP REST shapes.
- All checks pass: `tsc --noEmit` ✅ · `eslint .` ✅ · `prettier --write .` ✅

---

### Task 08 - Routing Setup
**Files:** `src/App.tsx`, `src/router.tsx`, `src/components/layout/AppLayout.tsx`, `src/components/layout/RouteLoadingFallback.tsx`, `src/components/layout/RouteErrorFallback.tsx`, `src/components/ui/Skeleton.tsx`, `src/pages/HomePage.tsx`, `src/pages/ServicesPage.tsx`, `src/pages/TeamPage.tsx`, `src/pages/ContactPage.tsx`, `src/pages/NotFoundPage.tsx`

Replaced the starter Vite app with a React Router shell using `createBrowserRouter`, `createRoutesFromElements`, `Route`, and `RouterProvider`. Routing now lives in `src/router.tsx`, uses a named route config array, and lazy-loads page modules for `/`, `/services`, `/team`, `/contact`, and the catch-all `*` route.

Wrapped the router in `TenantProvider` so routes render only after tenant resolution reaches `ready`. Added a shared `AppLayout` layout route, route-level `errorElement` fallbacks, and a reusable `Skeleton` component used by `RouteLoadingFallback`.

Verification passed: `npm run build`, `npm run lint`, and `npm run format:check`. The production build emits separate page chunks for each lazy route.

---

### Task 07 - Tailwind Theme Configuration
**Files:** `tailwind.config.js`, `src/index.css`, `src/context/TenantContext.tsx`

Configured Tailwind to expose `tenant.primary`, `tenant.secondary`, and `tenant.accent` color tokens via `var(--tenant-primary)`, `var(--tenant-secondary)`, and `var(--tenant-accent)`. Added a safelist for dynamic tenant-aware text, background, border, ring, gradient, fill, and stroke utility classes, including common interactive variants.

Replaced `src/index.css` with the required Tailwind directives only. Removed an unused default React import from `TenantContext.tsx` that was blocking TypeScript build verification.

Verification passed: `npm run build`, `npm run lint`, and `npm run format:check`. Confirmed the production CSS includes generated tenant utilities such as `bg-tenant-primary`, `text-tenant-accent`, and `ring-tenant-secondary`.

---

### Task 06 - TenantContext Implementation
**File:** `src/context/TenantContext.tsx`

Implemented the top-level multi-tenant provider. Key design decisions:

- **Three-state machine:** `loading -> ready | error`. Children only mount when state is `ready`, ensuring no component ever receives a null config.
- **Domain resolution:** reads `VITE_DEV_OVERRIDE_DOMAIN` in development; falls back to `window.location.hostname` in all other environments.
- **SessionStorage cache with 30-minute TTL:** stored alongside a timestamp key. On mount, if a fresh cache hit is found, the API call is skipped entirely and colors are re-applied synchronously.
- **CSS custom properties:** `--tenant-primary`, `--tenant-secondary`, and `--tenant-accent` are written to `document.documentElement` on every successful resolution (cache or network).
- **Error handling:** development logs full error to console; a stub comment marks the production monitoring hook location (e.g. Sentry).
- **Hooks exported:** `useTenant()` (full state + nullable config) and `useTenantConfig()` (throws if not ready, for use in already-guarded components). Both carry `eslint-disable-next-line react-refresh/only-export-components` to satisfy the HMR linting rule while keeping the context and its hooks co-located.
- **Unbranded fallbacks:** `TenantLoadingFallback` (spinner + "Loading...") and `TenantErrorPage` (neutral error + Retry button) use only system-ui and neutral grays, with no tenant colors applied.
- All checks pass: `tsc --noEmit`, `eslint .`, `prettier --write .`.

---

### Task 05 - TypeScript Interface Definitions
**Files:** `src/types/tenant.ts`, `doctor.ts`, `service.ts`, `clinic.ts`, `api.ts`, `index.ts`

Defined the full data contract layer:
- `TenantConfig` - tenant resolution response shape including brand colors and API subdirectory path.
- `Doctor` - WP doctor post mapped to typed fields.
- `Service` - WP service post.
- `ClinicInfo` - hero content, hours, address, and contact details.
- `ApiError` - normalized error envelope for consistent error handling downstream.
- Barrel export at `src/types/index.ts` prevents import path fragmentation.

---

### Task 04 - Folder Structure
**Files:** `.gitkeep` in each required directory.

Created the Phase 2 directory skeleton under `src/`: `api/`, `components/layout/`, `components/ui/`, `components/sections/`, `context/`, `hooks/`, `pages/`, `types/`, `utils/`. Added `.gitkeep` files to preserve empty directories in Git.

---

### Task 03 - Environment Variables Configuration
**Files:** `.env.example`, `.env.development` (git-ignored), `.env.production` (git-ignored), `src/vite-env.d.ts`

Variables:
- `VITE_API_HOST` - base URL of the backend (DigitalOcean Droplet in dev, production domain in prod).
- `VITE_TENANT_CONFIG_PATH` - tenant resolution endpoint path (`/wp-json/dentalwebbing/v1/tenant`).
- `VITE_APP_ENV` - `development | staging | production`.
- `VITE_DEV_OVERRIDE_DOMAIN` - forces a specific tenant domain in development without a real DNS entry.

`vite-env.d.ts` declares a strict `ImportMetaEnv` interface so TypeScript catches missing/misspelled env variable access at compile time.

---

### Task 02 - Dependency Installation
**Runtime:** `react-router-dom`, `axios`, `@tanstack/react-query`, `@tanstack/react-query-devtools`, `react-error-boundary`.
**Dev:** `tailwindcss@3`, `postcss`, `autoprefixer`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `prettier`, `eslint-config-prettier`, `eslint-plugin-react-hooks`.

Ran `npx tailwindcss init -p` to generate `tailwind.config.js` + `postcss.config.js`. Added `format` and `format:check` scripts to `package.json`. Integrated `eslint-config-prettier` into the flat ESLint config.

---

### Task 01 - Local Repository Setup
Scaffolded workspace with `create-vite` (react-ts template). Git initialized and first commit made. `.gitignore` excludes `node_modules`, `dist`, all `.env*` (except `.env.example`), `docs/`, `tasks/`. TypeScript strict mode enabled across `tsconfig.app.json` and `tsconfig.node.json` before any application code was written.

---

## Session Log

### 2026-06-23 - Antigravity (Task 10)
- Created `QueryClient` in `main.tsx` with `staleTime: 5 min`, `retry: 1`, `refetchOnWindowFocus: false`.
- Wrapped app tree in `<QueryClientProvider>` as the outermost provider.
- Mounted `<ReactQueryDevtools>` inside the provider, gated on `VITE_APP_ENV === 'development'`.
- All checks pass: `tsc --noEmit` ✅ · `eslint .` ✅ · `prettier` ✅

### 2026-06-23 - Antigravity (Task 09)
- Created `src/api/client.ts` with `createApiClient(tenantConfig)` factory; `baseURL` derived entirely from env vars + resolved tenant path.
- Added response interceptor that normalizes all Axios errors to `ApiError` (server error, network error, and setup failure cases).
- Created `src/api/endpoints.ts` with `fetchTenantConfig`, `fetchDoctors`, `fetchServices`, and `fetchClinicInfo` as typed async functions.
- Raw WP REST shapes (`WpPost`) are private to `endpoints.ts`; nothing outside sees WordPress-specific structure.
- All checks pass: `tsc --noEmit` ✅ · `eslint .` ✅ · `prettier --write .` ✅

### 2026-06-23 - Codex (Task 08 refinement)
- Split route definitions into `src/router.tsx` and kept `App.tsx` focused on provider composition.
- Added a shared layout route through `AppLayout`, plus route-level `RouteErrorFallback` boundaries.
- Introduced a reusable `Skeleton` primitive and `RouteLoadingFallback` for lazy route loading.
- Converted page modules to render inside the shared layout frame instead of repeating the page shell.
- Re-verified with `npm run build`, `npm run lint`, and `npm run format:check`.

### 2026-06-23 - Codex (Task 08)
- Replaced the Vite starter UI in `App.tsx` with the required React Router configuration.
- Added lazy-loaded route modules for home, services, team, contact, and not-found pages.
- Wrapped `RouterProvider` with `TenantProvider` and a neutral `Suspense` route skeleton fallback.
- Verified with `npm run build`, `npm run lint`, and `npm run format:check`; build output shows separate lazy page chunks.

### 2026-06-23 - Codex (Task 07)
- Configured Tailwind tenant color tokens from runtime CSS custom properties.
- Added safelist coverage for dynamic tenant utility classes and common state variants.
- Replaced `src/index.css` with the required Tailwind base/components/utilities directives.
- Fixed the unused default React import in `TenantContext.tsx` so TypeScript build verification passes.
- Verified with `npm run build`, `npm run lint`, `npm run format:check`, and a generated CSS search for tenant utilities.

### 2026-06-23 - Antigravity (Task 06)
- Implemented `src/context/TenantContext.tsx` with three-state machine, TTL cache, CSS custom property injection, unbranded loading and error UIs.
- Exported `useTenant` and `useTenantConfig` hooks from the same file with targeted lint-disable comments.
- Added helper re-export file `src/context/useTenant.ts`.
- All linting, formatting, and TypeScript checks pass cleanly.

### 2026-06-23 - Antigravity (Task 05)
- Defined `TenantConfig`, `Doctor`, `Service`, `ClinicInfo`, `ApiError` interfaces in `src/types/`.
- Created barrel export `src/types/index.ts`.
- Verified strict TypeScript compilation.

### 2026-06-23 - Codex (Task 04)
- Created Phase 2 folder structure under `src/` with `.gitkeep` markers.

### 2026-06-22 - Antigravity (Task 03)
- Configured environment variables in `.env.example`, `.env.development`, `.env.production`.
- Created `src/vite-env.d.ts` for strict TypeScript env typings.

### 2026-06-22 - Antigravity (Task 02)
- Installed all runtime and dev dependencies.
- Generated Tailwind + PostCSS config, set up Prettier and ESLint.
- Added `format` / `format:check` scripts.

### 2026-06-22 - Antigravity (Task 01)
- Scaffolded Vite + React + TypeScript project.
- Configured `.gitignore`, environment file stubs, and TypeScript strict mode.
- Made initial Git commit.
