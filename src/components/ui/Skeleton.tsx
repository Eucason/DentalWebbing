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
// Map / Location skeleton
// ---------------------------------------------------------------------------
// Two-column layout: hours + directions column on the left, a tall map frame
// placeholder on the right. Matches MapSection so there is no layout shift.
// ---------------------------------------------------------------------------

/**
 * Map & Location section loading placeholder matching the MapSection layout.
 */
export function MapSkeleton() {
  return (
    <section
      className="w-full px-6 py-12"
      role="status"
      aria-label="Loading location and map"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <Skeleton className="mb-8 h-8 w-52" />

        <div className="grid gap-10 lg:grid-cols-2">
          {/* ── Hours + contact column ──────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              {/* Phone row */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-36" />
              </div>
              {/* Directions button */}
              <Skeleton className="mt-1 h-10 w-40 rounded-full" />
            </div>

            {/* Hours rows */}
            <div className="mt-2 flex flex-col gap-3">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Map frame column ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Page-level composition (used by RouteLoadingFallback and Suspense fallbacks)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Testimonials skeleton
// ---------------------------------------------------------------------------
// Matches the TestimonialsSection editorial 3-card canvas layout: dark canvas,
// the "What they say?" watermark, staggered card placeholders, and a floating
// star row. Neutral slate only (no tenant CSS vars) so it renders correctly
// before branding is applied. Asymmetry is baked in so the loading → resolved
// transition keeps its geometry.
// ---------------------------------------------------------------------------

interface TestimonialsSkeletonProps {
  /** Number of card placeholders to render (default 3). */
  count?: number
}

/**
 * Vertical stagger offsets cycling per card index — mirrors the resolved
 * TestimonialsSection `STAGGER` offsets so the masonry columns land in the same
 * vertical positions on loading → resolved and there is no layout shift.
 */
const STAGGER = ['', 'md:mt-20', 'md:mt-10', 'md:mt-32', 'md:mt-6', 'md:mt-16']

/**
 * Dark editorial canvas placeholder matching the TestimonialsSection layout.
 * When `count >= 3` it uses the same `md:grid-cols-3` masonry grid as the
 * resolved section; below that it degrades to a centered stack to keep geometry
 * stable in either case.
 */
export function TestimonialsSkeleton({ count = 3 }: TestimonialsSkeletonProps) {
  const useGrid = count >= 3

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950 px-6 py-24"
      role="status"
      aria-label="Loading testimonials"
    >
      {/* Typographic watermark */}
      <div className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center">
        <span className="font-serif text-7xl tracking-tight text-white/5 md:text-9xl">
          What they say?
        </span>
      </div>

      {/* Floating star row (top-left) */}
      <div className="absolute left-8 top-8 z-10 md:left-12 md:top-12">
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
        </div>
      </div>

      {/* Staggered card placeholders */}
      <div className="relative z-10 mx-auto max-w-6xl">
        {useGrid ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:items-start">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className={STAGGER[i % STAGGER.length]}>
                <TestimonialCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            {Array.from({ length: count }, (_, i) => (
              <TestimonialCardSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function TestimonialCardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-md">
      {/* Index counter */}
      <Skeleton className="mb-4 h-3 w-8" />
      {/* Quote lines */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
      {/* Author row */}
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FAQ skeleton
// ---------------------------------------------------------------------------
// Section heading plus a vertical stack of question/answer placeholders.

interface FaqSkeletonProps {
  /** Number of FAQ row placeholders to render (default 4). */
  count?: number
}

/**
 * Vertical FAQ accordion placeholder matching the FaqAccordionSection layout.
 */
export function FaqSkeleton({ count = 4 }: FaqSkeletonProps) {
  return (
    <section className="w-full px-6 py-12" role="status" aria-label="Loading frequently asked questions">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="mx-auto mb-2 h-5 w-32" />
        <Skeleton className="mx-auto mb-10 h-8 w-full max-w-md" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-4 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Social proof skeleton
// ---------------------------------------------------------------------------
// Centered metric chips + a grid of short trust-card placeholders.

/**
 * Trust-grid placeholder matching the SocialProofSection layout.
 */
export function SocialProofSkeleton() {
  return (
    <section className="w-full px-6 py-12" role="status" aria-label="Loading social proof">
      <div className="mx-auto max-w-5xl">
        <Skeleton className="mx-auto mb-10 h-6 w-full max-w-lg" />
        <div className="flex flex-wrap items-center justify-center gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-14 w-40 rounded-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Insurance skeleton
// ---------------------------------------------------------------------------
// Heading + two rows of provider/plan chips + an offer card placeholder.

/**
 * Insurance & affordability placeholder matching the InsuranceSection layout.
 */
export function InsuranceSkeleton() {
  return (
    <section className="w-full px-6 py-12" role="status" aria-label="Loading insurance information">
      <div className="mx-auto max-w-5xl">
        <Skeleton className="mx-auto mb-10 h-6 w-full max-w-md" />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-40" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-32" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-9 w-36 rounded-full" />
              ))}
            </div>
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
