import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useApiClient } from './useApiClient'
import { fetchFaqs } from '../api/endpoints'
import { QUERY_KEYS } from '../api/queryKeys'
import { useTenantConfig } from '../context/useTenant'
import { MOCK_FAQS } from '../mocks/data'
import type { Faq } from '../types'

/**
 * Fetches the clinic's frequently-asked questions.
 *
 * `staleTime` is set to 10 minutes — FAQ content rarely changes mid-session.
 *
 * When `VITE_USE_MOCKS=true`, returns mock data without a network call.
 */
export function useFaqs(): Pick<UseQueryResult<Faq[]>, 'data' | 'isLoading' | 'isError'> {
  const tenantConfig = useTenantConfig()
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
  const api = useApiClient()

  const query = useQuery<Faq[]>({
    queryKey: QUERY_KEYS.faqs(tenantConfig.id),
    queryFn: useMocks ? () => Promise.resolve(MOCK_FAQS) : () => fetchFaqs(api),
    staleTime: 10 * 60 * 1000,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
