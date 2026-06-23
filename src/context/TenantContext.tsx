import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { TenantConfig } from '../types'
import { MOCK_TENANT_CONFIG } from '../mocks/data'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SESSION_KEY = 'tenant_config'
const SESSION_TS_KEY = 'tenant_config_ts'
const TTL_MS = 30 * 60 * 1000 // 30 minutes

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------
type TenantState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; config: TenantConfig }

// ---------------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------------
interface TenantContextValue {
  state: TenantState
  /** Convenience: the resolved config (only defined when status === 'ready') */
  config: TenantConfig | null
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the cached TenantConfig if it exists and is within the TTL. */
function loadCachedConfig(): TenantConfig | null {
  try {
    const ts = sessionStorage.getItem(SESSION_TS_KEY)
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!ts || !raw) return null
    if (Date.now() - parseInt(ts, 10) > TTL_MS) {
      sessionStorage.removeItem(SESSION_KEY)
      sessionStorage.removeItem(SESSION_TS_KEY)
      return null
    }
    return JSON.parse(raw) as TenantConfig
  } catch {
    return null
  }
}

/** Writes a TenantConfig to sessionStorage with a current timestamp. */
function persistConfig(config: TenantConfig): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(config))
    sessionStorage.setItem(SESSION_TS_KEY, String(Date.now()))
  } catch {
    // sessionStorage may be unavailable in some environments; ignore silently.
  }
}

/** Injects tenant brand colors as CSS custom properties on the root element. */
function applyTenantColors(colors: TenantConfig['colors']): void {
  const root = document.documentElement
  root.style.setProperty('--tenant-primary', colors.primary)
  root.style.setProperty('--tenant-secondary', colors.secondary)
  root.style.setProperty('--tenant-accent', colors.accent)
}

/** Resolves the domain to use for tenant lookup. */
function resolveDomain(): string {
  const override = import.meta.env.VITE_DEV_OVERRIDE_DOMAIN
  if (import.meta.env.VITE_APP_ENV === 'development' && override) {
    return override
  }
  return window.location.hostname
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
interface TenantProviderProps {
  children: ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [state, setState] = useState<TenantState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function fetchTenantConfig() {
      // 0. Honor the mock toggle first — in offline dev we never want to fall
      //    through to a network call or surface stale cached real data.
      if (import.meta.env.VITE_USE_MOCKS === 'true') {
        applyTenantColors(MOCK_TENANT_CONFIG.colors)
        if (!cancelled) setState({ status: 'ready', config: MOCK_TENANT_CONFIG })
        return
      }

      // 1. Try the cache first
      const cached = loadCachedConfig()
      if (cached) {
        applyTenantColors(cached.colors)
        if (!cancelled) setState({ status: 'ready', config: cached })
        return
      }

      // 2. Fetch from the API
      const domain = resolveDomain()
      const apiHost = import.meta.env.VITE_API_HOST
      const configPath = import.meta.env.VITE_TENANT_CONFIG_PATH
      const url = `${apiHost}${configPath}?domain=${encodeURIComponent(domain)}`

      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Tenant config request failed: ${response.status} ${response.statusText}`)
        }
        const config = (await response.json()) as TenantConfig
        applyTenantColors(config.colors)
        persistConfig(config)
        if (!cancelled) setState({ status: 'ready', config })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown tenant resolution error'

        if (import.meta.env.VITE_APP_ENV === 'development') {
          console.error('[TenantContext] Failed to resolve tenant config:', err)
        } else {
          // Production error-monitoring hook — replace with your service (e.g. Sentry)
          // reportErrorToMonitoring(err)
        }

        if (!cancelled) setState({ status: 'error', message })
      }
    }

    void fetchTenantConfig()
    return () => {
      cancelled = true
    }
  }, [])

  const config = state.status === 'ready' ? state.config : null

  return (
    <TenantContext.Provider value={{ state, config }}>
      {state.status === 'loading' && <TenantLoadingFallback />}
      {state.status === 'error' && <TenantErrorPage message={state.message} />}
      {state.status === 'ready' && children}
    </TenantContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hooks — co-located with context per React convention
// ---------------------------------------------------------------------------

/** Returns the current tenant state and resolved config (or null if not ready). */
// eslint-disable-next-line react-refresh/only-export-components
export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext)
  if (!ctx) {
    throw new Error('useTenant must be used inside <TenantProvider>')
  }
  return ctx
}

/**
 * Returns the resolved TenantConfig.
 * Throws if called outside a ready TenantProvider — use only in components
 * that are guaranteed to render after the provider is ready.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTenantConfig(): TenantConfig {
  const { config } = useTenant()
  if (!config) {
    throw new Error('useTenantConfig called before tenant is ready')
  }
  return config
}

// ---------------------------------------------------------------------------
// Internal fallback UI — intentionally unbranded
// ---------------------------------------------------------------------------

function TenantLoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        gap: '16px',
        background: '#f9fafb',
        color: '#374151',
        fontFamily: 'system-ui, sans-serif',
      }}
      role="status"
      aria-label="Loading clinic information"
    >
      <Spinner />
      <p style={{ margin: 0, fontSize: '0.95rem', color: '#6b7280' }}>Loading…</p>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      style={{ animation: 'spin 0.9s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="18" cy="18" r="14" stroke="#e5e7eb" strokeWidth="4" fill="none" />
      <path
        d="M32 18a14 14 0 0 0-14-14"
        stroke="#6b7280"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function TenantErrorPage({ message }: { message: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        gap: '12px',
        background: '#f9fafb',
        color: '#374151',
        fontFamily: 'system-ui, sans-serif',
        padding: '24px',
        textAlign: 'center',
      }}
      role="alert"
    >
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
        Unable to load clinic information
      </h1>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
        Please try refreshing the page. If the problem persists, contact support.
      </p>
      {import.meta.env.VITE_APP_ENV === 'development' && (
        <pre
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#f3f4f6',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#ef4444',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxWidth: '560px',
          }}
        >
          {message}
        </pre>
      )}
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '8px',
          padding: '8px 20px',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          background: '#fff',
          cursor: 'pointer',
          fontSize: '0.9rem',
          color: '#374151',
        }}
      >
        Retry
      </button>
    </div>
  )
}
