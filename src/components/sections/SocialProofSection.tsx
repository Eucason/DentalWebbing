import { useMemo } from 'react'
import { useClinicInfo } from '../../hooks/useClinicInfo'
import { useTenant } from '../../context/useTenant'
import { SocialProofSkeleton } from '../ui/Skeleton'
import type { SocialMetrics } from '../../types'
import { buildLocalBusinessSchema } from '../../utils/jsonLd'

// ---------------------------------------------------------------------------
// SocialProofSection
// ---------------------------------------------------------------------------
// Renders an aggregate "trust bar": star rating, review count, years in
// business, accreditations and awards. All fields are optional — the section
// self-hides when the tenant has supplied no social metrics, so the layout
// snaps closed without a void.
//
// State machine:
//   isLoading → <SocialProofSkeleton /> (matches the trust-bar shape)
//   isError   → neutral inline alert (no crash, no tenant colors)
//   no metrics → null                 (self-hide; product requirement)
//   resolved  → trust grid + LocalBusiness (Dentist) JSON-LD rich snippet
// ---------------------------------------------------------------------------

export function SocialProofSection() {
  useTenant()
  const { data, isLoading, isError } = useClinicInfo()

  if (isLoading) return <SocialProofSkeleton />

  if (isError || !data) {
    return (
      <section className="w-full px-6 py-12" role="alert" aria-label="Social proof error">
        <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-100 px-6 py-8 text-center text-slate-600">
          <p className="text-lg font-medium">Our practice details are temporarily unavailable.</p>
          <p className="mt-1 text-sm text-slate-500">
            Please try refreshing the page or contact us directly.
          </p>
        </div>
      </section>
    )
  }

  const metrics = data.socialMetrics
  if (!metrics || !hasAnyMetric(metrics)) return null

  return (
    <TrustBar
      metrics={metrics}
      name={data.heroTitle}
      address={data.address}
      telephone={data.contactPhone}
    />
  )
}

// ---------------------------------------------------------------------------
// TrustBar — resolved trust grid
// ---------------------------------------------------------------------------

interface TrustBarProps {
  metrics: SocialMetrics
  name: string
  address: string
  telephone: string
}

function TrustBar({ metrics, name, address, telephone }: TrustBarProps) {
  const { googleRating, rating, reviewCount, googleReviewCount, yearsInBusiness, accreditations, awards } =
    metrics

  const displayRating = googleRating ?? rating
  const displayCount = googleReviewCount ?? reviewCount

  return (
    <section className="w-full bg-slate-50 px-6 py-16" aria-label="Why patients trust us">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--tenant-primary)]">
            Trusted by thousands of patients
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">
            A practice you can rely on
          </h2>
        </div>

        {/* Hero stat cluster */}
        <div className="mb-10 flex flex-col items-center gap-3">
          {typeof displayRating === 'number' && (
            <>
              <StarRating rating={displayRating} />
              <p className="text-2xl font-bold text-[var(--tenant-primary)]">
                {displayRating.toFixed(1)}
                {typeof displayCount === 'number' && (
                  <span className="ml-2 text-base font-medium text-slate-500">
                    / 5 based on {displayCount} reviews
                  </span>
                )}
              </p>
            </>
          )}
          {typeof yearsInBusiness === 'number' && (
            <p className="text-sm text-slate-500">Trusted since {yearsInBusiness}</p>
          )}
        </div>

        {/* Accreditations */}
        {accreditations && accreditations.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            {accreditations.map((label) => (
              <MetricChip key={label} label={label} />
            ))}
          </div>
        )}

        {/* Awards */}
        {awards && awards.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {awards.map((label) => (
              <MetricChip key={label} label={label} variant="award" />
            ))}
          </div>
        )}
      </div>

      <LocalBusinessJsonLd
        name={name}
        address={address}
        telephone={telephone}
        rating={displayRating}
        reviewCount={displayCount}
      />
    </section>
  )
}

// ---------------------------------------------------------------------------
// MetricChip — glassmorphic pill token
// ---------------------------------------------------------------------------

interface MetricChipProps {
  label: string
  variant?: 'accreditation' | 'award'
}

function MetricChip({ label, variant = 'accreditation' }: MetricChipProps) {
  const ringColor =
    variant === 'award' ? 'var(--tenant-accent)' : 'var(--tenant-primary)'
  return (
    <span
      className="rounded-full border bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderColor: ringColor }}
    >
      {label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// StarRating — filled stars up to `rating` (rounded down)
// ---------------------------------------------------------------------------

interface StarRatingProps {
  rating: number
}

function StarRating({ rating }: StarRatingProps) {
  const filled = Math.max(0, Math.min(5, Math.floor(rating)))
  return (
    <div className="flex gap-1" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-6 w-6 ${i < filled ? 'text-[var(--tenant-accent)]' : 'text-slate-300'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// LocalBusinessJsonLd — Dentist (LocalBusiness) schema with aggregateRating
// ---------------------------------------------------------------------------

interface LocalBusinessJsonLdProps {
  name: string
  address: string
  telephone: string
  rating?: number
  reviewCount?: number
}

function LocalBusinessJsonLd({ name, address, telephone, rating, reviewCount }: LocalBusinessJsonLdProps) {
  const schema = useMemo(
    () =>
      buildLocalBusinessSchema({
        name,
        address,
        telephone,
        url: typeof window !== 'undefined' ? window.location.origin : '/',
        rating,
        reviewCount,
      }),
    [name, address, telephone, rating, reviewCount]
  )

  return (
    <script
      type="application/ld+json"
      // Payload is derived from our own typed data, never external input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hasAnyMetric(metrics: SocialMetrics): boolean {
  return (
    metrics.googleRating !== undefined ||
    metrics.googleReviewCount !== undefined ||
    metrics.rating !== undefined ||
    metrics.reviewCount !== undefined ||
    metrics.yearsInBusiness !== undefined ||
    !!metrics.accreditations?.length ||
    !!metrics.awards?.length
  )
}
