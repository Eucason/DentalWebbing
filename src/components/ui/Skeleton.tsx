// ---------------------------------------------------------------------------
// Skeleton — base animated placeholder element
// ---------------------------------------------------------------------------
// All skeletons use only neutral Tailwind colors so they render correctly
// before tenant branding is applied. No CSS custom properties are referenced
// here — those only exist after TenantContext reaches the `ready` state.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Base primitive
// ---------------------------------------------------------------------------

interface SkeletonProps {
  /** Extra Tailwind utility classes for sizing and positioning. */
  className?: string
}

/**
 * Single animated rectangular placeholder.
 * Compose multiples of this to match the target layout.
 *
 * @example
 *   <Skeleton className="h-8 w-full max-w-md" />
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} aria-hidden="true" />
}

// ---------------------------------------------------------------------------
// Hero skeleton
// ---------------------------------------------------------------------------
// Matches the expected hero section layout:
//   [header bar]
//   [large headline]
//   [subtitle line]
//   [subtitle line shorter]
//   [two CTA buttons]
//   [hero image block]
// ---------------------------------------------------------------------------

/**
 * Full-width hero section loading placeholder.
 * Preserves the hero layout dimensions to prevent content shift on load.
 */
export function HeroSkeleton() {
  return (
    <section
      className="w-full bg-slate-50 px-6 py-16"
      role="status"
      aria-label="Loading hero section"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:items-center">
        {/* Text column */}
        <div className="flex flex-1 flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full max-w-lg" />
          <Skeleton className="h-5 w-full max-w-md" />
          <Skeleton className="h-5 w-3/4 max-w-sm" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>

        {/* Image column */}
        <div className="flex-1">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Doctors skeleton
// ---------------------------------------------------------------------------
// Three doctor cards in a responsive grid.
// Each card has an avatar, name, specialty, and a short bio excerpt.
// ---------------------------------------------------------------------------

interface DoctorsSkeletonProps {
  /** Number of card placeholders to render (default 3). */
  count?: number
}

/**
 * Grid of doctor card placeholders matching the DoctorsSection layout.
 */
export function DoctorsSkeleton({ count = 3 }: DoctorsSkeletonProps) {
  return (
    <section className="w-full px-6 py-12" role="status" aria-label="Loading doctors">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <Skeleton className="mb-8 h-8 w-48" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }, (_, i) => (
            <DoctorCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function DoctorCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Avatar */}
      <Skeleton className="h-24 w-24 rounded-full" />
      {/* Name */}
      <Skeleton className="h-5 w-36" />
      {/* Specialty */}
      <Skeleton className="h-4 w-24" />
      {/* Bio lines */}
      <div className="mt-1 flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Services skeleton
// ---------------------------------------------------------------------------
// A grid of service tiles — icon circle, name, and description excerpt.
// ---------------------------------------------------------------------------

interface ServicesSkeletonProps {
  /** Number of service tile placeholders (default 6). */
  count?: number
}

/**
 * Grid of service tile placeholders matching the ServicesSection layout.
 */
export function ServicesSkeleton({ count = 6 }: ServicesSkeletonProps) {
  return (
    <section className="w-full px-6 py-12" role="status" aria-label="Loading services">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <Skeleton className="mb-8 h-8 w-40" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }, (_, i) => (
            <ServiceTileSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceTileSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Icon circle */}
      <Skeleton className="h-10 w-10 rounded-full" />
      {/* Service name */}
      <Skeleton className="h-5 w-32" />
      {/* Description */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Contact skeleton
// ---------------------------------------------------------------------------
// Two-column layout: address/hours on the left, form on the right.
// ---------------------------------------------------------------------------

/**
 * Contact section loading placeholder matching the ContactSection layout.
 */
export function ContactSkeleton() {
  return (
    <section className="w-full px-6 py-12" role="status" aria-label="Loading contact information">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <Skeleton className="mb-8 h-8 w-44" />

        <div className="grid gap-10 md:grid-cols-2">
          {/* Address / hours column */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-5 w-full max-w-xs" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <div className="mt-4 flex flex-col gap-2">
              {/* Hours rows */}
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>

          {/* Form column */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-28 w-full rounded-md" />
            </div>
            <Skeleton className="h-10 w-32 self-end" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Page-level composition (used by RouteLoadingFallback and Suspense fallbacks)
// ---------------------------------------------------------------------------

/**
 * Full-page loading placeholder: hero + abbreviated doctors grid.
 * Used when a lazy page module is being loaded (route-level Suspense).
 */
export function PageSkeleton() {
  return (
    <div className="min-h-dvh bg-slate-50" role="status" aria-label="Loading page">
      <HeroSkeleton />
      <DoctorsSkeleton count={3} />
    </div>
  )
}
