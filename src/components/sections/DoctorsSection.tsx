import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDoctors } from '../../hooks/useDoctors'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { Card } from '../ui/Card'
import { DoctorsSkeleton } from '../ui/Skeleton'
import type { Doctor } from '../../types'

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

/**
 * How many credential chips show on the card before collapsing behind the
 * "View all" trigger. Kept small so a doctor with many credentials does not
 * stretch the card; the full list lives in the drawer.
 */
const CARD_CHIP_LIMIT = 2

export function DoctorsSection() {
  const { data, isLoading, isError } = useDoctors()

  // ── Feature-flag gate (R3: opt-in Phase-4 flag, defaults OFF) ────────────
  // The richer credential chips + details drawer only render for tenants that
  // have opted in. Existing tenants keep the plain legacy qualifications
	// display so nothing changes without an explicit opt-in.
  const credentialsEnabled = useFeatureFlag('teamCredentials', { defaultValue: false })

  // ── Credentials drawer ───────────────────────────────────────────────────
  // A single shared drawer is reused across cards; `activeDoctor` holds the
  // doctor whose details are open. Null ⇒ drawer closed (R2 self-hides on a
  // doctor with zero credentials because no trigger is rendered for them).
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null)
  const closeDrawer = () => setActiveDoctor(null)

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
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-950 md:text-4xl">Meet Our Doctors</h2>
          <p className="mt-3 text-lg text-slate-600">
            A team of experienced specialists dedicated to your comfort and care.
          </p>
        </header>

        {/* ── Doctor grid ──────────────────────────────────────────────── */}
        {/*
          The grid is a real <ul>/<li> list — screen readers announce the
          number of doctors and let users move between them. The alt text
          falls back to a generic description when an operator leaves the
          doctor's name blank (never trust empty operator-edited fields).
        */}
        <ul
          className="grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Clinic medical team"
        >
          {data.map((doctor) => (
            <li key={doctor.id}>
            <Card className="flex h-full flex-col">
              {/* Avatar / portrait */}
              <div className="flex justify-center bg-white px-5 pt-6">
                {doctor.imageUrl ? (
                  <img
                    src={doctor.imageUrl}
                    alt={doctor.name?.trim() ? `Headshot portrait of ${doctor.name}` : 'Clinic medical professional headshot'}
                    className="h-32 w-32 rounded-full object-cover shadow-md ring-4 ring-white"
                    loading="lazy"
                  />
                ) : (
                  /* Initials placeholder when no image is provided */
                  <div
                    className="flex h-32 w-32 items-center justify-center rounded-full bg-[var(--tenant-primary)]/10 text-3xl font-semibold text-[var(--tenant-primary)] shadow-md ring-4 ring-white"
                    role="img"
                    aria-label={doctor.name?.trim() ? `Avatar for ${doctor.name}` : 'Avatar for clinic medical professional'}
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

                {/*
                  Credential display. When the teamCredentials flag is on, the
                  normalised credentialChips (legacy qualifications + structured
                  repeater, merged by the mapper) drive a small chip subset plus
                  a trigger that opens the details drawer. When the flag is off
                  we fall back to the legacy plain-qualifications list so
                  existing tenants are unaffected.
                */}
                {credentialsEnabled ? (
                  <CredentialChips
                    doctor={doctor}
                    limit={CARD_CHIP_LIMIT}
                    onOpen={() => setActiveDoctor(doctor)}
                  />
                ) : (
                  doctor.qualifications &&
                  doctor.qualifications.length > 0 && (
                    <ul className="mt-2 flex list-none flex-wrap justify-center gap-1.5 p-0" aria-label={`Qualifications for ${doctor.name}`}>
                      {doctor.qualifications.map((qual) => (
                        <li
                          key={qual}
                          className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700"
                        >
                          {qual}
                        </li>
                      ))}
                    </ul>
                  )
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
            </li>
          ))}
        </ul>
      </div>

      {/* ── Credentials drawer (R2: only mounts when a doctor is active) ──── */}
      {activeDoctor && (
        <DoctorCredentialDrawer doctor={activeDoctor} onClose={closeDrawer} />
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Credential chips (card surface)
// ---------------------------------------------------------------------------

interface CredentialChipsProps {
  doctor: Doctor
  /** Max chips shown before collapsing behind the "View all" trigger. */
  limit: number
  onOpen: () => void
}

/**
 * Small, inline preview of a doctor's credentials on the card: a truncated
 * chip list plus a "View all N credentials" trigger that opens the drawer.
 *
 * R2 (self-hide): when the normalised chip list is empty there is nothing to
 * preview and no reason to open the drawer, so the whole block returns null —
 * the trigger (and therefore the drawer) is impossible to reach for a
 * doctor with zero credentials.
 */
function CredentialChips({ doctor, limit, onOpen }: CredentialChipsProps) {
  const chips = doctor.credentialChips ?? []
  if (chips.length === 0) return null

  const visible = chips.slice(0, limit)
  const hidden = chips.length - visible.length

  return (
    <div className="mt-2 flex flex-col items-center gap-2">
      <ul
        className="flex list-none flex-wrap justify-center gap-1.5 p-0"
        aria-label={`Credentials for ${doctor.name}`}
      >
        {visible.map((chip) => (
          <li
            key={chip}
            className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700"
          >
            {chip}
          </li>
        ))}
      </ul>

      {/*
        The trigger is the clickable that opens the drawer. It carries an
        explicit label naming the doctor so it is unambiguous out of context.
        When there is no overflow we still surface a trigger so the full
        structured details (type / institution / year) are always reachable.
      */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View all credentials for ${doctor.name}`}
        className="rounded text-xs font-medium text-[var(--tenant-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
      >
        {hidden > 0
          ? `View all ${chips.length} credentials`
          : 'View credentials'}
        <span aria-hidden="true"> →</span>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Credentials drawer
// ---------------------------------------------------------------------------

interface DoctorCredentialDrawerProps {
  doctor: Doctor
  onClose: () => void
}

/**
 * Modal drawer showing the full, structured credential details for one doctor.
 *
 * Accessibility & behaviour:
 *   - role="dialog" + aria-modal with a labelled heading.
 *   - Escape closes; clicking the scrim closes; focus is restored to the
 *     body on close (this trigger lives on the card, which re-renders).
 *   - A basic focus trap keeps Tab within the open dialog.
 *
 * R2 is enforced at the call site (the trigger — and thus the drawer — only
 * exists when the doctor has ≥1 credential); this component renders whatever
 * it is given.
 */
function DoctorCredentialDrawer({ doctor, onClose }: DoctorCredentialDrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const chips = doctor.credentialChips ?? []
  const hasVideo = Boolean(doctor.personal_bio_video_url)
  const hasMeta =
    Boolean(doctor.years_in_practice) || (doctor.languages_spoken?.length ?? 0) > 0

  // Close on Escape + mount the focus trap / scrim listeners.
  useEffect(() => {
    if (!dialogRef.current) return
    const node = dialogRef.current

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      // Focus trap: cycle Tab within the dialog.
      if (e.key === 'Tab') {
        const focusable = node.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.target === node) onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    node.addEventListener('pointerdown', onPointerDown)
    // Move focus into the dialog on open.
    requestAnimationFrame(() => {
      const first = node.querySelector<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      )
      first?.focus()
    })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      node.removeEventListener('pointerdown', onPointerDown)
    }
  }, [onClose])

  return (
    // Scrim
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-drawer-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/50 px-4"
    >
      {/* Panel */}
      <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="doctor-drawer-title"
              className="text-xl font-bold text-slate-900"
            >
              {doctor.name}
            </h2>
            {doctor.specialty && (
              <p className="text-sm font-medium text-[var(--tenant-primary)]">
                {doctor.specialty}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close credentials panel"
            className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tenant-primary)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Metadata: years in practice + languages */}
        {hasMeta && (
          <dl className="mb-5 grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            {typeof doctor.years_in_practice === 'number' && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Years in practice
                </dt>
                <dd className="text-sm text-slate-700">{doctor.years_in_practice}</dd>
              </div>
            )}
            {doctor.languages_spoken && doctor.languages_spoken.length > 0 && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Languages spoken
                </dt>
                <dd className="text-sm text-slate-700">
                  {doctor.languages_spoken.join(', ')}
                </dd>
              </div>
            )}
          </dl>
        )}

        {/* Full credential list (structured repeater rows) */}
        {doctor.credentials && doctor.credentials.length > 0 ? (
          <ul className="mb-2 list-none space-y-2 p-0" aria-label={`Full credentials for ${doctor.name}`}>
            {doctor.credentials.map((cred, idx) => (
              <li
                key={`${cred.credential_title}-${idx}`}
                className="rounded-lg border border-slate-200 p-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {cred.credential_title}
                </p>
                {(cred.credential_type || cred.institution || cred.year) && (
                  <p className="mt-0.5 text-xs text-slate-600">
                    {[cred.credential_type, cred.institution, cred.year]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          // Legacy-only doctors: render the flat qualification strings.
          chips.length > 0 && (
            <ul className="mb-2 list-none flex flex-wrap gap-1.5 p-0" aria-label={`Credentials for ${doctor.name}`}>
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700"
                >
                  {chip}
                </li>
              ))}
            </ul>
          )
        )}

        {/* Personal bio video thumbnail / link */}
        {hasVideo && (
          <a
            href={doctor.personal_bio_video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-medium text-[var(--tenant-primary)] transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tenant-primary)]"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span>Watch personal bio video</span>
          </a>
        )}

        {/* Fun fact */}
        {doctor.fun_fact && (
          <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm italic text-slate-600">
            {doctor.fun_fact}
          </p>
        )}
      </div>
    </div>
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
