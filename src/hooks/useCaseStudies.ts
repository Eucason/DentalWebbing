import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useApiClient } from './useApiClient'
import { fetchCaseStudies } from '../api/endpoints'
import { QUERY_KEYS } from '../api/queryKeys'
import { useTenantConfig } from '../context/useTenant'
import { MOCK_CASE_STUDIES } from '../mocks/data'
import type { CaseStudy } from '../types'

/**
 * Fetches the list of patient case studies ("smile stories") for the
 * resolved tenant.
 *
 * `staleTime` is set explicitly to the global default (5 minutes) so the
 * intent is obvious at the call site.
 *
 * `data` is always an array — never `undefined` — so callers can safely call
 * `.map()` without a guard.
 *
 * When `VITE_USE_MOCKS=true`, returns mock data without a network call.
 */
export function useCaseStudies(): Pick<
  UseQueryResult<CaseStudy[]>,
  'data' | 'isLoading' | 'isError'
> {
  const tenantConfig = useTenantConfig()
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
  const api = useApiClient()

  const query = useQuery<CaseStudy[]>({
    queryKey: QUERY_KEYS.caseStudies(tenantConfig.id),
    queryFn: useMocks
      ? () => Promise.resolve(MOCK_CASE_STUDIES)
      : () => fetchCaseStudies(api),
    staleTime: 5 * 60 * 1000,
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
