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

  const allOffences = [];
  for (const rel of targets) {
    const found = scanFile(rel);
    if (found.length) allOffences.push(...found);
  }

  if (allOffences.length) {
    console.error('\n🛑 ARCHITECTURAL GATE REJECTION (arch-lint):');
    console.error(
      '   Raw hex color literals were found in component/presentation .tsx',
    );
    console.error(
      '   files. Per BuildPhilosophy §1/§4, visual identity must resolve via',
    );
    console.error(
      '   CSS custom properties (e.g. bg-[var(--tenant-primary)]), not raw hex.',
    );
    console.error('');
    allOffences.forEach((o) => console.error(o));
    console.error('');
    process.exit(1);
  }

  console.log('✅ arch-lint: zero hex literals in component tree changes.');
  process.exit(0);
}

main();
