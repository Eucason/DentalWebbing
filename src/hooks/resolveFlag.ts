// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/resolveFlag.ts
// ─────────────────────────────────────────────────────────────────────────────
// Pure (no React) resolution of a tenant feature / section toggle.
//
// The hooks (useFeatureFlag / useSectionVisible) delegate here so the fallback
// logic is unit-testable without a renderer and is the single source of truth
// for the PRE-1 (R3) opt-in resolution.
//
// Contract
//   features?.[key]  truthy  → true
//   features?.[key]  falsy   → false   (explicit opt-out wins)
//   key absent                → options.defaultValue ?? true
//
// For LEGACY flags consumers omit `defaultValue`, so a missing key still
// resolves to `true` (backwards-compatible). Every NEW Phase-4 flag MUST pass
// `{ defaultValue: false }` so it stays off until a tenant opts in.
// ─────────────────────────────────────────────────────────────────────────────

export interface ResolvableOptions {
  /** Value returned when the key is absent from the config. Defaults to `true`. */
  defaultValue?: boolean;
}

function resolve<T extends object>(
  map: T | undefined,
  key: string,
  options: ResolvableOptions = {},
): boolean {
  if (map && key in map) {
    const value = (map as Record<string, unknown>)[key];
    return Boolean(value);
  }
  return options.defaultValue ?? true;
}

/** Resolve a single feature flag for the current tenant. */
export function resolveFlag<T extends object>(
  features: T | undefined,
  flag: string,
  options: ResolvableOptions = {},
): boolean {
  return resolve(features, flag, options);
}

/** Resolve a single section's visibility for the current tenant. */
export function resolveSection<T extends object>(
  sections: T | undefined,
  section: string,
  options: ResolvableOptions = {},
): boolean {
  return resolve(sections, section, options);
}
