import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { createApiClient } from '../api/client'
import { fetchServices } from '../api/endpoints'
import { QUERY_KEYS } from '../api/queryKeys'
import { useTenantConfig } from '../context/useTenant'
import { MOCK_SERVICES } from '../mocks/data'
import type { Service } from '../types'

/**
 * Fetches the list of dental services for the resolved tenant.
 *
 * `data` is always an array — never `undefined` — so callers can safely call
 * `.map()` without a guard.
 *
 * When `VITE_USE_MOCKS=true`, returns mock data without a network call.
 */
export function useServices(): Pick<UseQueryResult<Service[]>, 'data' | 'isLoading' | 'isError'> {
  const tenantConfig = useTenantConfig()
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

  const query = useQuery<Service[]>({
    queryKey: QUERY_KEYS.services,
    queryFn: useMocks
      ? () => Promise.resolve(MOCK_SERVICES)
      : () => {
          const api = createApiClient(tenantConfig)
          return fetchServices(api)
        },
    staleTime: 5 * 60 * 1000,
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
