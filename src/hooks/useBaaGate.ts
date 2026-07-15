import { useCallback } from 'react'
import { useBaaRegistry } from '../context/BaaRegistry'

/**
 * Returned by {@link useBaaGate}. Lets a PHI-adjacent flow check clearance
 * and emit an audit record in one call.
 */
export interface BaaGate {
  /** `true` when the vendor has a BAA on file and the flow may proceed. */
  cleared: boolean
  /**
   * Record a PHI-adjacent read/write against this vendor in the audit log.
   * Always call this *before* the operation so blocked attempts are captured.
   */
  audit: (action: string) => void
  /**
   * `true` when the vendor's script/embed is permitted to load (R6 script
   * isolation). Mirrors `cleared` but kept distinct for call-site intent.
   */
  canLoadScript: boolean
}

/**
 * Wrap the BAA registry for a single vendor so PHI-adjacent flows can gate
 * themselves declaratively.
 *
 *   const { cleared, audit } = useBaaGate('nexhealth-scheduling')
 *   audit('scheduling:read')        // always log the attempt
 *   if (!cleared) return            // R4 — block if no BAA
 *
 * The gate is intentionally fail-closed: an unknown vendor key resolves to
 * `cleared = false`, so a typo or a vendor that was never provisioned can
 * never accidentally touch PHI.
 */
export function useBaaGate(vendorKey: string): BaaGate {
  const { isBaaCleared, canLoadScript, auditLog } = useBaaRegistry()

  const cleared = isBaaCleared(vendorKey)
  const scriptOk = canLoadScript(vendorKey)

  const audit = useCallback(
    (action: string) => {
      auditLog(action, vendorKey)
    },
    [auditLog, vendorKey],
  )

  return { cleared, audit, canLoadScript: scriptOk }
}
