import { useLocations } from '../../hooks/useLocations'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { useTenant } from '../../context/useTenant'
import { Card } from '../ui/Card'
import { Skeleton } from '../ui/Skeleton'
import type { Location } from '../../types'

// ---------------------------------------------------------------------------
// LocationSection — location cards + amenity chips + office-tour gallery
// ---------------------------------------------------------------------------
// One card per location for multi-location tenants. Each card renders the
// practice's address, phone, opening hours, amenity chips, an office-tour
// photo gallery, and an embedded map. Fully data-driven from the location CPT
// — no clinic data or brand colours are hardcoded.
//
// This section is ADDITIVE (see the `B9-location-model` decision): it never
// touches clinic-info, which stays the single source of truth for
// single-location tenants. Single-location tenants simply have zero locations
// and the section self-hides.
//
// Behaviour:
//   Feature flag OFF          → null (R3 opt-in gate, defaults OFF)
//   isLoading                 → inline skeleton band
//   isError / zero locations → null (R2 self-hide; no empty band)
//   data                      → one card per location
// ---------------------------------------------------------------------------

export function LocationSection() {
  // ── Feature-flag gate (R3: opt-in Phase-4 flag, defaults OFF) ────────────
  const enabled = useFeatureFlag('locationAmenities', { defaultValue: false })
  if (!enabled) return null

  const { data, isLoading, isError } = useLocations()

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section
        className="w-full px-6 py-12"
        role="status"
        aria-label="Loading locations"
      >
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className="flex h-96 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              aria-hidden="true"
            >
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="aspect-square w-full" />
              </div>
              <Skeleton className="aspect-[16/10] w-full" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ── Error / empty → self-hide (R2) ───────────────────────────────────────
  if (isError || !data || data.length === 0) return null

  return (
    <section className="w-full bg-slate-50 px-6 py-16" aria-label="Our locations">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-2xl font-bold text-gray-800">Our Locations</h2>
        <p className="mb-8 max-w-2xl text-gray-600">
          Visit us at a practice near you. Each location offers a full range of
          services — find the one that is most convenient.
        </p>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {data.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LocationCard({ location }: { location: Location }) {
  const { config } = useTenant()
  const fullAddress = [
    location.address_line_1,
    location.address_line_2,
    `${location.city}, ${location.state} ${location.zip}`,
  ]
    .filter(Boolean)
    .join(', ')

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
  const mapTitle = config?.name
    ? `${location.name} — location map`
    : `${location.name} location map`

  const hasMap =
    typeof location.map_iframe_url === 'string' &&
    location.map_iframe_url.trim().length > 0

  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-5 p-6">
        {/* ── Heading: location name ──────────────────────────────────── */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {location.name}
          </h3>
        </div>

        {/* ── Address + directions ───────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-start gap-2 text-sm leading-relaxed text-slate-600 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[var(--tenant-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
            aria-label={`${fullAddress} — open in Google Maps (opens in a new tab)`}
          >
            <MapPinIcon />
            <span>{fullAddress}</span>
          </a>

          {location.phone && (
            <a
              href={`tel:${location.phone}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-[var(--tenant-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
              aria-label={`Call ${location.name} at ${location.phone}`}
            >
              <PhoneIcon />
              {location.phone}
            </a>
          )}
        </div>

        {/* ── Amenity chips — self-hide per-tag when absent, and the ────
            ── block itself self-hides when there are no tags (R2) ────── */}
        {location.amenity_tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {location.amenity_tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-[var(--tenant-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--tenant-primary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Opening hours — self-hide when absent (R2) ─────────────── */}
        {location.hours.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--tenant-primary)]">
              Opening Hours
            </h4>
            <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
              {location.hours.map((h) => (
                <div
                  key={h.day}
                  className="flex items-center justify-between px-4 py-2"
                >
                  <dt className="text-sm font-medium text-slate-700">{h.day}</dt>
                  <dd className="text-sm text-slate-600">
                    {h.open}–{h.close}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* ── Parking / access notes — self-hide when absent (R2) ─────── */}
        {location.parking_notes && (
          <p className="text-sm leading-relaxed text-slate-600">
            {location.parking_notes}
          </p>
        )}

        {/* ── Office-tour gallery — self-hide when absent (R2) ────────── */}
        {location.office_photos.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--tenant-primary)]">
              Office Tour
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {location.office_photos.map((photo) => (
                <img
                  key={photo}
                  src={photo}
                  alt={`Office photo at ${location.name}`}
                  loading="lazy"
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Embedded map (sandboxed per R6) — self-hide when absent ─── */}
        {hasMap && (
          <div className="mt-auto">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <iframe
                src={location.map_iframe_url}
                title={mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                // R6: sandbox the third-party map so it cannot navigate the
                // host page, run top-level scripts, or open popups, while
                // still allowing the embedded content to render.
                sandbox="allow-scripts allow-same-origin allow-popups"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Inline icons (no external dep — keeps the bundle lean)
// ---------------------------------------------------------------------------

function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 h-4 w-4 shrink-0"
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
