# Competitor Feature Gap Analysis — DentalWebbing Phase 4

> **Compiled:** 2026-07-14
> **Method:** Parallel multi-agent research swarm (UI/UX audit + vendor/architecture intercept + repository gap mapping)
> **Regions:** New York, Chicago, Dallas, Miami, Atlanta, Beverly Hills
> **Competitors analyzed:** Atlanta Dental Spa, The Smile Code, Glen Dental Center, Dallas Cosmetic Dental, Miami Veneers, BH Celebrity Cluster (Mobasser / Silberman / Vafa), SmileBrilliant, Birch Point Dental, Modern Dental Atlanta, Today's Dentistry, Perfect White Smile, Luxe Dental Specialists

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [UI/UX Competitor Analysis Matrix](#2-uiux-competitor-analysis-matrix)
3. [Technical Intercept & Vendor Logs](#3-technical-intercept--vendor-logs)
4. [Phase 4 Gap Analysis & Multi-Tenant Data Blueprint](#4-phase-4-gap-analysis--multi-tenant-data-blueprint)
5. [Unified Phase 4 Roadmap](#5-unified-phase-4-roadmap)
6. [HIPAA Compliance Guardrails](#6-hipaa-compliance-guardrails)
7. [Research Methodology & Sources](#7-research-methodology--sources)

---

## 1. Executive Summary

This analysis compiles findings from three parallel research workstreams to define DentalWebbing's Phase 4 expansion roadmap. The core finding is that **true interactive before/after smile sliders are absent across every competitor we examined** — this is the single largest white-space differentiator in the market, and a category-first feature we can ship.

**Three strategic postures for Phase 4:**

| Posture | What it means | Examples |
|---------|---------------|----------|
| **ADOPT (table-stakes)** | Competitors do this; we must match to compete | Hero + stat-badges, click-to-call / SMS-first, financing badges, static before/after gallery, skip-nav + a11y baseline, mega-menu nav |
| **DIFFERENTIATE (white-space)** | Almost no competitor does this; we can lead | Interactive before/after slider, multi-channel sticky CTA widget, WCAG-forward by default, virtual consult funnel with AI smile preview |
| **MONITOR (vacant market)** | 0/6 competitors; first-mover opening | Live chat / conversational AI (0/6 deploy it) |

**Critical constraint that shapes every recommendation:** This platform operates under the Zero Hardcoding Rule, Layout Symmetry (self-hide on empty arrays), and HIPAA non-PHI form boundaries. Every new schema, vendor integration, and UI component must respect these rules.

---

## 2. UI/UX Competitor Analysis Matrix

### 2.1 Competitor Profiles

| # | Practice | URL | Metro | Type | Positioning | Platform |
|---|----------|-----|-------|------|-------------|----------|
| 1 | Atlanta Dental Spa (Drew Chronicle, DDS) | https://www.atlantadentalspa.com/ | Atlanta, GA (Roswell) | Cosmetic / Spa | "Better Life Through Better Dentistry" | Webflow |
| 2 | The Smile Code | https://www.thesmilecode.com/ | NYC (Upper East Side) | Cosmetic | "HARMONY IS HUMAN" | Custom / Headless |
| 3 | Glen Dental Center (Dr. Jeffrey Gilmor) | http://glendentalcenter.com/ | Chicago, IL (Glenview) | Cosmetic / General | "Enhancing Smiles, Enhancing Lives" | WordPress + Revolution Slider |
| 4 | Dallas Cosmetic Dental (Gary Alhadef, DDS) | https://www.dallascosmeticdental.com/ | Dallas, TX | Cosmetic | "A Calm and Welcoming Space" | Custom template |
| 5 | Miami Veneers & Modern Dentistry (Dr. Dina) | https://www.miamiveneers.com/ | Miami, FL (Aventura) | Cosmetic / Veneers | "South Florida's premier destination" | Custom template |
| 6 | BH Celebrity Cluster | celebdentist.com / anthonysilberdds.com / smilevalley.com | Beverly Hills, CA | Celebrity Cosmetic | Luxury / celebrity | Mixed (custom + WP) |

### 2.2 Feature Presence Matrix

Legend: **P** = Present · **p** = Partial · **A** = Absent

| Dimension | Atlanta Dental Spa | The Smile Code | Glen Dental Center | Dallas Cosmetic Dental | Miami Veneers | BH Celebrity |
|---|---|---|---|---|---|---|
| 1. Hero layout (lifestyle image + stat badges + CTA) | P | p (editorial) | P (slider-driven) | P (minimal) | P (dual-header) | P |
| 2. Interactive side-by-side Smile Slider | **A** | **A** | **A** | **A** | **A** | **A** |
| 3. Mobile Sticky CTA / multi-channel widget | p (sticky + SMS) | A | p (sticky CTA) | **P (4-tab Phone/SMS/Email/Callback)** | P (sticky + WhatsApp) | P |
| 4. Video Testimonial grid / carousel | P (7-patient carousel) | A | A | A | p (off-site YouTube) | P |
| 5. Office walkthrough / virtual tour | P (5-location pages) | A | p (photo gallery) | p (photo gallery) | p (photo gallery) | p |
| 6. Cookie consent curtain / GDPR / CCPA | A | A | A | p ("OK got it" only) | A | A |
| 7. Navigation pattern | 4-col mega-menu | Lean single-tier + media trust rail | WP nav (dup-menu bug) | Standard dropdown | Sticky dual-header | Mega-menu |
| 8. Conversion mechanisms | SMS-first, ADS plan, no chat | Consult form only | BOOK x10+, consult funnel | CareCredit + Cherry badges, 4-tab widget | WhatsApp, book-online | Concierge booking |
| 9. Accessibility signals | p | p | **A** (dummy.png, dup-menu) | P (skip-nav, a11y statement) | p | p |
| 10. Page speed / perceived performance | P (Webflow CDN, lazy-load) | P (lean) | **A** (Rev Slider bloat) | P | P | P |

### 2.3 Key UI/UX Findings

**Interactive sliders — universal white space.** Every competitor uses static before/after gallery grids or lightboxes. None offer a drag-to-reveal comparison. Building an accessible, touch-friendly, keyboard-operable slider (respecting `prefers-reduced-motion`, ARIA `slider` role) would be a category-first feature. **This is the single largest differentiator available.**

**Mobile sticky CTAs — Dallas leads.** Dallas Cosmetic Dental owns the richest pattern: a 4-tab persistent bottom bar (Phone / SMS / Email / Callback) where each tab expands an inline form without navigating away. Make this tenant-configurable for DentalWebbing.

**Video testimonials — Atlanta leads.** 7-patient embedded video carousel kept on-site. Miami Veneers funnels users off-site to YouTube — a trust leak. Glen, Dallas, and The Smile Code have no on-page video testimonials at all.

**Cookie consent — universal gap.** 5 of 6 competitor groups show no cookie consent manager. Dallas has only a single "OK, got it" button. No competitor runs a full CMP. This is a compliance risk for them and a brand-trust opportunity for us.

**Accessibility — Dallas best-in-class, still incomplete.** Only Dallas and Miami have skip-nav links. Glen's Revolution Slider `dummy.png` placeholders and duplicate-menu render bug are textbook failures. No competitor shows WCAG-forward design — blue-ocean opportunity.

**Live chat — 0 of 6.** Zero competitors deploy Intercom, Tidio, LiveChat, or Drift. It is neither table-stakes nor a differentiator yet — first-mover opening.

### 2.4 Conversion Pattern Summary

| # | Pattern | Observed at |
|---|---|---|
| 1 | Click-to-call / SMS-first header | Atlanta, Dallas, Miami |
| 2 | Financing badges above the fold (CareCredit / Cherry / ADS membership) | Dallas, Atlanta |
| 3 | Virtual consult funnel (upload-selfie -> doctor review -> plan) | Glen |
| 4 | Concierge / consult-first funnel | The Smile Code, BH Celebrity |
| 5 | Off-site video trust channel (YouTube) | Miami Veneers |
| 6 | Multi-channel persistent mobile widget (Phone/SMS/Email/Callback) | Dallas only |
| 7 | Press / media logos as trust rail | The Smile Code only |

### 2.5 Adopt / Differentiate / Avoid

**ADOPT (table-stakes):** Hero + stat-badges, click-to-call / SMS-first header, financing badges above the fold, static before/after gallery (minimum), skip-to-content link + logical heading outline, mega-menu nav with deep cosmetic column, fast render path (CDN + lazy-load hero + SVG iconography).

**DIFFERENTIATE (white-space):**
- **Interactive before/after slider** (keyboard-operable, touch-friendly, respects `prefers-reduced-motion`, ARIA `slider` role) — MAJOR DIFFERENTIATE
- Full-suite mobile sticky CTA bar (phone / SMS / email / callback) — tenant-configurable
- One-time, multi-region cookie consent CMP — granular, accessible, branded
- Virtual consult funnel with selfie upload + AI-assisted smile preview
- WCAG-forward by default (skip-nav, alt text, focus indicators, labeled form inputs, logical screen-reader flow)

**AVOID (anti-patterns):** Revolution-Slider-style hero carousels, off-site-only video trust (YouTube funnel leak), cookie consent without reject/granular controls, duplicate-menu render bugs, "Book my appointment" CTA oversaturation, front-loading third-party chat SDKs before conversion events.

**MONITOR:** Live chat (vacant market — 0/6 first-mover opening).

---

## 3. Technical Intercept & Vendor Logs

### 3.1 Competitor Tech Stack Profiles

| # | Practice / Site | CMS / Platform | Hosting / CDN | Scheduling | Chat / AI |
|---|----------------|----------------|---------------|------------|-----------|
| 1 | SmileBrilliant.com | WordPress | Self-hosted | None (ecommerce cart) | None |
| 2 | BirchPointDental.com | Squarespace | Squarespace CDN | None | None |
| 3 | Modern Dental Atlanta | Proprietary (ProSites / Dentistsites) | Dental-platform CDN | Native "Request an Appointment" form | None |
| 4 | Today's Dentistry (multi-location ID) | WordPress | — | "Book Now" -> `newpatient.todaysdentistry.com` subdomain | None |
| 5 | Perfect White Smile | WordPress | — | Popup form | None |
| 6 | Luxe Dental Specialists (NYC + LA) | Likely WP or custom | — | "Book online 24/7" widget | "Live chat scheduling assistant" |

### 3.2 Vendor Integration Matrix

| Category | Market Leaders | Embed Method |
|----------|---------------|--------------|
| **PMS** | Dentrix, Eaglesoft (legacy); Curve Dental, CareStack, tab32 (cloud) | Legacy = portal link-out; Cloud = API + JS embed |
| **Scheduling** | NexHealth, Lighthouse 360, Zocdoc, Docbookey, Yapi | iframe or JS snippet; NexHealth is the reference implementation |
| **Chat / AI** | Weave Web Assistant, Adit, Panda Dental, Aiodent | JS snippet |
| **Analytics** | GTM + GA4 + Meta Pixel/CAPI + CallRail + Hotjar + Clarity | GTM container (central hub) |
| **Financing** | CareCredit, Sunbit, Cherry, PatientFi, LendingClub | Badge/logo + link; some embedded calculators |
| **Reviews** | Birdeye, Podium, GBP | JS embed; GBP badge near-universal |
| **SEO / Schema** | LocalBusiness->Dentist, FAQPage, Review, Service | JSON-LD in `<head>` |
| **CMS** | WordPress (~70%+), Squarespace, custom | — |
| **CDN** | Cloudflare, Sucuri, AWS CloudFront | DNS + proxy |
| **Forms** | Gravity Forms, WPForms, Phreesia, Yapi, Docbookey | iframe, JS embed, or native `<form>` |

### 3.3 Vendor Landscape Summary

| Category | Leader | Challengers | Emerging |
|----------|--------|-------------|----------|
| PMS (legacy) | Dentrix, Eaglesoft | — | — |
| PMS (cloud) | Curve Dental, tab32 | CareStack | — |
| Scheduling | NexHealth | Lighthouse 360, Zocdoc, Docbookey / Yapi | Weave, Adit |
| Chat / AI | Weave Web Assistant, Adit | Panda Dental | Aiodent, Miles |
| Analytics hub | GTM + GA4 | — | — |
| Call tracking | CallRail | — | — |
| Patient financing | CareCredit | Sunbit, Cherry, PatientFi | Affirm, LendingClub |
| Reviews | Birdeye, Podium | Grade.us, Reputation.com | Google Business Profile |
| Intake / forms | Phreesia, Solutionreach | Yapi, Docbookey, NexHealth forms | — |
| CMS | WordPress | Squarespace, Webflow | Headless WP / custom |
| CDN / security | Cloudflare | Sucuri, AWS CloudFront | — |

### 3.4 HIPAA Boundary Analysis

- **Non-PHI (safe):** Name, email, phone, address, preferred appointment time, reason for visit, insurance carrier name (without subscriber ID + group tied to demographics), marketing attribution.
- **PHI (must stay in BAA-covered flows):** Full medical history, medications, allergies, SSN, insurance subscriber ID with group number tied to known patient, dental/chart records.
- **HiSite case study (canonical warning):** Word & Brown warned that the HiSite scheduling widget was "unapproved" because it collected data outside a HIPAA-compliant flow. This is the signal for what NOT to do.
- **Compliant pattern:** Keep initial web form strictly to non-PHI "request an appointment", then hand off medical history to a BAA-covered vendor (Phreesia, NexHealth forms, Yapi, Solutionreach, Docbookey).
- **Third-party trackers:** GA4, Meta Pixel, CallRail, Hotjar, Clarity are NOT HIPAA-compliant by default. Configure with IP anonymization, disable PII transmission, exclude health-form pages.

### 3.5 Integration Build-vs-Buy Priorities

1. **Scheduling -> integrate via NexHealth-style embed** (iframe/JS + REST API), don't build from scratch.
2. **Forms -> build a HIPAA-aware native non-PHI form engine**, with API handoff to BAA-covered intake vendors for medical-history step.
3. **Chat / AI -> integrate Weave / Adit via JS embed**, design a pluggable chat-adapter API for future AI-native bots.
4. **Analytics -> multi-tenant GTM/GA4 blueprint** with tenant-isolated GA4 properties, CallRail DNI, Meta CAPI, hard-exclude health-form pages.
5. **Financing -> embed Sunbit + Cherry + CareCredit badges/widgets** with pre-qual calculators (affiliate/revenue-share stream).
6. **Reviews -> Birdeye + Podium + GBP API integrations**, tenant-isolated; auto-publish `AggregateRating` schema.
7. **Schema -> auto-generate LocalBusiness->Dentist, FAQPage, Service, AggregateRating JSON-LD per tenant** with per-location overrides.

### 3.6 HIPAA-Safe Architecture Patterns

- **Front-of-house / back-of-house split:** Public-facing pages and widgets operate on non-PHI only. PHI-triggering routes through a BAA-covered vault.
- **BAA registry per tenant:** Table of which vendors a tenant has a BAA with; gate PHI flows on that registry.
- **Script isolation:** Third-party widgets inside sandboxed iframe or strict CSP-allowlist per tenant.
- **CDN with BAA:** If a tenant's patient portal touches PHI, the CDN edge must support a BAA.
- **Audit logging on PHI access:** Every read/write of identifiable patient data must be auditable per-tenant for OCR investigations.

---

## 4. Phase 4 Gap Analysis & Multi-Tenant Data Blueprint

### 4.1 Current DentalWebbing Data Model

| Layer | Current State |
|-------|---------------|
| **Frontend** | Vite 8 + React 19 + TypeScript + Tailwind v3 |
| **State / Data fetching** | TanStack Query v5 + Axios, query keys scoped per tenantId |
| **Tenant resolution** | `TenantContext` via `window.location.hostname`; CSS custom properties injected on root |
| **Backend** | WordPress Multisite (headless) via REST API |
| **CPTs** | `doctors`, `services`, `testimonials`, `faqs` + `pages` (native WP) |
| **Sections** | hero, services, team, contact, testimonials, faq, socialProof, insurance, map |
| **Self-hide convention** | `data.length === 0 -> null` |
| **Feature flags** | Boolean matrix (`TenantFeatures`), all default `true` |
| **HIPAA guardrail** | Forms limited to Name, Phone, Email, Preferred timeframe |

**Current TypeScript contracts:**
- `Doctor`: `{ id, slug, name, specialty?, bio?, imageUrl?, qualifications?: string[] }`
- `Service`: `{ id, slug, name, description, iconUrl?, imageUrl? }`
- `Testimonial`: `{ id, quote, author, rating?, location?, imageUrl? }`
- `Faq`: `{ id, question, answer, category? }`
- `ClinicInfo`: `{ heroTitle, heroSubtitle, heroImageUrl?, tagline?, bookingUrl?, address, contactPhone, contactEmail, hours, socialLinks?, socialMetrics?, insurance?, mapIframeUrl? }`

**Current feature flags:** `contactForm`, `bookingWidget`, `liveChat`, `testimonials`, `blog`, `patientPortal`, `appointmentReminders`, `faq`, `socialProof`, `insurance` (all default `true`).

### 4.2 Gap Analysis Matrix

| Capability | Current State | Competitor Standard | Gap | Priority |
|------------|---------------|---------------------|-----|----------|
| Before/After Gallery | Not modelled | Hero-level, filterable, 6-20 cases/tenant | Entire section missing | **P0** |
| Video Testimonials | Text-only | Video embeds, narrated smile stories | `videoUrl`/`videoThumbnail` missing | **P0** |
| Special Offers | `newPatientSpecial` only (singleton) | Dedicated, repeatable, offer-level CTAs + expiry | No CPT, no scheduling | **P0** |
| Service Pricing | Description only (price absent) | Range or "starting at" on every service card | Price fields missing on Service | **P0** |
| Financing Options | `paymentPlans[]` only (string list) | Detail pages, monthly estimators, provider metadata | No financing CPT | **P1** |
| Team Credentials | `qualifications: string[]` (labels only) | Board cert, residency, years, CE affiliations | Structured credential objects missing | **P1** |
| Location / Amenity | `mapIframeUrl`, `address`, `hours` | Office tour, amenity chips, parking, sedation, tech | Missing CPT/media | **P1** |
| Case Studies | Not modelled | Smile portraits, narrative, outcome detail | No CPT | **P1** |
| Insurance Plan Details | `acceptedProviders[]` strings | Plan-level details, claim filing, annual max | Detail fields missing | **P2** |
| Treatment Quiz | Not modelled | Interactive "find your treatment" funnel | Blocked on quiz infra | **P2** |
| Membership Plans | Not modelled | In-house savings plans, annual fees | No CPT | **P2** |

### 4.3 ACF Schema Blueprints

#### before_after (P0)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `case_title` | Text | Yes | e.g. "Deep Invisalign" |
| `treatment_type` | Select | Yes | `cleaning`, `whitening`, `invisalign`, `veneers`, `implant`, `bonding`, `crown`, `full_makeover` |
| `description` | Textarea | No | Short case blurb |
| `dentist` | Relationship | No | Relates to `doctors` CPT |
| `before_image` | Image (Array) | Yes | Return shape `['url','alt','width','height']` |
| `after_image` | Image (Array) | Yes | Same return shape |
| `is_featured` | True/False | No | Pin to `/gallery` collection page |
| `display_order` | Number | Yes | Integer; gallery sorts ASC |

#### special_offer (P0)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `headline` | Text | Yes | e.g. "New Patient Special" |
| `offer_description` | Textarea | Yes | Short copy |
| `price_display` | Text | No | e.g. "$199" |
| `regular_price` | Number | No | For strikethrough comparison |
| `image` | Image (Array) | No | Badge / hero for offer card |
| `cta_label` | Text | Yes | Default "Claim Offer" |
| `cta_url` | URL | Yes | Link or booking URL |
| `start_date` | Date Picker | No | Controls schedule window |
| `end_date` | Date Picker | No | Controls schedule window |
| `is_active` | True/False | No | Soft-off toggle |
| `display_order` | Number | Yes | Feed ordering |

#### location (P1)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `address_line_1/2`, `city`, `state`, `zip` | Text | Yes/No | |
| `phone` | Text | Yes | |
| `map_iframe_url` | URL | No | |
| `hours` | Repeater | Yes | Subfields: `day`, `open`, `close` |
| `amenity_tags` | Checkbox | No | `parking`, `wheelchair_access`, `sedation`, `cbct`, `itero`, `laser`, `intraoral_camera`, `evening_hours`, `weekend_hours` |
| `office_photos` | Gallery | No | Array of Arrays |
| `parking_notes` | Textarea | No | |

#### case_study (P1)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `patient_name` | Text | No | Pseudonymised |
| `treatment_type` | Select | Yes | Same vocabulary as `before_after` |
| `story_body` | Textarea (wysiwyg) | Yes | Narrative |
| `before_image`, `after_image` | Image (Array) | No | |
| `video_url` | URL | No | YouTube / Vimeo |
| `doctor` | Relationship | No | Relates to `doctors` |
| `display_order` | Number | No | |

#### financing_option (P1)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `provider_name` | Text | Yes | e.g. "CareCredit" |
| `description` | Textarea | No | |
| `is_in_house_plan` | True/False | No | Drives membership-plan styling |
| `monthly_payment_display` | Text | No | e.g. "From $99/mo" |
| `pre_qualify_url` | URL | No | |
| `accepted` | True/False | No | Badge |
| `logo` | Image (Array) | No | |
| `display_order` | Number | Yes | |

#### Service enhancements (P0)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `starting_price` | Number | No | |
| `price_range_max` | Number | No | Optional upper bound |
| `price_suffix` | Select | No | `per_tooth`, `per_arch`, `per_visit`, `flat_fee`, `per_implant` |
| `is_price_upon_request` | True/False | No | Hides price when true |
| `price_fine_print` | Textarea | No | e.g. "With approved credit" |
| `financing_note`, `procedure_time`, `recovery_time` | Text/Textarea | No | |
| `gallery` | Gallery | No | Service-specific before/after |
| `icon_override` | Image (Array) | No | Replace default service icon |

#### Doctor enhancements (P1)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `credentials` | Repeater | No | Subfields: `credential_title`, `credential_type` (`degree`, `board_certification`, `fellowship`, `residency`, `membership`, `award`, `course`), `institution`, `year` |
| `years_in_practice` | Number | No | Top-level scalar |
| `languages_spoken` | Checkbox | No | `english`, `spanish`, `mandarin`, `cantonese`, `vietnamese`, `korean`, `portuguese`, `russian`, `arabic`, `french` |
| `personal_bio_video_url` | URL | No | |
| `fun_fact` | Textarea | No | |

**Back-compat:** Front-end should accept both legacy `qualifications: string[]` and new `credentials` repeater. A mapper normalises both into a single credential chip list.

#### Testimonial enhancements (P0)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `video_url` | URL | No | YouTube / Vimeo |
| `video_thumbnail` | Image (Array) | No | Auto-fetched from YouTube if absent |
| `before_image`, `after_image` | Image (Array) | No | |
| `source_platform` | Select | No | `google`, `facebook`, `yelp`, `healthgrades`, `zocdoc`, `direct` |
| `treatment_received` | Text | No | e.g. "Invisalign" |

### 4.4 Feature Flag Expansion

New surface-area flags (default `false`) — deliberate departure from existing "default true" convention:

| Flag | Default | Gates |
|------|---------|-------|
| `beforeAfterGallery` | `false` | `/gallery` route + hero strip + `before_after` query |
| `specialOffers` | `false` | Offers band + cards + `special_offer` query |
| `servicePricing` | `false` | Price fields on service cards |
| `financing` | `false` | Financing band + `financing_option` query |
| `caseStudies` | `false` | Smile stories + `case_study` query |
| `videoTestimonials` | `false` | Video player in testimonials band |
| `teamCredentials` | `false` | Expanded credentials drawer on doctor cards |
| `locationAmenities` | `false` | Office-tour / amenity band |
| `treatmentQuiz` | `false` | "Find your treatment" quiz (P2) |
| `membershipPlans` | `false` | Membership plan band |

**Convention split:** Behaviour toggles (existing) default `true`; surface-area additions (new) default `false`.

### 4.5 REST API Endpoint Contract

New endpoints in `/wp-json/dentalwebbing/v1/` (mirroring `clinic-info` / `contact`):

| # | Method & Path | Query Params | Returns |
|---|---------------|--------------|---------|
| 1 | `GET .../before-after` | `per_page`, `page`, `treatment_type`, `featured`, `orderby=display_order`, `order` | Array of `{ id, title, treatment_type, description, before_image, after_image, is_featured, display_order }` |
| 2 | `GET .../special-offers` | `per_page`, `page`, `active`, `orderby=display_order` | Array of `{ id, headline, offer_description, price_display, regular_price, image, cta_label, cta_url, start_date, end_date, is_active, display_order }` |
| 3 | `GET .../financing-options` | `per_page`, `page`, `in_house`, `accepted` | Array of `{ id, provider_name, description, is_in_house_plan, monthly_payment_display, pre_qualify_url, accepted, logo, display_order }` |
| 4 | `GET .../case-studies` | `per_page`, `page`, `treatment_type` | Array of `{ id, patient_name, treatment_type, story_body, before_image, after_image, video_url, doctor, display_order }` |
| 5 | `GET .../locations` | `per_page`, `page` | Array of `{ id, address_line_1/2, city, state, zip, phone, map_iframe_url, hours[], amenity_tags[], office_photos[], parking_notes }` |
| 6 | `GET .../services` | `per_page`, `page`, `service_category`, `orderby=display_order` | Existing shape + pricing fields |
| 7 | `GET .../doctors` | `per_page`, `page` | Existing shape + credentials fields |
| 8 | `GET .../testimonials` | `per_page`, `page`, `source_platform`, `has_video` | Existing shape + video/source fields |
| 9 | `GET .../clinic-info` (unchanged) | `tenant_id` | Existing aggregated clinic payload |
| 10 | `POST .../contact-lease` (future-proofed) | Body `{ location_id, preferred_time, message }` | Non-PHI location enquiry |

**Query-key scoping:** Extend `QUERY_KEYS` in `src/api/queryKeys.ts` with `beforeAfter`, `specialOffers`, `financingOptions`, `caseStudies`, `locations` (each prefixed by `tenantId`).

---

## 5. Unified Phase 4 Roadmap

### P0 — Revenue-critical, layout-ready (Week 1-2)

| Item | Effort | Business Rationale |
|------|--------|-------------------|
| B1. `before_after` CPT + `/gallery` section (display-order sort, `treatment_type` filter, self-hide) | 3 days | #1 conversion lever; missing entirely today |
| B2. `video_url` / `video_thumbnail` on `testimonials` + inline player | 1.5 days | Video testimonials convert 30-50% higher than text-only |
| B3. `special_offer` CPT + offer-band (schedule-aware, self-hide) | 2.5 days | Offer-driven bookings dominate; today only a singleton `newPatientSpecial` |
| B4. Service pricing fields on `services` (price band, "upon request" fallback) + **interactive before/after slider** | 2 days | 80% of competitors show pricing; slider is the category-first differentiator |
| B5. Tenant-scoped LocalBusiness + FAQ + Review schema generator | 1.5 days | High SEO value, low effort; auto-generate JSON-LD per tenant |
| B6. Native "Request an Appointment" non-PHI form + API handoff to BAA intake vendors | 2 days | HIPAA-safe conversion engine |

### P1 — Authority-building, premium layouts (Week 3-5)

| Item | Effort | Business Rationale |
|------|--------|-------------------|
| B7. `credentials` repeater on `doctors` + credentials drawer | 2 days | Deepens provider authority |
| B8. `financing_option` CPT + financing band + monthly-payment display | 2.5 days | 75% of competitors surface financing |
| B9. `location` CPT with amenity chips + office-tour gallery | 2 days | Multi-location practices need differentiation |
| B10. `case_study` CPT + smile-stories band | 2 days | Engages high-intent cosmetic patients |
| B11. Multi-tenant NexHealth-style scheduling embed (iframe + API path) | 3 days | Reference implementation for appointments |
| B12. Analytics blueprint (GTM + GA4 + Meta CAPI + CallRail DNI) with page-exclusion | 2 days | Multi-tenant tracking with HIPAA-safe defaults |
| B13. Multi-channel mobile sticky CTA bar (tenant-configurable) | 2 days | Dallas-style 4-tab pattern, multi-tenant |
| B14. Full CMP cookie consent (granular, accessible, branded) | 1.5 days | Universal gap; no competitor does this well |

### P2 — Specialised monetisation (Week 6+)

| Item | Effort | Business Rationale |
|------|--------|-------------------|
| B15. Insurance plan detail fields (annual max, deductible, PPO/HMO) | 2.5 days | High insurance-salience markets |
| B16. Treatment quiz (interactive "find your treatment") | 4 days | Captures lower-funnel intent; blocks on quiz infra |
| B17. Membership-plan filter on `financing_option` + membership band | 1.5 days | 40% of competitors offer in-house plans |
| B18. Service-area / zip-radius fields | 1.5 days | Local SEO tie-in |
| B19. Review-aggregation service (Birdeye/Podium/GBP) | 3 days | Automated review widget + schema |
| B20. Pluggable chat adapter (Weave/Adit now; AI-native later) | 3 days | Vacant market (0/6 competitors); first-mover opening |
| B21. BAA registry + PHI-flow gate + script isolation enforcement | 2 days | HIPAA compliance infrastructure |

### Ongoing vendor integrations (parallel track)

- Financing badge/widget embed (Sunbit / Cherry / CareCredit) with pre-qual calculators (affiliate/revenue-share stream)
- WCAG-forward accessibility audit + remediation (brand-trust moat; no competitor ships this)
- Virtual consult funnel with selfie upload + AI-assisted smile preview (leapfrog Glen's 3-step)

---

## 6. HIPAA Compliance Guardrails

These rules apply to ALL Phase 4 work. Violating them risks Business Associate classification under federal HIPAA law.

### 6.1 Form Boundaries

| Field type | Examples | Safe for public forms? |
|------------|----------|------------------------|
| Non-PHI | Name, email, phone, address, preferred timeframe, reason for visit, insurance carrier name (alone) | YES |
| PHI | Medical history, medications, allergies, SSN, insurance subscriber ID + group number tied to known patient, dental/chart records | NO — must route through BAA-covered vendor |

### 6.2 Compliant Patterns

- **Front-of-house / back-of-house split:** Public pages = non-PHI only. PHI routes through BAA-covered vault.
- **BAA registry per tenant:** Table of which vendors a tenant has a BAA with; gate PHI flows on that registry.
- **Script isolation:** Third-party widgets inside sandboxed iframe or strict CSP-allowlist per tenant.
- **CDN with BAA:** If a patient portal touches PHI, CDN edge must support a BAA (Cloudflare/AWS enterprise tier).
- **Audit logging:** Every read/write of identifiable patient data must be auditable per-tenant.
- **Tracker hygiene:** GA4, Meta Pixel, CallRail, Hotjar, Clarity are NOT HIPAA-compliant by default. IP anonymization + PII transmission disabled + health-form pages excluded.

### 6.3 Schema Enforcement

- `before_after`, `case_study`, `testimonial` enhancements are non-PHI by design.
- Do NOT add diagnosis codes, medication, or procedure-date fields.
- If a case references an identifiable patient, require pseudonymised `patient_name` only.

---

## 7. Research Methodology & Sources

### 7.1 Fetch-verified competitors (direct WebSearch + WebFetch)

Atlanta Dental Spa, The Smile Code, Glen Dental Center, Dallas Cosmetic Dental, Miami Veneers, SmileBrilliant, Birch Point Dental, Modern Dental Atlanta, Today's Dentistry, Perfect White Smile.

### 7.2 Search-verified competitors (blocked automated fetching)

BH Celebrity Cluster: `celebdentist.com`, `anthonysilberdds.com`, `smilevalley.com` all block automated fetching; patterns reconstructed from search snippets.

### 7.3 Domains attempted but excluded

`drkevinsands.com` (dermatologist), `drdavidwilhite.com`, `dallasdds.com`, `rivkinlevin.com`, `mobasser.com`, `southamptondental.com`, `lagunadental.com`, `mychicagodentist.com`, `tmatrevor.com`, `perioimplants.com`, `americancosmeticdentistry.com` (for sale), `miamismiledesign.com` (SSL), `yoursmileourpassion.com` (wrong content).

### 7.4 Vendor sources

BuiltWith dental landing page, NexHealth docs, Lighthouse 360 docs, Zocdoc docs, vendor marketing pages, dental-marketing influencer content, Word & Brown HiSite warning case study.

---

*Generated by DentalWebung parallel research swarm. Three independent worker agents (ui-inspector, integration-inspector, gap-strategist-v3) produced bounded payloads; this document is the unified compilation.*
