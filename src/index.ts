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
  for (const r of changed) {
    const tag = r.overridden ? (r.reason ?? 'override') : 'rule';
    console.log(`\n• ${r.fileName}: ${tag}`);
    if (verbose) console.log(lineDiff(r.input, r.content));
  }
}
