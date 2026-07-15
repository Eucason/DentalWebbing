/**
 * A time-bound promotional offer for a dental clinic.
 *
 * `headline`, `offer_description`, `price_display`, `image`, `cta_label`,
 * and `cta_url` are every offer's required core. `regular_price` is optional
 * — when present the component renders it with a strikethrough beside the
 * promotional price.
 *
 * `start_date` / `end_date` (ISO 8601) define the display window; offers
 * outside it are filtered client-side (mirrors the testimonials hook's
 * client-side filtering pattern). `is_active` is a manual toggle. Offers are
 * sorted by `display_order` ascending.
 */
export interface SpecialOffer {
  id: number
  headline: string
  offer_description: string
  price_display: string
  /** Optional "before" price rendered with a strikethrough. */
  regular_price?: string
  image: string
  cta_label: string
  cta_url: string
  /** ISO 8601 start of the display window (inclusive). */
  start_date: string
  /** ISO 8601 end of the display window (inclusive). */
  end_date: string
  /** Manual active/inactive toggle. */
  is_active: boolean
  /** Sort key — lower values render first. */
  display_order: number
}
