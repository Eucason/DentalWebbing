import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useApiClient } from './useApiClient'
import { fetchLocations } from '../api/endpoints'
import { QUERY_KEYS } from '../api/queryKeys'
import { useTenantConfig } from '../context/useTenant'
import { MOCK_LOCATIONS } from '../mocks/data'
import type { Location } from '../types'

/**
 * Fetches the list of locations for the resolved tenant.
 *
 * `staleTime` is set explicitly to the global default (5 minutes) so the
 * intent is obvious at the call site.
 *
 * `data` is always an array — never `undefined` — so callers can safely call
 * `.map()` without a guard.
 *
 * When `VITE_USE_MOCKS=true`, returns mock data without a network call.
 */
export function useLocations(): Pick<UseQueryResult<Location[]>, 'data' | 'isLoading' | 'isError'> {
  const tenantConfig = useTenantConfig()
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
  const api = useApiClient()

  const query = useQuery<Location[]>({
    queryKey: QUERY_KEYS.locations(tenantConfig.id),
    queryFn: useMocks
      ? () => Promise.resolve(MOCK_LOCATIONS)
      : () => fetchLocations(api),
    staleTime: 5 * 60 * 1000,
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
