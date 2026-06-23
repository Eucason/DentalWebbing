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
}
