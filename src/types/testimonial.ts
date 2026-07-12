/**
 * A patient testimonial for a dental clinic.
 *
 * `id`, `quote`, and `author` are every testimonial's required core.
 * `rating`, `location`, and `imageUrl` are optional — when the ACF fields
 * are absent the component renders cleanly without them (matching the
 * conditional-render convention in DoctorsSection / ServicesSection).
 */
export interface Testimonial {
  id: number
  quote: string
  author: string
  /** Star rating from 1–5. */
  rating?: number
  /** Optional location/role label, e.g. "Spring Valley, NJ". */
  location?: string
  /** Optional patient avatar image. */
  imageUrl?: string
}
