import { useState, useEffect } from 'react'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { useTenantConfig } from '../../context/useTenant'
import {
  hasConsented,
  getConsentPreferences,
  setConsentPreferences,
} from '../../utils/consent'

export function CookieConsentModal() {
  const enabled = useFeatureFlag('cookieConsent', { defaultValue: false })
  if (!enabled) return null

  const tenantConfig = useTenantConfig()
  const tenantId = tenantConfig.id

  const [visible, setVisible] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)

  useEffect(() => {
    if (!hasConsented(tenantId)) setVisible(true)
  }, [tenantId])

  if (!visible) return null

  const prefs = getConsentPreferences(tenantId)

  const acceptAll = () => {
    setConsentPreferences(tenantId, { necessary: true, analytics: true, marketing: true })
    setVisible(false)
  }

  const rejectAll = () => {
    setConsentPreferences(tenantId, { necessary: true, analytics: false, marketing: false })
    setVisible(false)
  }

  const savePreferences = (newPrefs: { necessary: boolean; analytics: boolean; marketing: boolean }) => {
    setConsentPreferences(tenantId, { necessary: true, analytics: newPrefs.analytics, marketing: newPrefs.marketing })
    setShowPrefs(false)
    setVisible(false)
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--tenant-border)] bg-white p-4 shadow-xl"
      role="dialog"
      aria-label="Cookie consent"
      aria-modal={showPrefs}
    >
      {!showPrefs ? (
        <div className="mx-auto max-w-3xl">
          <h2 className="text-lg font-semibold">Your privacy matters</h2>
          <p className="mt-1 text-sm text-slate-600">
            We use cookies to improve your experience. Choose which categories
            you&apos;d like to allow. You can change your preferences at any time.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={acceptAll}
              className="rounded bg-[var(--tenant-primary)] px-4 py-2 text-sm font-medium text-white"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={rejectAll}
              className="rounded border border-[var(--tenant-border)] px-4 py-2 text-sm font-medium"
            >
              Reject all
            </button>
            <button
              type="button"
              onClick={() => setShowPrefs(true)}
              className="rounded border border-[var(--tenant-border)] px-4 py-2 text-sm font-medium underline"
            >
              Preferences
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">
          <h2 className="text-lg font-semibold">Cookie preferences</h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage your cookie preferences below. Strictly necessary cookies
            cannot be disabled.
          </p>

          <ConsentToggle
            label="Strictly necessary"
            description="Required for the site to function. Cannot be disabled."
            checked={prefs.necessary}
            disabled
            onChange={() => {}}
          />
          <ConsentToggle
            label="Analytics"
            description="Help us understand how visitors interact with our website."
            checked={prefs.analytics}
            onChange={(val) => savePreferences({ ...prefs, analytics: val })}
          />
          <ConsentToggle
            label="Marketing"
            description="Used to deliver personalized advertisements."
            checked={prefs.marketing}
            onChange={(val) => savePreferences({ ...prefs, marketing: val })}
          />

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setShowPrefs(false)}
              className="rounded bg-[var(--tenant-primary)] px-4 py-2 text-sm font-medium text-white"
            >
              Save preferences
            </button>
            <button
              type="button"
              onClick={() => setShowPrefs(false)}
              className="rounded border border-[var(--tenant-border)] px-4 py-2 text-sm font-medium"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ConsentToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="mt-4 flex items-start justify-between gap-4 border-t border-[var(--tenant-border)] pt-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
        style={{
          backgroundColor: checked
            ? 'var(--tenant-primary)'
            : 'var(--tenant-border)',
        }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  )
}
