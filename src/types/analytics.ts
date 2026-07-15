// ─────────────────────────────────────────────────────────────────────────────
// src/types/analytics.ts
// ─────────────────────────────────────────────────────────────────────────────
// Per-tenant analytics integration config.
//
// All fields are optional — tenants without an analytics block simply don't
// get tracking (backwards-compatible). IDs are resolved from tenant config,
// never hardcoded (R1).
//
// R5 tracker hygiene: even when configured, the analytics layer NO-OPs until
// the user grants tracking consent and the current route is not PHI-adjacent.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tracking-integration identifiers for a single tenant.
 *
 *   gtmId              — Google Tag Manager container (e.g. "GTM-XXXXXXX")
 *   ga4Id              — Google Analytics 4 measurement ID (e.g. "G-XXXXXXXXXX")
 *   metaCapiPixelId    — Meta (Facebook) Pixel ID for Conversions API events
 *   metaCapiAccessToken— Meta CAPI access-token reference. In production the
 *                        real token stays server-side; the client sends events
 *                        to a server-side proxy which attaches it. Included
 *                        here for tenant-config completeness (R4 — no PHI /
 *                        secret leakage into the client bundle).
 *   callrailDniId      — CallRail DNI pool ID for dynamic number insertion
 */
export interface AnalyticsConfig {
  gtmId?: string
  ga4Id?: string
  metaCapiPixelId?: string
  metaCapiAccessToken?: string
  callrailDniId?: string
}
