export interface Service {
  id: number
  slug: string
  name: string
  description: string
  iconUrl?: string
  imageUrl?: string
  // ── B4 — pricing + procedure metadata (all optional for backwards-compat) ──
  /** Lower bound of the displayed price band. Null when not set. */
  starting_price?: number | null
  /** Upper bound of the displayed price band. Null when not set. */
  price_range_max?: number | null
  /** Unit shown after the price band, e.g. "per tooth", "per arch". */
  price_suffix?: string
  /** When true, the price band is hidden and "Price upon request" is shown instead. */
  is_price_upon_request?: boolean
  /** Small-print note rendered beneath the price band. */
  price_fine_print?: string
  /** Optional financing / payment-plan note. */
  financing_note?: string
  /** Estimated procedure duration, e.g. "60 min", "2 visits". */
  procedure_time?: string
  /** Estimated recovery window, e.g. "1–2 days". */
  recovery_time?: string
  /** Optional gallery of clinical image URLs (before/after). */
  gallery?: string[]
  /** Optional override for the service icon URL. */
  icon_override?: string
}
