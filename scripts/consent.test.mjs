// ─────────────────────────────────────────────────────────────────────────────
// scripts/consent.test.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Pure-logic tests for the granular consent model (B14 — full CMP) and for the
// B14 pre-consent tracker-blocking guarantee.
//
// `consent.ts` touches `localStorage` and `window.dispatchEvent`. Neither is
// available in the `node:test` runner, so we install minimal shims BEFORE the
// import and reset them between tests. Run via `npm test` (which compiles the
// consent module to dist-test/, see `test:build`).
//
// What we prove here:
//   1. Pre-consent blocking — `hasConsented()` / `hasConsentFor()` return false
//      before any choice, and `getConsentState()` returns 'pending'. This is the
//      R5 guarantee the analytics layer relies on (no trackers pre-consent).
//   2. Granular categories — `necessary` is always true; analytics & marketing
//      default off and honor opt-in/opt-out independently; an unknown category
//      never reports consent.
//   3. Necessary is immutable — setConsentPreferences cannot flip it off.
//   4. Binary ⇄ granular bridge — granting via the B12 API syncs onto the
//      per-tenant granular record, and vice-versa, so the two layers cannot
//      drift (keeps analytics.ts honest after a modal save).
// ─────────────────────────────────────────────────────────────────────────────

import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// ── Minimal browser shims (must precede the module import) ────────────────────
const store = new Map();
const listeners = new Map();

function makeDispatcher() {
  return {
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      listeners.get(type)?.delete(fn);
    },
    dispatchEvent(event) {
      // Minimal Event-ish: `type` + optional `detail`.
      // Node's CustomEvent.detail is NOT enumerable, so spread loses it —
      // pass it explicitly for listeners that read e.detail.
      listeners.get(event.type)?.forEach((fn) =>
        fn({ preventDefault() {}, detail: event.detail, ...event }),
      );
      return true;
    },
  };
}

globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => void store.set(k, String(v)),
  removeItem: (k) => void store.delete(k),
  clear: () => store.clear(),
};
globalThis.window = makeDispatcher();

function resetShims() {
  store.clear();
  listeners.clear();
}

// Import the compiled module AFTER the shims are in place.
const consent = await import('../dist-test/utils/consent.js');
const {
  getConsentState,
  hasConsented,
  hasConsentFor,
  getConsentPreferences,
  setConsentPreferences,
  grantConsent,
  denyConsent,
  defaultPreferences,
} = consent;

const TENANT = 'mock-tenant-1';

// B12 analytics uses the no-tenant overload. Run every test against a clean
// store so the global `dw_analytics_consent` key and the per-tenant key both
// start undefined.
beforeEach(() => resetShims());

test('PRE-consent: hasConsented() is false before any choice (R5 tracker block)', () => {
  assert.equal(hasConsented(TENANT), false, 'no tenant record → not consented');
  assert.equal(hasConsented(), false, 'global overload → not consented');
});

test('PRE-consent: getConsentState() returns "pending" before any choice', () => {
  assert.equal(getConsentState(TENANT), 'pending');
  assert.equal(getConsentState(), 'pending');
});

test('PRE-consent: every tracking category reports not-consented (R5 / R6)', () => {
  assert.equal(hasConsentFor(TENANT, 'analytics'), false);
  assert.equal(hasConsentFor(TENANT, 'marketing'), false);
  assert.equal(hasConsentFor(TENANT, 'any'), false, '"any" mirrors hasConsented');
});

test('necessary is always reported as consented (ePrivacy exemption)', () => {
  assert.equal(hasConsentFor(TENANT, 'necessary'), true, 'pre-consent necessary');
  grantConsent(TENANT);
  assert.equal(hasConsentFor(TENANT, 'necessary'), true, 'post-grant necessary');
  denyConsent(TENANT);
  assert.equal(hasConsentFor(TENANT, 'necessary'), true, 'post-deny necessary');
});

test('hasConsentFor() returns false for unknown categories', () => {
  // @ts-expect-error — intentionally bad key to prove the safe default
  assert.equal(hasConsentFor(TENANT, 'telepathy'), false);
});

test('getConsentPreferences() returns a complete default shape for a new tenant', () => {
  const prefs = getConsentPreferences(TENANT);
  assert.deepEqual(prefs, { necessary: true, analytics: false, marketing: false });
});

test('Accept All (grantConsent) opts in analytics + marketing and is detected', () => {
  grantConsent(TENANT);
  const prefs = getConsentPreferences(TENANT);
  assert.equal(prefs.analytics, true);
  assert.equal(prefs.marketing, true);
  assert.equal(prefs.necessary, true);
  assert.equal(hasConsented(TENANT), true);
  assert.equal(hasConsentFor(TENANT, 'analytics'), true);
  assert.equal(hasConsentFor(TENANT, 'marketing'), true);
});

test('Reject All (denyConsent) opts out every tracking category', () => {
  denyConsent(TENANT);
  const prefs = getConsentPreferences(TENANT);
  assert.equal(prefs.analytics, false);
  assert.equal(prefs.marketing, false);
  assert.equal(hasConsented(TENANT), false);
  assert.equal(getConsentState(TENANT), 'denied');
});

test('Granular: analytics ON / marketing OFF is honored and keeps overall granted', () => {
  setConsentPreferences(TENANT, { necessary: true, analytics: true, marketing: false });
  const prefs = getConsentPreferences(TENANT);
  assert.equal(prefs.analytics, true);
  assert.equal(prefs.marketing, false);
  assert.equal(hasConsentFor(TENANT, 'analytics'), true);
  assert.equal(hasConsentFor(TENANT, 'marketing'), false);
  // At least one tracking category opted in → binary state is 'granted'.
  assert.equal(hasConsented(TENANT), true);
  assert.equal(getConsentState(TENANT), 'granted');
});

test('necessary is immutable — setConsentPreferences cannot disable it', () => {
  setConsentPreferences(TENANT, { necessary: false, analytics: true, marketing: true });
  const prefs = getConsentPreferences(TENANT);
  assert.equal(prefs.necessary, true, 'necessary must remain true despite attempt to disable');
});

test('defaultPreferences() returns the pre-consent baseline shape', () => {
  assert.deepEqual(defaultPreferences(), { necessary: true, analytics: false, marketing: false });
});

test('Bridge: granular save syncs the legacy binary KEY-getter to granted/denied', () => {
  // Start from nothing.
  assert.equal(hasConsented(TENANT), false);
  // Save a preferences record that opts analytics only → legacy key must be 'granted'.
  setConsentPreferences(TENANT, { necessary: true, analytics: true, marketing: false });
  assert.equal(getConsentState(TENANT), 'granted', 'legacy key reflects granular opt-in');
  // Now flip to all-off → legacy key must become 'denied'.
  setConsentPreferences(TENANT, { necessary: true, analytics: false, marketing: false });
  assert.equal(getConsentState(TENANT), 'denied', 'legacy key reflects granular opt-out');
});

test('Bridge: B12 grantConsent (no tenant) flips the global legacy key only', () => {
  assert.equal(hasConsented(), false);
  grantConsent(); // legacy path — no tenant id provided
  assert.equal(getConsentState(), 'granted', 'global legacy key set to granted');
});

test('Bridge: B12 denyConsent (no tenant) flips the global legacy key to denied', () => {
  denyConsent();
  assert.equal(getConsentState(), 'denied');
  assert.equal(hasConsented(), false);
});

test('Tenant-scoped isolation: a second tenant starts at "pending" independently', () => {
  grantConsent('tenant-A');
  assert.equal(hasConsented('tenant-A'), true);
  assert.equal(getConsentState('tenant-B'), 'pending', 'tenant B unaffected by tenant A choice');
});

test('dw:consent-changed event fires when consent is granted', () => {
  let last = null;
  window.addEventListener('dw:consent-changed', (e) => {
    last = e.detail;
  });
  grantConsent(TENANT);
  assert.equal(last, 'granted', 'event detail carries the new consent state');
});
