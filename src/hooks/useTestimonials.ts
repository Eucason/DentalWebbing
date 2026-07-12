import { useQuery } from '@tanstack/react-query'
import { useApiClient } from './useApiClient'
import { fetchTestimonials } from '../api/endpoints'
import { QUERY_KEYS } from '../api/queryKeys'
import { useTenantConfig } from '../context/useTenant'
import { MOCK_TESTIMONIALS } from '../mocks/data'
import type { Testimonial } from '../types'

/**
 * Fetches the list of patient testimonials for the resolved tenant.
 *
 * `staleTime` is set explicitly to the global default (5 minutes) so the
 * intent is obvious at the call site.
 *
 * `data` is always an array — never `undefined` — so callers can safely call
 * `.map()` without a guard. The return type reflects that: `data` is typed as
 * a concrete `Testimonial[]`, not the nullable `UseQueryResult` shape.
 *
 * When `VITE_USE_MOCKS=true`, returns mock data without a network call.
 */
export function useTestimonials(): {
  data: Testimonial[]
  isLoading: boolean
  isError: boolean
} {
  const tenantConfig = useTenantConfig()
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
  const api = useApiClient()

  const query = useQuery<Testimonial[]>({
    queryKey: QUERY_KEYS.testimonials(tenantConfig.id),
    queryFn: useMocks
      ? () => Promise.resolve(MOCK_TESTIMONIALS)
      : () => fetchTestimonials(api),
    staleTime: 5 * 60 * 1000,
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
