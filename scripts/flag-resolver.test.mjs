// ─────────────────────────────────────────────────────────────────────────────
// scripts/flag-resolver.test.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Zero-dependency proof for PRE-1 acceptance criterion 2:
//   "At least one new Phase-4 flag proven to default OFF for a tenant-config
//    row missing that key."
//
// The resolver under test is src/hooks/resolveFlag.ts. We compile just that one
// file to JS (see the `test` npm script) and import the compiled output here, so
// no test framework and no React renderer are needed — `node --test` is the
// runner, shipped with Node 22+.
//
// Run:  npm test
// ─────────────────────────────────────────────────────────────────────────────
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveFlag, resolveSection } from '../dist-test/resolveFlag.js';

// A tenant-config row that has NO Phase-4 key present — the scenario PRE-1
// must protect against.
const legacyFeatures = { contactForm: true, bookingWidget: true };
const legacySections = { hero: true, services: true, contact: true };

test('PRE-1: missing Phase-4 flag defaults OFF when defaultValue:false', () => {
  assert.equal(resolveFlag(legacyFeatures, 'beforeAfterGallery', { defaultValue: false }), false);
});

test('PRE-1: explicit false opt-out is honored', () => {
  assert.equal(resolveFlag({ beforeAfterGallery: false }, 'beforeAfterGallery', { defaultValue: false }), false);
});

test('PRE-1: explicit true opt-in is honored', () => {
  assert.equal(resolveFlag({ beforeAfterGallery: true }, 'beforeAfterGallery', { defaultValue: false }), true);
});

test('legacy flag with no key falls back to true (backwards-compat)', () => {
  // A flag the config author has never heard of, and no defaultValue passed.
  assert.equal(resolveFlag(legacyFeatures, 'liveChat'), true);
});

test('legacy flag with explicit key=true wins over absent', () => {
  assert.equal(resolveFlag({ liveChat: true }, 'liveChat'), true);
});

test('missing section defaults OFF when defaultValue:false (Phase-4)', () => {
  assert.equal(resolveSection(legacySections, 'beforeAfterGallery', { defaultValue: false }), false);
});

test('missing legacy section falls back to true (backwards-compat)', () => {
  assert.equal(resolveSection(legacySections, 'map'), true);
});
