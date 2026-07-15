import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useTenant } from './TenantContext'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BaaEntry {
  /** Whether a signed Business Associate Agreement is on file for this vendor. */
  hasBaa: boolean
  /** Human-readable vendor name, surfaced in audit logs and UI fallbacks. */
  vendorName: string
}

/** Stable log of every PHI-adjacent read/write that passed through the gate. */
export interface BaaAuditRecord {
  /** Epoch-ms timestamp of the event. */
  ts: number
  /** The PHI-adjacent action that was attempted (e.g. "scheduling:read"). */
  action: string
  /** The vendor key the action targeted. */
  vendorKey: string
  /** The resolved vendorName at audit time. */
  vendorName: string
  /** Whether the BAA gate allowed the action through. */
  allowed: boolean
}

interface BaaRegistryValue {
  /**
   * Returns `true` when the vendor has a BAA on file. Always `false` for an
   * unknown vendor key — absence of evidence is evidence of absence for PHI.
   */
  isBaaCleared(vendorKey: string): boolean
  /**
   * Returns `true` when the vendor's script/embed is permitted to load
   * (R6 script isolation). Mirrors `isBaaCleared` but kept distinct so the
   * intent at the call site stays legible.
   */
  canLoadScript(vendorKey: string): boolean
  /** Append a record to the in-memory PHI-adjacent audit log. */
  auditLog(action: string, vendorKey: string): void
  /** A READ-ONLY snapshot of the audit log — useful for tests and devtools. */
  readonly auditTrail: readonly BaaAuditRecord[]
}

const BaaRegistryContext = createContext<BaaRegistryValue | undefined>(undefined)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface BaaRegistryProviderProps {
  children: ReactNode
}

export function BaaRegistryProvider({ children }: BaaRegistryProviderProps) {
  const { config } = useTenant()

  // Initialise the immutable registry once from tenant config. We do NOT
  // partition keys by PHI-vs-non — a vendor either has a BAA or it doesn't,
  // and absence of evidence is treated as evidence of absence (see isBaaCleared).
  const [registry] = useState<Record<string, BaaEntry>>(() => config?.baa_registry ?? {})
  // Keep a mutable ref so the stable callbacks below always read fresh state
  // without being recreated on every render.
  const registryRef = useRef(registry)
  registryRef.current = registry

  const [auditTrail, setAuditTrail] = useState<BaaAuditRecord[]>([])

  const auditLog = useCallback((action: string, vendorKey: string): void => {
    const entry = registryRef.current[vendorKey]
    const record: BaaAuditRecord = {
      ts: Date.now(),
      action,
      vendorKey,
      // Unknown vendor → surface the key itself; never crash the audit path.
      vendorName: entry?.vendorName ?? vendorKey,
      // Blocked when there is no entry OR when the entry explicitly lacks a BAA.
      allowed: entry?.hasBaa === true,
    }
    setAuditTrail((prev) => [...prev, record])
  }, [])

  const isBaaCleared = useCallback(
    (vendorKey: string): boolean => registryRef.current[vendorKey]?.hasBaa === true,
    [],
  )

  const canLoadScript = useCallback(
    (vendorKey: string): boolean => {
      // R6 script isolation: only vendors with a BAA on file may inject a
      // third-party script/embed into the page. Mirrors isBaaCleared so the
      // two stay contractually identical even if the rules diverge later.
      return registryRef.current[vendorKey]?.hasBaa === true
    },
    [],
  )

  const value = useMemo<BaaRegistryValue>(
    () => ({
      isBaaCleared,
      canLoadScript,
      auditLog,
      // Expose a frozen snapshot — callers must not mutate the log.
      get auditTrail() {
        return auditTrail as readonly BaaAuditRecord[]
      },
    }),
    [isBaaCleared, canLoadScript, auditLog, auditTrail],
  )

  return <BaaRegistryContext.Provider value={value}>{children}</BaaRegistryContext.Provider>
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access the per-tenant BAA registry and its audit helper.
 * Throws outside <BaaRegistryProvider> — matches the TenantContext convention.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useBaaRegistry(): BaaRegistryValue {
  const ctx = useContext(BaaRegistryContext)
  if (!ctx) {
    throw new Error('useBaaRegistry must be used inside <BaaRegistryProvider>')
  }
  return ctx
}
