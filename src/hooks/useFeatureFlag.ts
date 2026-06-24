import { useTenantConfig } from '../context/useTenant'
import type { TenantFeatures } from '../types'

/**
 * Returns whether a specific feature flag is enabled for the current tenant.
 *
 * Defaults to `true` when:
 * - the `features` object is omitted entirely
 * - the specific flag key is omitted
 *
 * This keeps existing tenants fully functional until a flag is explicitly
 * toggled off in their config.
 */
export function useFeatureFlag(flag: keyof TenantFeatures): boolean {
  const config = useTenantConfig()
  return config.features?.[flag] ?? true
}
