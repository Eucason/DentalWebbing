export interface ClinicInfo {
  heroTitle: string
  heroSubtitle: string
  heroImageUrl?: string
  /** Short eyebrow line displayed above the headline in the hero area. */
  tagline?: string
  /** Absolute URL for the booking system, or null to fall back to #contact. */
  bookingUrl?: string
  address: string
  contactPhone: string
  contactEmail: string
  hours: Record<string, string>
  socialLinks?: Record<string, string>
  /**
   * Sanitized Google Maps embed URL provided by the headless backend (ACF).
   * When present the section renders an interactive iframe; when absent it
   * falls back to a structured contact + directions layout.
   */
  mapIframeUrl?: string
}
