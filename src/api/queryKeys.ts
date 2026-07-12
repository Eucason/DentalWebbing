/**
 * Central query-key registry.
 *
 * Every React Query hook in this codebase must import keys from here.
 * No raw string arrays should appear inside `useQuery` / `useInfiniteQuery`
 * calls — use `QUERY_KEYS.<name>(tenantId)` instead.
 *
 * Keys are scoped by `tenantId` so that React Query caches data
 * independently per clinic. Without this, switching the dev override
 * domain could serve stale data from the wrong tenant.
 */
export const QUERY_KEYS = Object.freeze({
  clinicInfo: (tenantId: string) => ['clinicInfo', tenantId] as const,
  doctors: (tenantId: string) => ['doctors', tenantId] as const,
  services: (tenantId: string) => ['services', tenantId] as const,
  testimonials: (tenantId: string) => ['testimonials', tenantId] as const,
  faqs: (tenantId: string) => ['faqs', tenantId] as const,
  page: (tenantId: string, slug: string) => ['page', tenantId, slug] as const,
})
