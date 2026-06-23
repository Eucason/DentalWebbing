import { Link } from 'react-router-dom'
import { useServices } from '../../hooks/useServices'
import { Card } from '../ui/Card'
import { ServicesSkeleton } from '../ui/Skeleton'

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
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-950 md:text-4xl">Our Services</h2>
          <p className="mt-3 text-lg text-slate-600">
            Comprehensive dental care for every stage of life.
          </p>
        </div>

        {/* ── Services grid ─────────────────────────────────────────────── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(limit ? data.slice(0, limit) : data).map((service) => (
            <Card
              key={service.id}
              className="flex flex-col transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--tenant-primary)]"
            >
              {/* Image / icon header */}
              {service.imageUrl ? (
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <img
                    src={service.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div
                  className="flex aspect-[16/9] w-full items-center justify-center bg-[var(--tenant-primary)]/5"
                  aria-hidden="true"
                >
                  {service.iconUrl ? (
                    <img
                      src={service.iconUrl}
                      alt=""
                      className="h-12 w-12 text-[var(--tenant-primary)]"
                      loading="lazy"
                    />
                  ) : (
                    <ServiceDefaultIcon className="h-12 w-12 text-[var(--tenant-primary)]" />
                  )}
                </div>
              )}

              {/* Body */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>

                <p className="text-sm leading-relaxed text-slate-600">{service.description}</p>

                {/* View-service link → /services#<slug> */}
                <div className="mt-auto pt-4">
                  <Link
                    to={`/services#${service.slug}`}
                    className="inline-flex items-center text-sm font-medium text-[var(--tenant-primary)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--tenant-primary)] focus:ring-offset-2 rounded"
                    aria-label={`Learn more about ${service.name}`}
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
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Default service icon (used when neither imageUrl nor iconUrl is provided)
// ---------------------------------------------------------------------------

function ServiceDefaultIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  )
}
