#!/usr/bin/env node
/**
 * bpd-fixer CLI.
 *
 *   bpd-fixer                 write corrected schemas to output/json
 *   bpd-fixer --check         don't write; fail (exit 1) if output/ is stale
 *   bpd-fixer --in <dir>      input schema dir (default vendor submodule)
 *   bpd-fixer --out <dir>     output dir (default output/json)
 *   bpd-fixer --verbose       print a diff for each changed file
 */
import fs from 'node:fs';
import path from 'node:path';
import { generate } from './pipeline.js';
import { lineDiff } from './util/diff.js';

const argv = process.argv.slice(2);
const has = (flag: string) => argv.includes(flag);
const opt = (name: string, def: string): string => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1]! : def;
};

const inputDir = opt('--in', path.join('vendor', 'bedrock-protocol-docs', 'json'));
const outputDir = opt('--out', path.join('output', 'json'));
const check = has('--check');
const verbose = has('--verbose');

if (!fs.existsSync(inputDir)) {
  console.error(`Input dir not found: ${inputDir}`);
  console.error('Did you init the submodule? git submodule update --init --recursive');
  process.exit(2);
}

const results = generate(inputDir);
const overridden = results.filter((r) => r.overridden);
const ruledOnly = results.filter((r) => r.ruled && !r.overridden && r.changed);
const changed = results.filter((r) => r.changed);
const skipped = results.filter((r) => r.skipped);
const redundant = results.filter((r) => r.redundant);

// Skips are expected on mirrored branches, not a failure. They are printed on
// every run (including --check) so a fix quietly not applying is visible.
const reportSkips = () => {
  if (skipped.length === 0) return;
  console.log(`\n${skipped.length} override(s) not applied at this protocol version:`);
  for (const r of skipped) console.log(`  - ${r.fileName}: ${r.skipped}`);
};

// Partly-stale overrides: still doing something, but upstream has caught up on
// part of what they correct, so the `reason` no longer describes all of it.
const reportRedundant = () => {
  if (redundant.length === 0) return;
  console.log(`\n${redundant.length} override(s) with ops upstream has already applied:`);
  for (const r of redundant) console.log(`  - ${r.fileName}: ${r.redundant!.join(', ')}`);
};

if (check) {
  const drift: string[] = [];
  for (const r of results) {
    const target = path.join(outputDir, r.fileName);
    const existing = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
    if (existing !== r.content) drift.push(r.fileName);
  }
  console.log(
    `Checked ${results.length} files, ${overridden.length} override(s), ` +
      `${ruledOnly.length} rule-only change(s), ${changed.length} changed vs upstream.`,
  );
  reportSkips();
  reportRedundant();
  if (drift.length > 0) {
    console.error(`\n${drift.length} file(s) differ from committed ${outputDir} (run: npm run build:schemas):`);
    for (const f of drift.slice(0, 50)) console.error('  ' + f);
    if (drift.length > 50) console.error(`  ... and ${drift.length - 50} more`);
    process.exit(1);
  }
  console.log('Output is up to date.');
} else {
  fs.mkdirSync(outputDir, { recursive: true });
  for (const r of results) fs.writeFileSync(path.join(outputDir, r.fileName), r.content);
  console.log(
    `Wrote ${results.length} files to ${outputDir}, ${overridden.length} override(s), ` +
      `${ruledOnly.length} rule-only change(s), ${changed.length} changed vs upstream.`,
  );
  reportSkips();
  reportRedundant();
  for (const r of changed) {
    const tag = r.overridden ? (r.reason ?? 'override') : 'rule';
    console.log(`\n• ${r.fileName}: ${tag}`);
    if (verbose) console.log(lineDiff(r.input, r.content));
  }
}
