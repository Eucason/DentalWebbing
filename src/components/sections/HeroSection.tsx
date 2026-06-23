import { Link } from 'react-router-dom'
import { useClinicInfo } from '../../hooks/useClinicInfo'
import { Button } from '../ui/Button'
import { HeroSkeleton } from '../ui/Skeleton'

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------
// Consumes useClinicInfo() and renders the full-width branded hero area.
//
// State machine:
//   isLoading → <HeroSkeleton /> (no layout shift)
//   isError   → inline neutral alert (no crash, no tenant colors)
//   data      → two-column hero (text left, image right on md+)
// ---------------------------------------------------------------------------

export function HeroSection() {
  const { data, isLoading, isError } = useClinicInfo()

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return <HeroSkeleton />
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <section className="w-full px-6 py-16" role="alert" aria-label="Hero section error">
        <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-100 px-6 py-8 text-center text-slate-600">
          <p className="text-lg font-medium">Clinic information is temporarily unavailable.</p>
          <p className="mt-1 text-sm text-slate-500">
            Please try refreshing the page or contact us directly.
          </p>
        </div>
      </section>
    )
  }

  // ── Resolved data ─────────────────────────────────────────────────────────
  const bookingHref = data.bookingUrl ?? '#contact'

  return (
    <section className="w-full bg-tenant-primary text-white" aria-label="Hero section">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-20 md:flex-row md:items-center">
        {/* ── Text column ─────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Eyebrow / tagline */}
          {data.tagline && (
            <span className="inline-block w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-medium tracking-wide">
              {data.tagline}
            </span>
          )}

          {/* Headline */}
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{data.heroTitle}</h1>

          {/* Subtitle / description */}
          <p className="max-w-lg text-lg leading-relaxed text-white/85">{data.heroSubtitle}</p>

          {/* CTA buttons */}
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {/* Primary CTA — booking */}
            {bookingHref.startsWith('http') ? (
              <a
                href={bookingHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
              >
                <Button
                  variant="secondary"
                  size="lg"
                  id="hero-cta-book"
                  aria-label="Book an appointment"
                >
                  Book an Appointment
                </Button>
              </a>
            ) : (
              <a
                href={bookingHref}
                className="inline-flex rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
              >
                <Button
                  variant="secondary"
                  size="lg"
                  id="hero-cta-book"
                  aria-label="Book an appointment"
                >
                  Book an Appointment
                </Button>
              </a>
            )}

            {/* Secondary CTA — services page (React Router) */}
            <Link
              to="/services"
              aria-label="View our services"
              className="inline-flex rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
            >
              <Button
                variant="outline"
                size="lg"
                id="hero-cta-services"
                className="border-white text-white hover:bg-white/10"
              >
                Our Services
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Image column ─────────────────────────────────────────────── */}
        <div className="flex-1">
          {data.heroImageUrl ? (
            <img
              src={data.heroImageUrl}
              alt={`${data.heroTitle} — clinic hero image`}
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl"
              loading="eager"
            />
          ) : (
            /* Branded placeholder when no image is provided */
            <div
              className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-white/10"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
