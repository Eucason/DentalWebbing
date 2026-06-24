import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useApiClient } from './useApiClient'
import { fetchPageBySlug } from '../api/endpoints'
import { QUERY_KEYS } from '../api/queryKeys'
import { useTenantConfig } from '../context/useTenant'
import { MOCK_PAGES } from '../mocks/data'
import type { WpPage } from '../types'

/**
 * Fetches a single WordPress page by slug for the current tenant.
 *
 * Returns `null` when no page matches the slug, so callers can render a 404.
 */
export function useWpPage(
  slug: string
): Pick<UseQueryResult<WpPage | null>, 'data' | 'isLoading' | 'isError'> {
  const tenantConfig = useTenantConfig()
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
  const api = useApiClient()

  const query = useQuery<WpPage | null>({
    queryKey: QUERY_KEYS.page(tenantConfig.id, slug),
    queryFn: useMocks
      ? () => Promise.resolve(MOCK_PAGES.find((page) => page.slug === slug) ?? null)
      : () => fetchPageBySlug(api, slug),
    staleTime: 10 * 60 * 1000,
    enabled: slug.length > 0,
  })

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
