/**
 * A patient testimonial for a dental clinic.
 *
 * `id`, `quote`, and `author` are every testimonial's required core.
 * `rating`, `location`, and `imageUrl` are optional — when the ACF fields
 * are absent the component renders cleanly without them (matching the
 * conditional-render convention in DoctorsSection / ServicesSection).
 *
 * The video + source fields are also ACF-driven and optional. When
 * `video_url` is present the section renders an inline HTML5 player
 * instead of the text-quote layout.
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
  /** Inline HTML5 video URL. When present, replaces the text-quote layout. */
  video_url?: string
  /** Optional poster image shown before a video plays. */
  video_thumbnail?: string
  /** Platform the review originated from, e.g. "Google", "Trustpilot". */
  source_platform?: string
  /** Treatment the patient received, e.g. "Invisalign", "Dental Implants". */
  treatment_received?: string
}
