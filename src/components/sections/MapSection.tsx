import { useClinicInfo } from '../../hooks/useClinicInfo'
import { useTenant } from '../../context/useTenant'
import { MapSkeleton } from '../ui/Skeleton'

// ---------------------------------------------------------------------------
// MapSection — dynamic, embedded map + location / opening-hours panel
// ---------------------------------------------------------------------------
// Fully tenant-driven: address, phone, hours and the embedded map URL are
// resolved at runtime from the headless backend via useClinicInfo(). No clinic
// data, coordinate arrays, API keys or brand colours are hardcoded —
// everything comes from context, and colours resolve to the tenant CSS custom
// properties (or neutral slate system tokens).
//
// Presence & fallback contract:
//   • No address (online-only / satellite clinic) → render nothing at all.
//   • No embedded map URL               → render a clean 2-column contact
//                                          layout (address card + directions)
//                                          instead of a blank iframe box.
//   • Map URL present                   → responsive iframe with an adjacent
//                                          text address link for keyboard /
//                                          screen-reader users.
//
// State machine:
//   isLoading → <MapSkeleton />
//   isError   → inline neutral alert (no tenant colours)
//   resolved  → content (or null when address is absent)
// ---------------------------------------------------------------------------

export function MapSection() {
  const { data, isLoading, isError } = useClinicInfo()
  const { config } = useTenant()

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return <MapSkeleton />
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <section className="w-full px-6 py-12" role="alert" aria-label="Location section error">
        <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-slate-100 px-6 py-8 text-center text-slate-600">
          <p className="text-lg font-medium">Location information is temporarily unavailable.</p>
          <p className="mt-1 text-sm text-slate-500">
            Please try refreshing the page or contact us directly.
          </p>
        </div>
      </section>
    )
  }

  // ── Presence gate ─────────────────────────────────────────────────────────
  // Online-only consultation endpoints or satellite clinics may not publish a
  // physical location. In that case the entire section is omitted.
  if (!data.address) return null

  const { address, hours, contactPhone, mapIframeUrl } = data

  const hasMap = typeof mapIframeUrl === 'string' && mapIframeUrl.trim().length > 0
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  const mapTitle = config?.name
    ? `Google Map location of ${config.name}`
    : 'Clinic location map'
  const hoursEntries = Object.entries(hours)

  return (
    <section className="w-full bg-white px-6 py-16" aria-label="Location and opening hours">
      <div className="mx-auto max-w-5xl">
        {/* ── Section header ───────────────────────────────────────────── */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-950 md:text-4xl">Visit Our Practice</h2>
          <p className="mt-3 text-lg text-slate-600">
            Find us on the map and check our opening hours before you visit.
          </p>
        </div>

        {/* ── 2-column layout (50/50 on lg+) ───────────────────────────── */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          {/* ═══════════════════════════════════════════════════════════════
              Column A — contact details + directions + hours
             ═══════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-7">
            {/* Phone link */}
            {contactPhone && (
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--tenant-primary)]">
                  Call Us
                </h3>
                <a
                  href={`tel:${contactPhone}`}
                  className="inline-flex items-center gap-2 rounded text-lg font-medium text-slate-700 transition-colors hover:text-[var(--tenant-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
                  aria-label={`Call us at ${contactPhone}`}
                >
                  <PhoneIcon />
                  {contactPhone}
                </a>
              </div>
            )}

            {/* Get Directions — stays prominent in both map & fallback modes */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2.5 rounded-full bg-[var(--tenant-primary)] px-6 py-3 text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
              aria-label="Get driving directions in Google Maps (opens in a new tab)"
            >
              <DirectionsIcon />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Get Directions
              </span>
            </a>

            {/* Opening hours — semantic description list */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--tenant-primary)]">
                Opening Hours
              </h3>
              {hoursEntries.length > 0 ? (
                <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50">
                  {hoursEntries.map(([day, time]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between px-5 py-3"
                    >
                      <dt className="text-sm font-medium text-slate-700">{day}</dt>
                      <dd className="text-sm text-slate-600">{time}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-slate-500">Opening hours coming soon.</p>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              Column B — interactive map OR address card fallback
             ═══════════════════════════════════════════════════════════════ */}
          {hasMap ? (
            <div className="flex flex-col gap-5">
              {/* Responsive iframe frame */}
              <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                <iframe
                  src={mapIframeUrl}
                  title={mapTitle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>

              {/* Text-based address link adjacent to the map — keyboard &
                  screen-reader users can grab the location without touching
                  the map canvas. */}
              <div className="flex flex-col gap-1.5 pl-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Our Address
                </span>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 text-sm leading-relaxed text-slate-600 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[var(--tenant-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
                  aria-label={`${address} — open in Google Maps (opens in a new tab)`}
                >
                  <MapPinIcon className="mt-0.5 shrink-0" />
                  {address}
                </a>
              </div>
            </div>
          ) : (
            /* ── Fallback: address card + directions (no iframe box) ─── */
            <div className="flex flex-col justify-center gap-6 rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--tenant-primary)]">
                  Where To Find Us
                </h3>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 text-base leading-relaxed text-slate-700 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[var(--tenant-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
                  aria-label={`${address} — open in Google Maps (opens in a new tab)`}
                >
                  <MapPinIcon />
                  {address}
                </a>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--tenant-primary)]/20 bg-[var(--tenant-primary)]/10 px-5 py-2.5 text-sm font-medium text-[var(--tenant-primary)] transition-colors hover:bg-[var(--tenant-primary)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
                aria-label="Search this address in Google Maps (opens in a new tab)"
              >
                <DirectionsIcon strokeWidth={1.75} />
                Open in Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Inline icons (no external dep — keeps the bundle lean)
// ---------------------------------------------------------------------------

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 shrink-0"
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

function DirectionsIcon({ strokeWidth = 2 }: { strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a.75.75 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
      />
    </svg>
  )
}

function MapPinIcon({ className = 'h-5 w-5 shrink-0' }: { className?: string }) {
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
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  )
}
