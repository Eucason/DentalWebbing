import type { InsuranceConfig, SocialMetrics } from './faq'

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
   * Aggregate trust metrics surfaced by the SocialProof section.
   * All fields optional — the section self-hides when no metric is supplied.
   */
  socialMetrics?: SocialMetrics
  /**
   * Insurance & affordability configuration surfaced by the Insurance section.
   * All fields optional — the section self-hides when no config is supplied.
   */
  insurance?: InsuranceConfig
}
