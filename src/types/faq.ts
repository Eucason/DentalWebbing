/**
 * A frequently-asked question for a dental clinic.
 *
 * `id`, `question`, `answer` are every FAQ's required core. `category` is
 * optional — when present the FAQ section groups questions under category
 * headings; when absent they render as a flat list.
 *
 * Sourced from a WordPress CPT (`faqs`) so clinics can expand the list from
 * the admin panel without a code change.
 */
export interface Faq {
  id: number
  question: string
  answer: string
  /** Optional grouping label, e.g. "Appointments", "Insurance & Billing". */
  category?: string
}

/**
 * Aggregate trust metrics for the clinic, surfaced by the SocialProof section.
 *
 * All fields are optional — the section self-hides when none are provided and
 * renders only the signals a clinic has supplied (no empty chips).
 */
export interface SocialMetrics {
  /** Google rating, e.g. 4.9. */
  googleRating?: number
  /** Total Google review count, e.g. 312. */
  googleReviewCount?: number
  /** Star rating from 1–5. */
  rating?: number
  /** Total review count across platforms. */
  reviewCount?: number
  /** Year the practice opened, used to render "Trusted since 2009". */
  yearsInBusiness?: number
  /** Verified accreditation label, e.g. "ADA Member". */
  accreditations?: string[]
  /** Short award/badge strings, e.g. "Top Dentist 2024". */
  awards?: string[]
}

 /**
  * Insurance & affordability configuration, surfaced by the Insurance section.
  *
  * All fields are optional — insurers and plans render as logo/text chips,
  * and the new-patient offer renders only when a headline is supplied.
  */
export interface InsuranceConfig {
  /** Accepted insurance provider display names. */
  acceptedProviders?: string[]
  /** Payment-plan / financing options. */
  paymentPlans?: string[]
  /** New-patient special. When omitted, the offer card is not rendered. */
  newPatientSpecial?: {
    headline: string
    description: string
    /** Optional price string, e.g. "£149". */
    price?: string
    /** CTA label, defaults to "Book now" if omitted. */
    ctaLabel?: string
    /** CTA href, defaults to the clinic booking URL / #contact. */
    ctaHref?: string
  }
}
