import { Link } from 'react-router-dom'
import { useDoctors } from '../../hooks/useDoctors'
import { Card } from '../ui/Card'
import { DoctorsSkeleton } from '../ui/Skeleton'

// ---------------------------------------------------------------------------
// DoctorsSection
// ---------------------------------------------------------------------------
// Consumes useDoctors() and renders the team's doctor cards in a responsive
// grid. Designed to live on the homepage but reusable on a Team page.
//
// State machine:
//   isLoading → <DoctorsSkeleton /> (no layout shift, matches expected grid)
//   isError   → inline neutral alert (no crash, no tenant colors)
//   data      → responsive grid of doctor cards
// ---------------------------------------------------------------------------

export function DoctorsSection() {
  const { data, isLoading, isError } = useDoctors()

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return <DoctorsSkeleton />
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <section className="w-full px-6 py-12" role="alert" aria-label="Doctors section error">
        <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-100 px-6 py-8 text-center text-slate-600">
          <p className="text-lg font-medium">Doctor profiles are temporarily unavailable.</p>
          <p className="mt-1 text-sm text-slate-500">
            Please try refreshing the page or contact us directly.
          </p>
        </div>
      </section>
    )
  }

  // ── Empty list (no error, but no doctors either) ──────────────────────────
  if (data.length === 0) {
    return (
      <section className="w-full px-6 py-12" aria-label="Doctors section">
        <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
          <p className="text-lg font-medium">Our team profile is coming soon.</p>
          <p className="mt-1 text-sm">Please check back later to meet our specialists.</p>
        </div>
      </section>
    )
  }

  // ── Resolved data ─────────────────────────────────────────────────────────
  return (
    <section className="w-full px-6 py-16 bg-slate-50" aria-label="Meet our doctors">
      <div className="mx-auto max-w-5xl">
        {/* ── Section header ───────────────────────────────────────────── */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-950 md:text-4xl">Meet Our Doctors</h2>
          <p className="mt-3 text-lg text-slate-600">
            A team of experienced specialists dedicated to your comfort and care.
          </p>
        </div>

        {/* ── Doctor grid ──────────────────────────────────────────────── */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((doctor) => (
            <Card key={doctor.id} className="flex flex-col">
              {/* Avatar / portrait */}
              <div className="flex justify-center bg-white px-5 pt-6">
                {doctor.imageUrl ? (
                  <img
                    src={doctor.imageUrl}
                    alt={`Portrait of ${doctor.name}`}
                    className="h-32 w-32 rounded-full object-cover shadow-md ring-4 ring-white"
                    loading="lazy"
                  />
                ) : (
                  /* Initials placeholder when no image is provided */
                  <div
                    className="flex h-32 w-32 items-center justify-center rounded-full bg-[var(--tenant-primary)]/10 text-3xl font-semibold text-[var(--tenant-primary)] shadow-md ring-4 ring-white"
                    role="img"
                    aria-label={`Avatar for ${doctor.name}`}
                  >
                    {getInitials(doctor.name)}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col gap-3 p-5 text-center">
                <h3 className="text-lg font-semibold text-slate-900">{doctor.name}</h3>

                {doctor.specialty && (
                  <p className="text-sm font-medium text-[var(--tenant-primary)]">
                    {doctor.specialty}
                  </p>
                )}

                {doctor.bio && (
                  <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {doctor.bio}
                  </p>
                )}

                {doctor.qualifications && doctor.qualifications.length > 0 && (
                  <ul className="mt-2 flex flex-wrap justify-center gap-1.5">
                    {doctor.qualifications.map((qual) => (
                      <li
                        key={qual}
                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700"
                      >
                        {qual}
                      </li>
                    ))}
                  </ul>
                )}

                {/* View-profile link → /team#<slug> */}
                <div className="mt-auto pt-4">
                  <Link
                    to={`/team#${doctor.slug}`}
                    className="inline-flex items-center rounded text-sm font-medium text-[var(--tenant-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
                    aria-label={`View profile for ${doctor.name}`}
                  >
                    View profile
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
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extracts up to two uppercase initials from a doctor's display name.
 * Used for the avatar placeholder when no portrait image is available.
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase() || '?'
}
