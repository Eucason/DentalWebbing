import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useApiClient } from './useApiClient'
import { fetchClinicInfo } from '../api/endpoints'
import { QUERY_KEYS } from '../api/queryKeys'
import { useTenantConfig } from '../context/useTenant'
import { MOCK_CLINIC_INFO } from '../mocks/data'
import type { ClinicInfo } from '../types'

/**
 * Fetches the resolved clinic's primary information (hero, address, hours, contact).
 *
 * `staleTime` is set to 10 minutes because clinic-level content rarely changes
 * during a user's session.
 *
 * When `VITE_USE_MOCKS=true`, returns mock data without a network call.
 */
export function useClinicInfo(): Pick<
  UseQueryResult<ClinicInfo>,
  'data' | 'isLoading' | 'isError'
> {
  const tenantConfig = useTenantConfig()
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
  const api = useApiClient()

  const query = useQuery<ClinicInfo>({
    queryKey: QUERY_KEYS.clinicInfo(tenantConfig.id),
    queryFn: useMocks
      ? () => Promise.resolve(MOCK_CLINIC_INFO)
      : () => fetchClinicInfo(api),
    staleTime: 10 * 60 * 1000,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
