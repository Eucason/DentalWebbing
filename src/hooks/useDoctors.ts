import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { createApiClient } from '../api/client'
import { fetchDoctors } from '../api/endpoints'
import { QUERY_KEYS } from '../api/queryKeys'
import { useTenantConfig } from '../context/useTenant'
import { MOCK_DOCTORS } from '../mocks/data'
import type { Doctor } from '../types'

/**
 * Fetches the list of doctors for the resolved tenant.
 *
 * `staleTime` is set explicitly to the global default (5 minutes) so the
 * intent is obvious at the call site.
 *
 * `data` is always an array — never `undefined` — so callers can safely call
 * `.map()` without a guard.
 *
 * When `VITE_USE_MOCKS=true`, returns mock data without a network call.
 */
export function useDoctors(): Pick<UseQueryResult<Doctor[]>, 'data' | 'isLoading' | 'isError'> {
  const tenantConfig = useTenantConfig()
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

  const query = useQuery<Doctor[]>({
    queryKey: QUERY_KEYS.doctors,
    queryFn: useMocks
      ? () => Promise.resolve(MOCK_DOCTORS)
      : () => {
          const api = createApiClient(tenantConfig)
          return fetchDoctors(api)
        },
    staleTime: 5 * 60 * 1000,
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
