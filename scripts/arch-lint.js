#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/arch-lint.js
// ─────────────────────────────────────────────────────────────────────────────
// Fast pre-commit architectural gate. Runs ahead of the progress tracker and
// closes its blind spot: `git diff HEAD` silently skips untracked files, so a
// brand-new component littered with hex literals would sail through undetected.
//
// This script inspects the *index* (staged), *working tree* modifications, and
// *untracked* entries, collects every `.tsx` path under src/components and
// src/pages, and rejects any that introduce a raw hex color literal
// (`#xyz` / `#xxyyzz`) outside the innocuous `var(--tenant-*)` references.
//
// Exit codes
//   0  — clean
//   1  — architectural violation (or execution error)
// ─────────────────────────────────────────────────────────────────────────────

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.join(__dirname, '..');

const SCAN_DIRS = ['src/components', 'src/pages'];
const TENANT_TYPES = path.join(REPO_ROOT, 'src/types/tenant.ts');
const PROGRESS_JSON = path.join(REPO_ROOT, 'progress.json');
// A Phase-4 flag explicitly allowed to keep its true-default despite the
// R3 resolution. Decoded from a decision id of the form
// `allow-true-default:<flag>`. See PRE-1 / R3.
const ALLOW_TRUE_PREFIX = 'allow-true-default:';

// ── Helpers ────────────────────────────────────────────────────────────────
/** True when `rel` lives under one of the watched component trees. */
function isWatchedPath(rel) {
  const norm = path.posix.normalize(rel);
  return SCAN_DIRS.some((dir) => norm === dir || norm.startsWith(dir + '/'));
}

/** True for files that should actually be inspected (not build output, etc). */
function isScannableFile(rel) {
  return isWatchedPath(rel) && rel.endsWith('.tsx');
}

/**
 * `git ls-files` flag matrix:
 *   --cached     → the index (staged for commit)
 *   --others     → untracked files
 *   --modified   → working-tree changes to tracked files
 * Together these cover every file the tracker's `git diff HEAD` misses
 * (untracked) plus what it does see (modified), with the index layered in.
 */
function gitPaths(flags) {
  try {
    const out = execFileSync('git', ['ls-files', ...flags], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

// ── Hexcolor detection ────────────────────────────────────────────────────
// Matches `#fff`, `#FFF`, `#ff0000`, `#FF0000` etc.
const HEX_LITERAL = /#[0-9a-fA-F]{3,6}\b/g;

/**
 * Is this hex match part of an allowed, innocuous pattern?
 * We tolerate:
 *   - references to CSS custom properties: `var(--tenant-primary #fallback)`
 *     (the fallback value is authored in CSS, not a TSX styling decision)
 *   - anything inside a "localhost" / 127.x comment is irrelevant (not
 *     rechecked here — that is the tracker's Rule 1 job).
 *
 * Practically, every hex inside a .tsx here is a styling violation, because
 * Tailwind's `bg-[var(--tenant-primary)]` form never needs a hex. We keep a
 * narrow allowlist of non-style tokens that are safe to ignore.
 */
function isAllowedHex(file, match, text) {
  // Stride left from the match to see if it is wrapped in a `var(  …  )`.
  // We only ever *append* tokens via `border-[var(--tenant-primary)]`, so no
  // hex literal appears next to a var() inside .tsx — but guard anyway.
  const idx = text.indexOf(match);
  if (idx < 0) return false;
  const before = text.slice(Math.max(0, idx - 6), idx);
  return before.includes('var(');
}

// ── Scan one file, return the offending line strings ───────────────────────
function scanFile(rel) {
  const abs = path.join(REPO_ROOT, rel);
  let text;
  try {
    text = fs.readFileSync(abs, 'utf8');
  } catch {
    return []; // vanished between listing and read — skip
  }

  const offences = [];
  let lineStart = 0;
  const lines = text.split('\n');

  HEX_LITERAL.lastIndex = 0;
  let m;
  while ((m = HEX_LITERAL.exec(text)) !== null) {
    if (isAllowedHex(rel, m[0], text)) continue;

    // Map character offset → line number.
    let lineNumber = 1;
    for (let i = 0; i < lines.length; i++) {
      const segStart = lineStart;
      const segEnd = lineStart + lines[i].length;
      if (m.index >= segStart && m.index <= segEnd) {
        lineNumber = i + 1;
        break;
      }
      lineStart = segEnd + 1;
    }

    offences.push(`  ${rel}:${lineNumber}  found ${m[0]}`);
  }
  return offences;
}

// ── Phase-4 opt-in gate (PRE-1 / R3) ───────────────────────────────────────
// Every NEW flag/section added by Phase 4 is off by default. A consumer must
// either:
//   (a) pass `{ defaultValue: false }`, or
//   (b) carry an explicit opt-in decision (id `allow-true-default:<flag>`).
// A bare `useFeatureFlag('somePhase4Key')` — no second arg — would silently
// light that flag up for every existing tenant, so the pre-flight rejects it.

/** Read `src/types/tenant.ts` and return the set of Phase-4 flag keys. */
function loadPhase4Keys() {
  let src;
  try {
    src = fs.readFileSync(TENANT_TYPES, 'utf8');
  } catch {
    return new Set();
  }

  // Keys are the optional boolean members declared after the first
  // `── Phase-4 flags` marker comment, up to the next `}` or next top-level
  // comment block that isn't part of the group.
  const lines = src.split('\n');
  const keys = new Set();
  let inGroup = false;
  const keyRe = /^\s+(\w+)\s*\?:\s*boolean/;
  for (const line of lines) {
    if (line.includes('Phase-4 flags') || line.includes('Phase-4') && line.includes('flag')) {
      inGroup = true;
      continue;
    }
    if (inGroup) {
      if (line.trim().startsWith('}') || (line.includes('//') && !line.includes('Phase-4'))) {
        inGroup = false;
        continue;
      }
      const m = line.match(keyRe);
      if (m) keys.add(m[1]);
    }
  }
  return keys;
}

/** Decision ids that opt a specific Phase-4 key back into the true-default. */
function loadAllowedTrueDefaults() {
  const allowed = new Set();
  try {
    const data = JSON.parse(fs.readFileSync(PROGRESS_JSON, 'utf8'));
    for (const d of data.decisions ?? []) {
      if (typeof d.id === 'string' && d.id.startsWith(ALLOW_TRUE_PREFIX)) {
        allowed.add(d.id.slice(ALLOW_TRUE_PREFIX.length));
      }
    }
  } catch {
    // ledger absent/unreadable → safest to allow nothing extra
  }
  return allowed;
}

const FLAG_CALL_RE = /(?:useFeatureFlag|useSectionVisible)\(\s*['"]([a-zA-Z0-9_]+)['"]\s*([),])/g;

/**
 * Returns offences for Phase-4 flags consumed without an explicit default or a
 * recorded opt-in decision. A second argument (`,`) is assumed to carry the
 * `{ defaultValue: false }` opt-in; a `)` immediately after the key is the
 * bare/unsafe form.
 */
function scanPhase4(rel, phase4Keys, allowedTrue) {
  if (phase4Keys.size === 0) return [];

  const abs = path.join(REPO_ROOT, rel);
  let text;
  try {
    text = fs.readFileSync(abs, 'utf8');
  } catch {
    return [];
  }

  const offences = [];
  FLAG_CALL_RE.lastIndex = 0;
  let m;
  while ((m = FLAG_CALL_RE.exec(text)) !== null) {
    const [, key, terminator] = m;
    if (!phase4Keys.has(key)) continue; // a legacy key — not our concern
    if (terminator === ',') continue; // has a options arg — assumed opt-in
    if (allowedTrue.has(key)) continue; // recorded decision permits true
    const lineNo = text.slice(0, m.index).split('\n').length;
    offences.push(`  ${rel}:${lineNo}  useFeatureFlag('${key}') — missing { defaultValue: false }`);
  }
  return offences;
}

// ── Driver ─────────────────────────────────────────────────────────────────
function main() {
  // Union of every path that could be inspected at commit time.
  const staged = gitPaths(['--cached']);
  const modified = gitPaths(['--modified']);
  const untracked = gitPaths(['--others', '--exclude-standard']);

  const allPaths = new Set([...staged, ...modified, ...untracked]);
  const targets = [...allPaths].filter(isScannableFile).sort();

  if (targets.length === 0) {
    console.log('✅ arch-lint: no component tree changes to inspect.');
    process.exit(0);
  }

  console.log(`🛡️  arch-lint: scanning ${targets.length} .tsx file(s) under ${SCAN_DIRS.join(', ')}…\n`);

  const phase4Keys = loadPhase4Keys();
  const allowedTrue = loadAllowedTrueDefaults();

  const allOffences = [];
  for (const rel of targets) {
    const found = [...scanFile(rel), ...scanPhase4(rel, phase4Keys, allowedTrue)];
    if (found.length) allOffences.push(...found);
  }

  if (allOffences.length) {
    console.error('\n🛑 ARCHITECTURAL GATE REJECTION (arch-lint):');
    console.error(
      '   Architectural violations found in component/presentation .tsx files:',
    );
    console.error('');
    allOffences.forEach((o) => console.error(o));
    console.error('');
    console.error(
      '   • Hex literals: visual identity must resolve via CSS custom',
      '     properties (e.g. bg-[var(--tenant-primary)]), not raw hex.',
    );
    console.error(
      '   • Phase-4 flags/sections (R3 / PRE-1): a bare',
      "     useFeatureFlag('<key>') with no { defaultValue: false } would",
      '     silently enable it for every existing tenant. Either pass the',
      '     opt-in explicitly, OR record a decision',
      `     \`${ALLOW_TRUE_PREFIX}<key>\` in progress.json.`,
    );
    console.error('');
    process.exit(1);
  }

  console.log(
    `✅ arch-lint: zero hex literals${
      phase4Keys.size ? ' and no Phase-4 opt-in violations' : ''
    } in component tree changes.`,
  );
  process.exit(0);
}

main();
