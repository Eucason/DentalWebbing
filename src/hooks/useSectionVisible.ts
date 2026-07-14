import { useTenantConfig } from '../context/useTenant';
import type { TenantSections } from '../types';
import { resolveSection, type ResolvableOptions } from './resolveFlag';

export type { ResolvableOptions as SectionVisibleOptions };

/**
 * Returns whether a layout section is visible for the current tenant.
 *
 * Missing section config defaults to visible for backwards compatibility.
 * New Phase-4 sections pass `{ defaultValue: false }` to be opt-in.
 *
 * Resolution is delegated to the pure `resolveSection` (PRE-1 / R3).
 */
export function useSectionVisible(
  section: keyof TenantSections,
  options: ResolvableOptions = {},
): boolean {
  const config = useTenantConfig();
  return resolveSection(config.sections, section, options);
}
