import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useApiClient } from './useApiClient'
import { fetchBeforeAfter } from '../api/endpoints'
import { QUERY_KEYS } from '../api/queryKeys'
import { useTenantConfig } from '../context/useTenant'
import { MOCK_BEFORE_AFTER } from '../mocks/data'
import type { BeforeAfter } from '../types'

/**
 * Fetches the list of before/after cases for the resolved tenant.
 *
 * `staleTime` is set explicitly to the global default (5 minutes) so the
 * intent is obvious at the call site.
 *
 * `data` is always an array — never `undefined` — so callers can safely call
 * `.map()` without a guard.
 *
 * When `VITE_USE_MOCKS=true`, returns mock data without a network call.
 */
export function useBeforeAfter(): Pick<UseQueryResult<BeforeAfter[]>, 'data' | 'isLoading' | 'isError'> {
  const tenantConfig = useTenantConfig()
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
  const api = useApiClient()

  const query = useQuery<BeforeAfter[]>({
    queryKey: QUERY_KEYS.beforeAfter(tenantConfig.id),
    queryFn: useMocks
      ? () => Promise.resolve(MOCK_BEFORE_AFTER)
      : () => fetchBeforeAfter(api),
    staleTime: 5 * 60 * 1000,
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
