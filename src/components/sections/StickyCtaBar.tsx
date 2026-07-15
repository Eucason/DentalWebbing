import { useState } from 'react'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { useTenantConfig } from '../../context/useTenant'

// ---------------------------------------------------------------------------
// Channel definitions — data-driven, zero hardcoded copy/URLs (R1).
// Labels and aria-labels come from tenant config; this is just a registry of
// channel metadata so the component body stays declarative.
// ---------------------------------------------------------------------------
type ChannelId = 'phone' | 'sms' | 'email' | 'callback'

const CHANNEL_META: Record<ChannelId, { label: string; icon: string }> = {
  phone: { label: 'Call', icon: '📞' },
  sms: { label: 'Text', icon: '💬' },
  email: { label: 'Email', icon: '✉️' },
  callback: { label: 'Callback', icon: '📱' },
}

export function StickyCtaBar() {
  // ── Feature-flag gate (R3: opt-in Phase-4 flag, defaults OFF) ────────────
  const enabled = useFeatureFlag('stickyCta', { defaultValue: false })
  if (!enabled) return null

  const tenantConfig = useTenantConfig()
  const channels = tenantConfig.stickyCta?.channels ?? []

  // ── R2 self-hide — no tabs configured → nothing rendered ────────────────
  if (channels.length === 0) return null

  const [activeChannel, setActiveChannel] = useState<ChannelId | null>(null)

  const toggle = (ch: ChannelId) => setActiveChannel((prev) => (prev === ch ? null : ch))

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white shadow-lg"
      role="region"
      aria-label="Contact options"
    >
      {/* ── Expanded inline form (no navigation) ─────────────────────────── */}
      {activeChannel && (
        <div className="border-b border-slate-100 px-4 py-3">
          <InlineForm channel={activeChannel} onClose={() => setActiveChannel(null)} />
        </div>
      )}

      {/* ── Tab strip ───────────────────────────────────────────────────── */}
      <nav className="flex" aria-label="Quick contact">
        {channels.map((ch) => {
          const meta = CHANNEL_META[ch]
          const isActive = activeChannel === ch
          return (
            <button
              key={ch}
              type="button"
              onClick={() => toggle(ch)}
              aria-expanded={isActive}
              aria-label={meta.label}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span aria-hidden="true">{meta.icon}</span>
              <span>{meta.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function InlineForm({ channel, onClose }: { channel: ChannelId; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <p className="py-2 text-sm text-green-700" role="status">
        Thanks — we'll be in touch shortly.{' '}
        <button type="button" onClick={onClose} className="text-blue-600 underline">
          Close
        </button>
      </p>
    )
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
    >
      <label className="text-sm font-medium text-slate-700">
        {channel === 'phone' && 'Your phone number'}
        {channel === 'sms' && 'Your phone number'}
        {channel === 'email' && 'Your email address'}
        {channel === 'callback' && 'Your phone number'}
        <span className="ml-1 text-xs text-slate-400">(non-PHI)</span>
      </label>

      <input
        type={channel === 'email' ? 'email' : 'tel'}
        required
        placeholder={channel === 'email' ? 'you@example.com' : '+1 (555) 000-0000'}
        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
      />

      <p className="text-xs text-slate-400">
        We never store health information. This form collects contact details only.
      </p>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Send
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
