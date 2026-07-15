export interface TenantNavigationItem {
  to: string
  label: string
  end?: boolean
}

export interface TenantSections {
  hero?: boolean
  services?: boolean
  team?: boolean
  contact?: boolean
  testimonials?: boolean
  faq?: boolean
  socialProof?: boolean
  insurance?: boolean
  /** Dynamic embedded-map + opening-hours / contact card section. */
  map?: boolean
}

export interface TenantFeatures {
  contactForm?: boolean
  bookingWidget?: boolean
  liveChat?: boolean
  testimonials?: boolean
  blog?: boolean
  patientPortal?: boolean
  appointmentReminders?: boolean
  faq?: boolean
  socialProof?: boolean
  insurance?: boolean
  // ── Phase-4 flags (opt-in; consumers pass { defaultValue: false }) ──────────
  /** B1 — before_after gallery section. */
  beforeAfterGallery?: boolean
  /** B3 — special_offer CPT + offer band section. */
  specialOffers?: boolean
  /** B4 — service pricing fields + before/after slider. */
  servicePricing?: boolean
  /** B7 — doctor credentials repeater + details drawer. */
  teamCredentials?: boolean
  /** B8 — financing_option CPT + financing band section. */
  financing?: boolean
}

export interface TenantConfig {
  id: string
  name: string
  domain: string
  apiSubdirectoryPath: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  logoUrl?: string
  contactEmail?: string
  contactPhone?: string
  address?: string

  /**
   * Per-clinic section visibility toggles.
   * Each key defaults to `true` when omitted, so existing tenant configs
   * continue to work without changes (backwards-compatible).
   */
  sections?: TenantSections

  /**
   * Custom navigation menu for this clinic.
   * When omitted, the app falls back to the default nav items
   * (Home, Services, Our Team, Contact).
   */
  navigation?: TenantNavigationItem[]

  /**
   * Feature flags for tiered pricing.
   * Each flag defaults to `true` when omitted so existing tenants
   * retain full functionality (backwards-compatible).
   */
  features?: TenantFeatures
}
