import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useApiClient } from './useApiClient'
import { fetchFinancingOptions } from '../api/endpoints'
import { QUERY_KEYS } from '../api/queryKeys'
import { useTenantConfig } from '../context/useTenant'
import { MOCK_FINANCING_OPTIONS } from '../mocks/data'
import type { FinancingOption } from '../types'

/**
 * Fetches the list of financing options for the resolved tenant.
 *
 * `staleTime` is set explicitly to the global default (5 minutes) so the
 * intent is obvious at the call site.
 *
 * `data` is always an array — never `undefined` — so callers can safely call
 * `.map()` without a guard.
 *
 * When `VITE_USE_MOCKS=true`, returns mock data without a network call.
 */
export function useFinancingOptions(): Pick<
  UseQueryResult<FinancingOption[]>,
  'data' | 'isLoading' | 'isError'
> {
  const tenantConfig = useTenantConfig()
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
  const api = useApiClient()

  const query = useQuery<FinancingOption[]>({
    queryKey: QUERY_KEYS.financingOptions(tenantConfig.id),
    queryFn: useMocks
      ? () => Promise.resolve(MOCK_FINANCING_OPTIONS)
      : () => fetchFinancingOptions(api),
    staleTime: 5 * 60 * 1000,
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
