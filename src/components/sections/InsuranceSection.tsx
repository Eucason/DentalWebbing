import { Link } from 'react-router-dom'
import { useClinicInfo } from '../../hooks/useClinicInfo'
import { InsuranceSkeleton } from '../ui/Skeleton'
import type { InsuranceConfig } from '../../types'

/** Matches Button's `variant="primary" size="lg"` styling for use on an anchor/Link. */
const CTA_LINK_CLASSES =
  'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 px-6 py-3 text-lg bg-[var(--tenant-primary)] text-white hover:bg-[var(--tenant-primary)]/90 focus:ring-[var(--tenant-primary)]'

// ---------------------------------------------------------------------------
// InsuranceSection
// ---------------------------------------------------------------------------
// Consumes `useClinicInfo().data.insurance` and renders a conversion-focused
// affordability block: accepted-insurance chips, payment-plan chips, and a
// glassmorphic new-patient offer card.
//
// Self-hide rule (STRUCTURAL — not cosmetic):
//   - `insurance` undefined                         → render nothing
//   - every field within it undefined/empty         → render nothing
//   This guarantees a flawless solo-practitioner layout when an insurer
//   hasn't populated affordability data.
//
// State machine:
//   isLoading → <InsuranceSkeleton />
//   isError   → neutral inline alert (no tenant colors)
//   no data   → null
//   resolved  → the affordability UI
// ---------------------------------------------------------------------------

export function InsuranceSection() {
  const { data, isLoading, isError } = useClinicInfo()

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return <InsuranceSkeleton />
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <section
        className="w-full px-6 py-12"
        role="alert"
        aria-label="Insurance section error"
      >
        <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-100 px-6 py-8 text-center text-slate-600">
          <p className="text-lg font-medium">
            Insurance &amp; payment information is temporarily unavailable.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Please try refreshing the page or contact us directly.
          </p>
        </div>
      </section>
    )
  }

  const insurance = data.insurance

  // ── Self-hide: no data at all ─────────────────────────────────────────────
  if (!insurance) return null
  if (isEmpty(insurance)) return null

  const offer = insurance.newPatientSpecial

  // ── Resolved data ─────────────────────────────────────────────────────────
  return (
    <section className="w-full bg-white px-6 py-16" aria-label="Insurance and payment options">
      <div className="mx-auto max-w-5xl">
        {/* ── Section header ───────────────────────────────────────────── */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--tenant-primary)]">
            Insurance &amp; Payment Options
          </p>
          <h2 className="text-3xl font-bold text-slate-950 md:text-4xl">
            Quality care that fits your budget
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">
            We work with most major insurers and offer flexible financing so you can focus on your
            smile, not the cost.
          </p>
        </div>

        {/* ── Two-column chips ─────────────────────────────────────────── */}
        <div className="grid gap-8 md:grid-cols-2">
          {insurance.acceptedProviders && insurance.acceptedProviders.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Accepted Insurance
              </h3>
              <div className="flex flex-wrap gap-2">
                {insurance.acceptedProviders.map((provider) => (
                  <ProviderChip key={provider} label={provider} />
                ))}
              </div>
            </div>
          )}

          {insurance.paymentPlans && insurance.paymentPlans.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Payment Plans &amp; Financing
              </h3>
              <div className="flex flex-wrap gap-2">
                {insurance.paymentPlans.map((plan) => (
                  <PlanChip key={plan} label={plan} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── New-patient offer (the conversion anchor) ────────────────── */}
        {offer && <OfferCard offer={offer} bookingUrl={data.bookingUrl} />}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Pure helpers & in-file subcomponents
// ---------------------------------------------------------------------------

/**
 * Returns true when none of the three optional affordability fields carry
 * meaningful data. Drives the section-level self-hide so an insurer that
 * hasn't populated anything collapses to a flawless solo-practitioner view.
 */
function isEmpty(insurance: InsuranceConfig): boolean {
  const hasProviders = !!insurance.acceptedProviders && insurance.acceptedProviders.length > 0
  const hasPlans = !!insurance.paymentPlans && insurance.paymentPlans.length > 0
  const hasOffer = !!insurance.newPatientSpecial
  return !hasProviders && !hasPlans && !hasOffer
}

/**
 * Glassmorphic accepted-insurance chip. Faint `--tenant-primary` border with
 * a translucent white fill; lifts gently on hover for a tactile, premium feel.
 */
function ProviderChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-[var(--tenant-primary)]/30 bg-white/70 px-4 py-1.5 text-sm font-medium text-[var(--tenant-primary)] backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5"
    >
      {label}
    </span>
  )
}

/** Payment-plan chip — same glassmorphic treatment as `ProviderChip`. */
function PlanChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-[var(--tenant-accent)]/30 bg-white/70 px-4 py-1.5 text-sm font-medium text-[var(--tenant-primary)] backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5"
    >
      {label}
    </span>
  )
}

/**
 * Conversion-anchor promo card. Renders only when `offer` exists.
 *
 * CTA routing:
 *   - `offer.ctaHref` starting with `/`  → React Router `<Link>`
 *   - `offer.ctaHref`/`bookingUrl` http(s) → `<a target="_blank" rel>`
 *   - otherwise (`#contact` or plain)    → `<a href>`
 * Falls back to `offer.ctaHref → bookingUrl → '#contact'`.
 */
function OfferCard({
  offer,
  bookingUrl,
}: {
  offer: NonNullable<InsuranceConfig['newPatientSpecial']>
  bookingUrl?: string
}) {
  const label = offer.ctaLabel?.trim() || 'Book now'
  const primaryHref = offer.ctaHref?.trim() || bookingUrl?.trim() || '#contact'
  const isExternal = primaryHref.startsWith('http')
  const isInternal = primaryHref.startsWith('/')
  const ctaAriaLabel = `${label} — new patient special`

  return (
    <div className="mt-12">
      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--tenant-primary)]/15 bg-slate-50 p-8 shadow-sm md:p-12"
      >
        {/* soft tinted halo behind the card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-white/40"
        />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-[var(--tenant-primary)] md:text-3xl">
              {offer.headline}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">{offer.description}</p>
            {offer.price && (
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-950">{offer.price}</span>
                <span className="text-sm font-medium text-slate-500">new-patient special</span>
              </p>
            )}
          </div>

          <div className="shrink-0">
            {isInternal ? (
              <Link to={primaryHref} aria-label={ctaAriaLabel} className={CTA_LINK_CLASSES}>
                {label}
              </Link>
            ) : isExternal ? (
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ctaAriaLabel}
                className={CTA_LINK_CLASSES}
              >
                {label}
              </a>
            ) : (
              <a href={primaryHref} aria-label={ctaAriaLabel} className={CTA_LINK_CLASSES}>
                {label}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
