import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApiClient } from './useApiClient'
import { fetchSpecialOffers } from '../api/endpoints'
import { QUERY_KEYS } from '../api/queryKeys'
import { useTenantConfig } from '../context/useTenant'
import { MOCK_SPECIAL_OFFERS } from '../mocks/data'
import type { SpecialOffer } from '../types'

/**
 * Returns the current date at midnight in the local timezone, used as the
 * reference point for the client-side active-window filter. Extracted so the
 * comparison is obvious and the filter is deterministic within a render.
 */
function todayAtMidnight(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/**
 * Parses an ISO date string (`YYYY-MM-DD` or full ISO datetime) into a
 * local-midnight Date derived from its calendar portion. Parsing the
 * date-only form with `new Date(str)` would treat it as UTC, which drifts
 * by timezone — anchoring to the local calendar day keeps the window
 * comparison consistent for a local clinic.
 */
function isoDateToLocalMidnight(str: string): Date {
  const parts = str.slice(0, 10).split('-').map((n) => parseInt(n, 10))
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return new Date(str)
  return new Date(parts[0], parts[1] - 1, parts[2])
}

/**
 * Returns true when `offer` should render: it is both manually active AND
 * today falls within its [start_date, end_date] window (inclusive).
 *
 * Offers with an empty start/end date are treated as having no bound on that
 * side, so a missing end_date still renders once the start has passed.
 */
export function isOfferInWindow(offer: SpecialOffer, today: Date = todayAtMidnight()): boolean {
  if (!offer.is_active) return false

  if (offer.start_date) {
    const start = isoDateToLocalMidnight(offer.start_date)
    if (Number.isNaN(start.getTime()) || today < start) return false
  }

  if (offer.end_date) {
    // end_date is inclusive → compare against the day after at midnight.
    const end = isoDateToLocalMidnight(offer.end_date)
    if (Number.isNaN(end.getTime())) return false
    const dayAfterEnd = new Date(end)
    dayAfterEnd.setDate(dayAfterEnd.getDate() + 1)
    if (today >= dayAfterEnd) return false
  }

  return true
}

/**
 * Fetches the list of special offers for the resolved tenant.
 *
 * `staleTime` is set explicitly to the global default (5 minutes) so the
 * intent is obvious at the call site.
 *
 * `data` is always an array — never `undefined` — so callers can safely call
 * `.map()` without a guard. The return type reflects that: `data` is typed as
 * a concrete `SpecialOffer[]`, not the nullable `UseQueryResult` shape.
 *
 * The returned list is client-side filtered to offers that are both manually
 * active (`is_active`) and within their start_date/end_date window, then
 * sorted by `display_order` ascending.
 *
 * When `VITE_USE_MOCKS=true`, returns mock data without a network call.
 */
export function useSpecialOffers(): {
  data: SpecialOffer[]
  isLoading: boolean
  isError: boolean
} {
  const tenantConfig = useTenantConfig()
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
  const api = useApiClient()

  const query = useQuery<SpecialOffer[]>({
    queryKey: QUERY_KEYS.specialOffers(tenantConfig.id),
    queryFn: useMocks
      ? () => Promise.resolve(MOCK_SPECIAL_OFFERS)
      : () => fetchSpecialOffers(api),
    staleTime: 5 * 60 * 1000,
  })

  const filtered = useMemo(() => {
    const source = query.data ?? []
    const today = todayAtMidnight()
    return source
      .filter((offer) => isOfferInWindow(offer, today))
      .sort((a, b) => a.display_order - b.display_order)
  }, [query.data])

  return {
    data: filtered,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
