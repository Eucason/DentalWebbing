import { useTenantConfig } from '../context/useTenant';
import type { TenantFeatures } from '../types';
import { resolveFlag, type ResolvableOptions } from './resolveFlag';

export type { ResolvableOptions as FeatureFlagOptions };

/**
 * Returns whether a specific feature flag is enabled for the current tenant.
 *
 * Existing flags (contactForm, bookingWidget, …) omit `defaultValue` and keep
 * their historical `true` default. New Phase-4 flags pass `{ defaultValue: false }`
 * so they are opt-in and never silently light up for an existing tenant.
 *
 * Resolution is delegated to the pure `resolveFlag` so the fallback contract is
 * unit-testable without a renderer (see PRE-1 / R3).
 */
export function useFeatureFlag(
  flag: keyof TenantFeatures,
  options: ResolvableOptions = {},
): boolean {
  const config = useTenantConfig();
  return resolveFlag(config.features, flag, options);
}
