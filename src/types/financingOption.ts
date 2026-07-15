/**
 * A single financing option accepted (or offered in-house) by the clinic.
 *
 * Sourced from the `financing_option` CPT. Operators classify each option as
 * either the clinic's own in-house plan (`is_in_house_plan === true`) or a
 * third-party lender — the UI renders the two with distinct styling so
 * patients can tell them apart at a glance.
 *
 * `monthly_payment_display` is an operator-edited, render-ready string
 * (e.g. "From £49/mo"). `pre_qualify_url` deep-links into the lender's
 * pre-qualification flow; when empty the card renders without a CTA.
 */
export interface FinancingOption {
  id: number
  slug: string
  /** Lender / plan name shown as the card headline. */
  provider_name: string
  /** Short supporting line describing the plan. */
  description: string
  /** `true` for the clinic's own in-house plan, `false` for third-party. */
  is_in_house_plan: boolean
  /** Operator-edited payment line, e.g. "From £49/mo". */
  monthly_payment_display: string
  /** Deep-link to the lender's pre-qualification flow (optional). */
  pre_qualify_url: string
  /** Whether this option is currently accepted / shown to patients. */
  accepted: boolean
  /** Lender logo URL (mapped from the WP featured media). */
  logo: string
  /** Sort order within the band (ascending). */
  display_order: number
}
