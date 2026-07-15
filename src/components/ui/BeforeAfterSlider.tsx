import { useCallback, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// BeforeAfterSlider
// ---------------------------------------------------------------------------
// Keyboard- and touch-operable comparison slider for two clinical images
// (before / after). Built to the WAI-ARIA `role="slider"` pattern:
//   - Arrow / Home / End / PageUp / PageDown keys move the divider
//   - Pointer (mouse + touch) drag via Pointer Events + pointer capture
//   - aria-valuemin / aria-valuemax / aria-valuenow report the position
//
// Visual identity resolves entirely through tenant CSS custom properties —
// no hardcoded hex (R1). Motion on the divider is intentionally omitted so the
// component tracks the pointer / key frame-for-frame; the global
// `prefers-reduced-motion` overlay in index.css still wins if present.
// ---------------------------------------------------------------------------

interface BeforeAfterSliderProps {
  /** URL of the "before" clinical image (rendered on the left/under the divider). */
  beforeImage: string
  /** URL of the "after" clinical image (rendered on the right/base layer). */
  afterImage: string
  /** Short description of the case, used to build accessible labels for both images. */
  alt?: string
}

const MIN = 0
const MAX = 100
const STEP = 5 // Arrow-key increment (percent of width)
const PAGE_STEP = 20 // PageUp/PageDown increment
const DEFAULT = 50

// WAI-ARIA recommends a 44dp (here 48dp) minimum target for touch handles.
 const HANDLE_SIZE = 48

export function BeforeAfterSlider({ beforeImage, afterImage, alt }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(DEFAULT)
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  /** Map a viewport client X to a clamped 0–100 slider value. */
  const valueFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return DEFAULT
    const rect = el.getBoundingClientRect()
    if (rect.width === 0) return DEFAULT
    const ratio = (clientX - rect.left) / rect.width
    return Math.min(MAX, Math.max(MIN, Math.round(ratio * MAX)))
  }, [])

  // ── Pointer (mouse + touch) drag ─────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setPosition(valueFromClientX(e.clientX))
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    setPosition(valueFromClientX(e.clientX))
  }

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    const target = e.currentTarget as HTMLElement
    if (target.hasPointerCapture?.(e.pointerId)) {
      target.releasePointerCapture(e.pointerId)
    }
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────
  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault()
        setPosition((p) => Math.max(MIN, p - STEP))
        break
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault()
        setPosition((p) => Math.min(MAX, p + STEP))
        break
      case 'Home':
        e.preventDefault()
        setPosition(MIN)
        break
      case 'End':
        e.preventDefault()
        setPosition(MAX)
        break
      case 'PageUp':
        e.preventDefault()
        setPosition((p) => Math.min(MAX, p + PAGE_STEP))
        break
      case 'PageDown':
        e.preventDefault()
        setPosition((p) => Math.max(MIN, p - PAGE_STEP))
        break
    }
  }

  const caseLabel = alt?.trim() ? alt.trim() : 'clinical case'
  const beforeAlt = `Before — ${caseLabel}`
  const afterAlt = `After — ${caseLabel}`

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none overflow-hidden rounded-lg bg-slate-100 touch-none"
      style={{ aspectRatio: '16 / 9' }}
    >
      {/* ── "After" image (base layer, always full width) ──────────────── */}
      <img
        src={afterImage}
        alt={afterAlt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
        loading="lazy"
      />

      {/* ── "Before" image (clipped to the left of the divider) ─────────── */}
      {/*
        clip-path inset(top right bottom left): reveal from the left edge up
        to `position`%. At position=100 the whole image shows; at 0 none does.
      */}
      <img
        src={beforeImage}
        alt={beforeAlt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
        loading="lazy"
        style={{ clipPath: `inset(0 ${MAX - position}% 0 0)` }}
      />

      {/* ── Divider line ───────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute top-0 h-full w-0.5 bg-[var(--tenant-primary)]"
        aria-hidden="true"
        style={{ left: `${position}%` }}
      />

      {/* ── "Before" / "After" badges ──────────────────────────────────── */}
      <span
        className="pointer-events-none absolute left-2 top-2 rounded bg-[var(--tenant-primary)] px-2 py-0.5 text-xs font-medium text-white"
        aria-hidden="true"
      >
        Before
      </span>
      <span
        className="pointer-events-none absolute right-2 top-2 rounded bg-[var(--tenant-primary)] px-2 py-0.5 text-xs font-medium text-white"
        aria-hidden="true"
      >
        After
      </span>

      {/*
        ── Slider handle + interaction surface ───────────────────────────
        The entire container is the focusable slider. The visible handle is
        centred on the divider; pointer/keyboard handlers live on the parent.
      */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Before and after comparison for ${caseLabel}`}
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={position}
        aria-valuetext={`${position}% ${beforeLabel(position)}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className={
          'absolute inset-0 cursor-ew-resize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--tenant-primary)]'
        }
      >
        {/*
          The visible handle. Sized to the WCAG 2.5.5 48dp target. We use a
          fixed px size (not a tenant value) to guarantee the minimum hit
          area — a hard requirement of accessibility, not a brand decision.
        */}
        <span
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--tenant-primary)] shadow"
          aria-hidden="true"
          style={{
            left: `${position}%`,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
          }}
        >
          {/* Grip icon — purely decorative */}
          <svg
            className="h-full w-full text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </div>
  )
}

/** Human-readable fraction of the reveal, e.g. "mostly before". */
function beforeLabel(position: number): string {
  if (position <= 10) return 'mostly after'
  if (position >= 90) return 'mostly before'
  if (position < 40) return 'more after'
  if (position > 60) return 'more before'
  return 'even split'
}
