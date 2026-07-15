import { Link } from 'react-router-dom'
import { useServices } from '../../hooks/useServices'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { Card } from '../ui/Card'
import { ServicesSkeleton } from '../ui/Skeleton'
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider'
import type { Service } from '../../types'

// ---------------------------------------------------------------------------
// ServicesSection
// ---------------------------------------------------------------------------
// Consumes useServices() and renders the list of dental services in a
// responsive grid. Designed to live on the homepage but reusable on the
// Services page.
//
// State machine:
//   isLoading → <ServicesSkeleton /> (no layout shift, matches expected grid)
//   isError   → inline neutral alert (no crash, no tenant colors)
//   data      → responsive grid of service tiles
// ---------------------------------------------------------------------------

interface ServicesSectionProps {
  /** When provided, only the first `limit` services are rendered.
   *  Use on HomePage (limit=3) to show an abbreviated preview.
   *  Omit on ServicesPage to show the full list. */
  limit?: number
}

export function ServicesSection({ limit }: ServicesSectionProps) {
  const { data, isLoading, isError } = useServices()

  // ── Feature-flag gate (R3: opt-in Phase-4 flag, defaults OFF) ────────────
  // Only the *new pricing display* is gated here — the section itself keeps
  // rendering name/description so existing tenants are unaffected when the
  // flag is off.
  const pricingEnabled = useFeatureFlag('servicePricing', { defaultValue: false })

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return <ServicesSkeleton count={limit ?? 6} />
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <section className="w-full px-6 py-12" role="alert" aria-label="Services section error">
        <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-100 px-6 py-8 text-center text-slate-600">
          <p className="text-lg font-medium">Our services list is temporarily unavailable.</p>
          <p className="mt-1 text-sm text-slate-500">
            Please try refreshing the page or contact us directly.
          </p>
        </div>
      </section>
    )
  }

  // ── Empty list (no error, but no services either) ────────────────────────
  if (data.length === 0) {
    return (
      <section className="w-full px-6 py-12" aria-label="Services section">
        <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
          <p className="text-lg font-medium">Our services list is coming soon.</p>
          <p className="mt-1 text-sm">Please check back later or contact us for more details.</p>
        </div>
      </section>
    )
  }

  // ── Resolved data ─────────────────────────────────────────────────────────
  return (
    <section className="w-full px-6 py-16 bg-white" aria-label="Our services">
      <div className="mx-auto max-w-5xl">
        {/* ── Section header ───────────────────────────────────────────── */}
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-950 md:text-4xl">Our Services</h2>
          <p className="mt-3 text-lg text-slate-600">
            Comprehensive dental care for every stage of life.
          </p>
        </header>

        {/* ── Services grid ─────────────────────────────────────────────── */}
        {/*
          Real <ul>/<li> list so screen readers announce the service count.
          Alt text is derived from the service's own name but falls back to
          a generic description when the operator has left it blank.
        */}
        <ul
          className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Dental services"
        >
          {(limit ? data.slice(0, limit) : data).map((service) => (
            <li key={service.id}>
            <Card
              className="flex h-full flex-col transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--tenant-primary)]"
            >
              {/* Image / icon header */}
              {service.imageUrl ? (
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <img
                    src={service.imageUrl}
                    alt={service.name?.trim() ? `Illustration of ${service.name}` : 'Dental service illustration'}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center bg-[var(--tenant-primary)]/5">
                  {service.iconUrl ? (
                    <img
                      src={service.iconUrl}
                      alt={`${service.name} icon`}
                      className="h-12 w-12 text-[var(--tenant-primary)]"
                      loading="lazy"
                    />
                  ) : (
                    <ServiceDefaultIcon
                      className="h-12 w-12 text-[var(--tenant-primary)]"
                      label={`${service.name} icon`}
                    />
                  )}
                </div>
              )}

              {/* Body */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>

                <p className="text-sm leading-relaxed text-slate-600">{service.description}</p>

                {/*
                  ── Before / after clinical slider (B4, gated by R3) ───────
                  Shown when the operator has uploaded a gallery of at least
                  two images for this service. The first image is treated as
                  the "before" and the second as the "after".
                */}
                {pricingEnabled && (service.gallery?.length ?? 0) >= 2 ? (
                  <BeforeAfterSlider
                    beforeImage={service.gallery![0]}
                    afterImage={service.gallery![1]}
                    alt={service.name}
                  />
                ) : null}

                {/* ── Pricing + procedure metadata (B4, gated by R3) ──────── */}
                {pricingEnabled && <ServicePricing service={service} />}

                {/* View-service link → /services#<slug> */}
                <div className="mt-auto pt-4">
                  <Link
                    to={`/services#${service.slug}`}
                    className="inline-flex items-center rounded text-sm font-medium text-[var(--tenant-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
                    aria-label={service.name?.trim() ? `Learn more about ${service.name}` : 'Learn more about this service'}
                  >
                    Learn more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Default service icon (used when neither imageUrl nor iconUrl is provided)
// ---------------------------------------------------------------------------

function ServiceDefaultIcon({ className = '', label }: { className?: string; label: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      role="img"
      aria-label={label}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// ServicePricing — price band + procedure metadata for a single service
// ---------------------------------------------------------------------------
// Rendering rules (per B4 / R2):
//   is_price_upon_request  → hide the numeric band, show "Price upon request"
//   otherwise               → show "starting_price–price_range_max" + suffix
//   price_fine_print        → small note beneath the band (always, when present)
//   financing_note          → shown when present
//   procedure_time / recovery_time → metadata row(s) when present
//
// Returns null when there is nothing to show, so cards without pricing data
// keep their original layout.
// ---------------------------------------------------------------------------

function ServicePricing({ service }: { service: Service }) {
  const {
    starting_price,
    price_range_max,
    price_suffix,
    is_price_upon_request,
    price_fine_print,
    financing_note,
    procedure_time,
    recovery_time,
  } = service

  const hasPrice = starting_price != null || price_range_max != null
  const hasMeta = Boolean(procedure_time) || Boolean(recovery_time)
  const hasAny =
    is_price_upon_request || hasPrice || Boolean(price_fine_print) || Boolean(financing_note) || hasMeta

  if (!hasAny) return null

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      {/* ── Price band / "upon request" (R2) ─────────────────────────── */}
      {is_price_upon_request ? (
        <p className="text-sm font-medium text-slate-700">Price upon request</p>
      ) : hasPrice ? (
        <p className="text-sm font-semibold text-slate-900">
          {formatPriceBand(starting_price, price_range_max)}
          {price_suffix ? <span className="ml-1 font-normal text-slate-500">{price_suffix}</span> : null}
        </p>
      ) : null}

      {/* ── Fine print ───────────────────────────────────────────────── */}
      {price_fine_print ? (
        <p className="mt-1 text-xs text-slate-500">{price_fine_print}</p>
      ) : null}

      {/* ── Financing note ───────────────────────────────────────────── */}
      {financing_note ? (
        <p className="mt-1 text-xs font-medium text-[var(--tenant-primary)]">{financing_note}</p>
      ) : null}

      {/* ── Procedure / recovery metadata ────────────────────────────── */}
      {hasMeta ? (
        <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          {procedure_time ? (
            <div className="flex items-baseline gap-1">
              <dt className="font-medium text-slate-700">Procedure</dt>
              <dd>{procedure_time}</dd>
            </div>
          ) : null}
          {recovery_time ? (
            <div className="flex items-baseline gap-1">
              <dt className="font-medium text-slate-700">Recovery</dt>
              <dd>{recovery_time}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </div>
  )
}

/** Formats "starting_price–price_range_max" with locale-aware grouping. */
function formatPriceBand(starting: number | null | undefined, max: number | null | undefined): string {
  const fmt = (n: number) => new Intl.NumberFormat().format(n)
  if (starting != null && max != null) return `${fmt(starting)}–${fmt(max)}`
  if (starting != null) return `From ${fmt(starting)}`
  if (max != null) return `Up to ${fmt(max)}`
  return ''
}
