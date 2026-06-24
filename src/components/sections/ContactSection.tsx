import { useClinicInfo } from '../../hooks/useClinicInfo'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { ContactSkeleton } from '../ui/Skeleton'
import { ContactForm } from './ContactForm'

// ---------------------------------------------------------------------------
// ContactSection — address/hours display + contact form
// ---------------------------------------------------------------------------
// Consumes useClinicInfo() and renders the clinic's address, contact details,
// opening hours, and a validated contact form (Task 19).
//
// State machine:
//   isLoading → <ContactSkeleton />
//   isError   → inline neutral alert
//   data      → address + hours + <ContactForm />
// ---------------------------------------------------------------------------

export function ContactSection() {
  const { data, isLoading, isError } = useClinicInfo()
  const showContactForm = useFeatureFlag('contactForm')

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return <ContactSkeleton />
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <section className="w-full px-6 py-12" role="alert" aria-label="Contact section error">
        <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-100 px-6 py-8 text-center text-slate-600">
          <p className="text-lg font-medium">Contact information is temporarily unavailable.</p>
          <p className="mt-1 text-sm text-slate-500">Please try again later or call us directly.</p>
        </div>
      </section>
    )
  }

  // ── Resolved data ─────────────────────────────────────────────────────────
  return (
    <section className="w-full bg-white px-6 py-16" aria-label="Contact information">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
        {/* ── Address & contact ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-[var(--tenant-primary)]">
              Address
            </h2>
            <p className="text-slate-700">{data.address}</p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-[var(--tenant-primary)]">
              Phone &amp; Email
            </h2>
            <a
              href={`tel:${data.contactPhone}`}
              className="flex items-center gap-2 rounded text-slate-700 transition-colors hover:text-[var(--tenant-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
              aria-label={`Call us at ${data.contactPhone}`}
            >
              <PhoneIcon />
              {data.contactPhone}
            </a>
            <a
              href={`mailto:${data.contactEmail}`}
              className="flex items-center gap-2 rounded text-slate-700 transition-colors hover:text-[var(--tenant-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
              aria-label={`Email us at ${data.contactEmail}`}
            >
              <MailIcon />
              {data.contactEmail}
            </a>
          </div>

          {/* Social links */}
          {data.socialLinks && Object.keys(data.socialLinks).length > 0 && (
            <div className="flex flex-wrap gap-3">
              {Object.entries(data.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-sm capitalize text-slate-600 transition-colors hover:border-[var(--tenant-primary)] hover:text-[var(--tenant-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
                  aria-label={`${platform} page (opens in new tab)`}
                >
                  {platform}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── Opening hours ───────────────────────────────────────────────── */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--tenant-primary)]">
            Opening Hours
          </h2>
          <dl className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-slate-50">
            {Object.entries(data.hours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between px-4 py-2.5">
                <dt className="text-sm font-medium text-slate-700">{day}</dt>
                <dd className="text-sm text-slate-600">{hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── Contact form (Task 19) ────────────────────────────────────────── */}
      {showContactForm && (
        <div className="mx-auto mt-12 max-w-5xl">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">Send Us a Message</h2>
          <ContactForm />
        </div>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Inline icons (no external dep, keeps bundle lean)
// ---------------------------------------------------------------------------

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  )
}
