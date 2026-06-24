import { useTenantConfig } from '../context/useTenant'
import type { TenantSections } from '../types'

/**
 * Returns whether a layout section is visible for the current tenant.
 *
 * Missing section config defaults to visible for backwards compatibility.
 */
export function useSectionVisible(section: keyof TenantSections): boolean {
  const config = useTenantConfig()
  return config.sections?.[section] ?? true
}
