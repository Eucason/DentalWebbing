import { useTestimonials } from '../../hooks/useTestimonials'
import { TestimonialsSkeleton } from '../ui/Skeleton'
import type { Testimonial } from '../../types'

// Vertical stagger offsets cycling per card index — drives the masonry feel
const STAGGER = ['', 'md:mt-20', 'md:mt-10', 'md:mt-32', 'md:mt-6', 'md:mt-16']

interface TestimonialsSectionProps {
  limit?: number
}

export function TestimonialsSection({ limit }: TestimonialsSectionProps) {
  const { data, isLoading, isError } = useTestimonials()

  if (isLoading) return <TestimonialsSkeleton count={limit ?? 3} />

  if (isError) {
    return (
      <section className="w-full px-6 py-12" role="alert" aria-label="Testimonials section error">
        <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-100 px-6 py-8 text-center text-slate-600">
          <p className="text-lg font-medium">Patient reviews are temporarily unavailable.</p>
          <p className="mt-1 text-sm text-slate-500">
            Please try refreshing the page or contact us directly.
          </p>
        </div>
      </section>
    )
  }

  if (data.length === 0) {
    return (
      <section className="w-full px-6 py-12" aria-label="Testimonials section">
        <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
          <p className="text-lg font-medium">Reviews are coming soon.</p>
          <p className="mt-1 text-sm">Please check back later to read patient stories.</p>
        </div>
      </section>
    )
  }

  const items = limit ? data.slice(0, limit) : data
  const useGrid = items.length >= 3

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950 px-5 py-20 sm:px-8 sm:py-28"
      aria-label="Patient testimonials"
    >
      {/* Grain texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }}
        aria-hidden="true"
      />

      {/* Radial center glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 70% at 50% 40%, rgba(255,255,255,0.025) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      {/* Large italic watermark */}
      {useGrid && (
        <div
          className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="text-center font-serif text-3xl italic leading-none tracking-tighter text-white/75 sm:text-[6rem] md:text-[8.5rem] lg:text-[11rem]"
            style={{
              textShadow:
                '0 0 20px rgba(212,175,55,0.9), 0 0 50px rgba(212,175,55,0.55), 0 0 110px rgba(212,175,55,0.25)',
            }}
          >
            What they say?
          </span>
        </div>
      )}

      {/* Stars — top left */}
      <div className="absolute left-6 top-8 z-10 md:left-14 md:top-14">
        <StarRow />
      </div>

      {/* Cards */}
      <div className="relative z-10 mx-auto max-w-6xl pt-16">
        {useGrid ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:items-start">
            {items.map((t, i) => (
              <div key={t.id} className={STAGGER[i % STAGGER.length]}>
                <TestimonialCard testimonial={t} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            {items.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const paddedIndex = String(index + 1).padStart(2, '0')

  return (
    <article className="rounded-2xl border border-white/[0.14] bg-transparent p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl sm:p-7">
      <span className="mb-4 block text-xs text-white/30" aria-hidden="true">
        ({paddedIndex})
      </span>
      <blockquote className="text-base font-normal leading-7 text-white/80 md:text-[0.9rem] md:font-light md:leading-relaxed">
        {testimonial.quote}
      </blockquote>
      <span className="mt-6 block text-right text-xs text-white/50">
        — {testimonial.author}
        {testimonial.location ? `, ${testimonial.location}` : ''}
      </span>
    </article>
  )
}

function StarRow() {
  return (
    <div className="flex gap-1" role="img" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-[var(--tenant-accent)]"
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
