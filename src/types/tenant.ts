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
  /** B10 — case_study CPT + smile-stories band. */
  caseStudies?: boolean
  /** B9 — location CPT + amenity chips + office-tour gallery. */
  locationAmenities?: boolean
  /** B11 — sandboxed NexHealth-style scheduling embed section. */
  scheduling?: boolean
  /** B13 — multi-channel mobile sticky CTA bar. */
  stickyCta?: boolean
  /** B14 — full CMP cookie consent modal (banner + granular preferences). */
  cookieConsent?: boolean
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
   * NexHealth-style scheduling-embed URL. When set, the SchedulingSection
   * renders a sandboxed iframe pointed at this origin. Optional — tenants
   * without it simply don't get a scheduling embed (R2 / R8).
   */
  schedulingUrl?: string

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

  /**
   * Per-tenant Business Associate Agreement (BAA) registry.
   *
   * Maps a stable vendor key → agreement status. PHI-adjacent flows
   * (scheduling embed, patient-portal hand-off, contact-lease intake)
   * MUST check `isBaaCleared(vendorKey)` before executing; vendors
   * without a BAA on file are blocked from loading their scripts/embeds
   * (R4 HIPAA non-PHI, R6 script isolation).
   *
   * Optional — tenants without a registry entry simply have no BAA-gated
   * vendors configured (backwards-compatible).
   */
  baa_registry?: Record<string, { hasBaa: boolean; vendorName: string }>

  /**
   * Per-tenant analytics integration config (GTM + GA4 + Meta CAPI + CallRail DNI).
   *
   * All tracking IDs are resolved from this object — never hardcoded (R1).
   * The analytics layer is consent-gated and PHI-route-excluded (R5): even
   * when this field is populated, NO tracking fires until the user grants
   * consent AND the current route is not a PHI-adjacent excluded route
   * (/contact, /health-form). See src/utils/analytics.ts.
   *
   * Optional — tenants without an analytics block simply get no tracking
   * at all (backwards-compatible).
   */
  analytics?: import('./analytics').AnalyticsConfig

  /**
   * Per-tenant multi-channel mobile sticky CTA bar configuration.
   *
   * Drives which contact channels (phone / sms / email / callback) appear as
   * fixed-bottom tabs, each expanding an inline form — never hardcoded in
   * component code (R1). The set of tabs is derived from `channels` in
   * full. When omitted or empty, the bar self-hides (R2).
   *
   * Optional — tenants without a sticky-CTA config simply get no bar
   * (backwards-compatible).
   */
  stickyCta?: {
    channels: Array<'phone' | 'sms' | 'email' | 'callback'>
  }
}
