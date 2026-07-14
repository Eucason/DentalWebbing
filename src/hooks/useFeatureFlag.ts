import { useTenantConfig } from '../context/useTenant'
import type { TenantFeatures } from '../types'

export interface FeatureFlagOptions {
  /**
   * Value returned when the flag key is absent from the tenant's config.
   *
   * DEFAULTS TO `true` for backwards compatibility: existing tenant configs
   * that omit a key keep working as before.
   *
   * ⚠️  PHASE-4 RULE (R3): every NEW flag MUST pass `{ defaultValue: false }`
   * so it stays off for tenants that haven't explicitly opted in. See
   * dentalwebbing-phase4.md and phase4-tasks.json (PRE-1).
   */
  defaultValue?: boolean
}

/**
 * Returns whether a specific feature flag is enabled for the current tenant.
 *
 * Existing flags (contactForm, bookingWidget, …) omit `defaultValue` and keep
 * their historical `true` default. New Phase-4 flags pass `{ defaultValue: false }`
 * so they are opt-in and never silently light up for an existing tenant.
 */
export function useFeatureFlag(
  flag: keyof TenantFeatures,
  options: FeatureFlagOptions = {},
): boolean {
  const config = useTenantConfig()
  return config.features?.[flag] ?? options.defaultValue ?? true
}
