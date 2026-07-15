import { useState } from 'react'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { useTenant } from '../../context/useTenant'
import { Skeleton } from '../ui/Skeleton'

// ---------------------------------------------------------------------------
// SchedulingSection — sandboxed NexHealth-style scheduling embed
// ---------------------------------------------------------------------------
// Renders a sandboxed iframe pointed at the tenant's scheduling-embed URL
// (NexHealth-style third-party booking widget). The URL is resolved from
// tenant config — never hardcoded (R1 / R8). The iframe is sandboxed so the
// third-party widget cannot navigate the host page or run unrestricted
// top-level scripts (R6).
//
// Behaviour:
//   Feature flag OFF          → null (R3 opt-in gate, defaults OFF)
//   No schedulingUrl in config → null (R2 self-hide; no broken iframe)
//   iframe loading            → inline skeleton placeholder
//   iframe loaded             → full-width sandboxed iframe
// ---------------------------------------------------------------------------

/** Sandbox tokens for the scheduling iframe (R6).
 *   allow-scripts       → the widget needs JS to render its picker.
 *   allow-same-origin   → the widget reads/writes its own storage/cookies.
 *   allow-popups        → "confirm appointment" flows may open a popup.
 *   allow-forms         → the intake form submits from inside the frame.
 *  Notably OMITTED (the isolation):
 *   allow-top-navigation → the widget must not redirect the host page.
 *   allow-presentation   → no Presentation API hijack.
 *   allow-modals         → window.modalDialog is blocked.
 */
const SCHEDULING_IFRAME_SANDBOX =
  'allow-scripts allow-same-origin allow-popups allow-forms'

export function SchedulingSection() {
  // ── Feature-flag gate (R3: opt-in Phase-4 flag, defaults OFF) ────────────
  const enabled = useFeatureFlag('scheduling', { defaultValue: false })
  if (!enabled) return null

  const { config } = useTenant()

  // ── No URL configured → self-hide (R2 / R8) ──────────────────────────────
  const url = config?.schedulingUrl?.trim()
  if (!url) return null

  return (
    <section
      className="w-full bg-slate-50 px-6 py-16"
      aria-label="Book an appointment"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-2xl font-bold text-gray-800">
          Book an Appointment
        </h2>
        <p className="mb-8 max-w-2xl text-gray-600">
          Pick a time that works for you. Our secure scheduling system confirms
          instantly — no phone tag required.
        </p>
        <SchedulingIframe src={url} />
      </div>
    </section>
  )
}

function SchedulingIframe({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Aspect ratio container — tall enough for a calendar picker. */}
      <div className="relative w-full" style={{ aspectRatio: '16 / 11' }}>
        {/* Loading skeleton — occupies the iframe footprint until load ── */}
        {!loaded && (
          <div
            className="absolute inset-0 flex flex-col gap-4 p-6"
            role="status"
            aria-label="Loading scheduling widget"
          >
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-6 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }, (_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-9 w-20 rounded-full" />
                ))}
              </div>
            </div>
            <Skeleton className="mt-auto h-11 w-full rounded-lg" />
          </div>
        )}

        {/* The sandboxed third-party embed (R6) ─────────────────────────── */}
        <iframe
          src={src}
          title="Online appointment scheduling"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          // R6: sandbox the third-party widget so it cannot navigate the
          // host page or run unrestricted top-level scripts, while still
          // allowing it to render its picker, submit its intake form, and
          // open confirmation popups within its own origin.
          sandbox={SCHEDULING_IFRAME_SANDBOX}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full border-0 ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        />
      </div>
    </div>
  )
}
