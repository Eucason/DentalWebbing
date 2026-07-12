import { useEffect, useRef, useState } from 'react'
import { useAccessibilitySuite } from '../../context/AccessibilitySuiteContext'
import type { ContrastMode, TextScale } from '../../context/AccessibilitySuiteContext'

// ---------------------------------------------------------------------------
// AccessibilityPanel
// ---------------------------------------------------------------------------
// Floating, docked assistive-control dock. It is the *operational surface*
// of AccessibilitySuiteContext: every control writes straight to context state,
// which persists to tenant-scoped localStorage, applies CSS classes to <html>,
// and (when screenReaderMode is on) feeds announcements to the assertive live
// region mounted by the provider.
//
// Design goals:
//  - Fully keyboard operable (Escape closes, focus returns to the trigger).
//  - Tenant-branded purely via Tailwind arbitrary-value utilities resolving
//    the CSS custom properties injected by TenantContext:
//        --tenant-primary / --tenant-secondary / --tenant-accent
//    No inline `style={{ backgroundColor }}` color overrides, no hex, no
//    runtime color hook. BuildPhilosophy §1/§4 hold structurally here.
//  - ARIA-dialog semantics when open; the trigger carries aria-expanded.
//
// NOTE ON STYLING: every visual rule is a standard Tailwind utility, with
// brand colors expressed as `bg-[var(--tenant-primary)]` / `border-[...]` /
// `ring-[...]`. These arbitrary values are first-class Tailwind v3 utilities;
// they resolve against the root custom properties at paint time.
// ---------------------------------------------------------------------------

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLButtonElement>(null)

  const suite = useAccessibilitySuite()

  const openPrevFocus = useRef<HTMLElement | null>(null)

  // ── Open / close ───────────────────────────────────────────────────────
  const handleOpen = () => {
    openPrevFocus.current = document.activeElement as HTMLElement | null
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    requestAnimationFrame(() => openPrevFocus.current?.focus())
  }

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => firstFieldRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }
    return undefined
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        handleClose()
      }
    }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        handleClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div className="fixed bottom-5 left-5 z-[9999]">
      {/* ── Floating trigger ─────────────────────────────────────────────── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? handleClose() : handleOpen())}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="Open accessibility preferences"
        className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[var(--tenant-primary)] shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tenant-secondary)] focus-visible:ring-offset-2"
      >
        {/* Accessibility icon — universal wheelchair symbol logo.
            Site-relative path served from the Vite public/ directory. */}
        <img
          src="/Accessibility_button_logo.svg"
          alt=""
          role="presentation"
          width="32"
          height="32"
          className="h-8 w-8 object-contain"
        />
      </button>

      {/* ── Panel body ────────────────────────────────────────────────────── */}
      {open && (
        <div
          ref={panelRef}
          id="a11y-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="a11y-panel-title"
          aria-describedby="a11y-panel-desc"
          className="absolute bottom-16 left-0 w-[20rem] max-w-[calc(100vw-2.5rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
        >
          {/* Header row */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2
                id="a11y-panel-title"
                className="text-base font-semibold text-slate-900"
              >
                Accessibility
              </h2>
              <p
                id="a11y-panel-desc"
                className="text-xs text-slate-500"
              >
                Preferences save automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close accessibility panel"
              className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tenant-primary)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
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

          <div className="flex max-h-[60vh] flex-col gap-5 overflow-y-auto pr-1">
            <TextScaleField
              firstFieldRef={firstFieldRef}
              value={suite.prefs.textScale}
              onChange={suite.setTextScale}
            />

            <ContrastField
              value={suite.prefs.contrastMode}
              onChange={suite.setContrastMode}
            />

            <ToggleRow
              label="Dyslexic font"
              description="OpenDyslexic typeface"
              checked={suite.prefs.dyslexicFont}
              onChange={suite.toggleDyslexicFont}
            />

            <ToggleRow
              label="Text spacing"
              description="Expanded letter and line"
              checked={suite.prefs.textSpacing}
              onChange={suite.toggleTextSpacing}
            />

            <ToggleRow
              label="Audio help"
              description="Announce actions aloud"
              checked={suite.prefs.screenReaderMode}
              onChange={suite.toggleScreenReaderMode}
            />

            <ToggleRow
              label="Touch assist"
              description="Larger tap targets"
              checked={suite.prefs.virtualPointerMode}
              onChange={suite.toggleVirtualPointerMode}
            />

            <KeyboardMap />

            {/* Reset to defaults */}
            <button
              type="button"
              onClick={suite.reset}
              className="mt-1 w-full rounded-lg border-2 border-[var(--tenant-primary)] bg-white py-2.5 text-sm font-medium text-[var(--tenant-primary)] transition-colors hover:bg-[var(--tenant-primary)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tenant-primary)] focus-visible:ring-offset-1"
            >
              Reset to defaults
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-controls
// ---------------------------------------------------------------------------

interface TextScaleFieldProps {
  /** Forwarded to the first chip so open moves focus into the panel. */
  firstFieldRef?: React.RefObject<HTMLButtonElement | null>
  value: TextScale
  onChange: (v: TextScale) => void
}

/**
 * Segmented control for text scale. Each chip is a real <button> carrying
 * role="radio" / aria-checked so assistive tech reads the chosen state.
 */
function TextScaleField({ firstFieldRef, value, onChange }: TextScaleFieldProps) {
  const options: { key: TextScale; size: string; label: string }[] = [
    { key: 'normal', size: 'text-sm', label: 'Normal' },
    { key: 'large', size: 'text-base', label: 'Large' },
    { key: 'x-large', size: 'text-lg', label: 'Large+' },
  ]
  return (
    <FieldGroup label="Text size">
      <div className="grid grid-cols-3 gap-1.5">
        {options.map((opt, idx) => {
          const active = value === opt.key
          return (
            <button
              key={opt.key}
              ref={idx === 0 ? firstFieldRef : undefined}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.key)}
              className={[
                'flex flex-col items-center gap-0.5 rounded-lg border py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tenant-primary)] focus-visible:ring-offset-1',
                active
                  ? 'border-[var(--tenant-primary)] bg-[var(--tenant-primary)] text-white'
                  : 'border-slate-300 bg-transparent text-slate-600',
              ].join(' ')}
            >
              <span aria-hidden="true" className={`font-bold ${opt.size}`}>
                A
              </span>
              <span className="text-[0.65rem]">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </FieldGroup>
  )
}

interface ContrastFieldProps {
  value: ContrastMode
  onChange: (v: ContrastMode) => void
}

function ContrastField({ value, onChange }: ContrastFieldProps) {
  const options: { key: ContrastMode; label: string }[] = [
    { key: 'default', label: 'Default' },
    { key: 'high-contrast', label: 'High' },
    { key: 'inverted', label: 'Invert' },
    { key: 'monochrome', label: 'Mono' },
  ]
  return (
    <FieldGroup label="Contrast">
      <div className="grid grid-cols-4 gap-1.5">
        {options.map((opt) => {
          const active = value === opt.key
          return (
            <button
              key={opt.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.key)}
              className={[
                'rounded-lg border py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tenant-primary)] focus-visible:ring-offset-1',
                active
                  ? 'border-[var(--tenant-primary)] bg-[var(--tenant-primary)] text-white'
                  : 'border-slate-300 bg-transparent text-slate-600',
              ].join(' ')}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </FieldGroup>
  )
}

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}

/** Labelled switch — role="switch" + aria-checked matches the intended state. */
function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="flex flex-col">
        <span className="text-sm font-medium text-slate-900">{label}</span>
        <span className="text-xs text-slate-500">{description}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tenant-primary)] focus-visible:ring-offset-2',
          checked ? 'bg-[var(--tenant-primary)]' : 'bg-slate-300',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(1.25rem)' : 'translateX(0)' }}
        />
      </button>
    </label>
  )
}

// ---------------------------------------------------------------------------
// Keyboard map — static, always-accessible cheat sheet
// ---------------------------------------------------------------------------
function KeyboardMap() {
  const rows: { keys: string; helps: string }[] = [
    { keys: 'Tab', helps: 'Move forward' },
    { keys: 'Shift+Tab', helps: 'Move back' },
    { keys: 'Enter', helps: 'Activate item' },
    { keys: 'Space', helps: 'Toggle item' },
    { keys: 'Esc', helps: 'Close menu' },
    { keys: 'Arrows', helps: 'Navigate list' },
  ]
  return (
    <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <summary className="cursor-pointer rounded text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]">
        Keyboard map
      </summary>
      <dl className="mt-2 grid grid-cols-1 gap-1.5">
        {rows.map((row) => (
          <div key={row.keys} className="flex items-center justify-between">
            <dt>
              <span className="inline-flex rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-xs text-slate-800 shadow-sm">
                {row.keys}
              </span>
            </dt>
            <dd className="text-xs text-slate-600">{row.helps}</dd>
          </div>
        ))}
      </dl>
    </details>
  )
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-0 m-0 p-0">
      <legend className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </legend>
      {children}
    </fieldset>
  )
}
