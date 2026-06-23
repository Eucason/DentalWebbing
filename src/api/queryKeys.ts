/**
 * Central query-key registry.
 *
 * Every React Query hook in this codebase must import keys from here.
 * No raw string arrays should appear inside `useQuery` / `useInfiniteQuery`
 * calls — use `QUERY_KEYS.<name>` instead.
 */
export const QUERY_KEYS = Object.freeze({
  clinicInfo: ['clinicInfo'] as const,
  doctors: ['doctors'] as const,
  services: ['services'] as const,
})
