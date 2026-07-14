import { useTenantConfig } from '../context/useTenant'
import type { TenantSections } from '../types'

export interface SectionVisibleOptions {
  /**
   * Value returned when the section key is absent from the tenant's config.
   *
   * DEFAULTS TO `true` for backwards compatibility: existing tenant configs
   * that omit a key keep the section visible.
   *
   * New sections added by Phase 4 pass `{ defaultValue: false }` so they are
   * opt-in per tenant (mirrors the feature-flag R3 resolution).
   */
  defaultValue?: boolean
}

/**
 * Returns whether a layout section is visible for the current tenant.
 *
 * Missing section config defaults to visible for backwards compatibility.
 * New Phase-4 sections pass `{ defaultValue: false }` to be opt-in.
 */
export function useSectionVisible(
  section: keyof TenantSections,
  options: SectionVisibleOptions = {},
): boolean {
  const config = useTenantConfig()
  return config.sections?.[section] ?? options.defaultValue ?? true
}
