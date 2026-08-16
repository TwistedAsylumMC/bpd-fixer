import fs from 'node:fs';
import path from 'node:path';
import { parseSchema, serializeSchema } from './util/json.js';
import { overrides } from './overrides/registry.js';
import { applyOverride } from './overrides/ops.js';
import { resolveOverride } from './overrides/resolve.js';
import { rules } from './rules.js';

/** Files copied without parsing */
const RAW_PASSTHROUGH = new Set(['__protocoldoc.json']);

export interface FileResult {
  fileName: string;
  /** Whether a registered override was applied. */
  overridden: boolean;
  /** Whether a global rule changed this file. */
  ruled: boolean;
  /** Whether the produced content differs from upstream. */
  changed: boolean;
  /** The override's `reason`, when present. */
  reason?: string;
  /**
   * Why a registered override was deliberately not applied — the protocol version
   * falls outside every variant, or the variant's `expect` didn't hold. The file
   * is passed through unfixed.
   */
  skipped?: string;
  /**
   * Ops upstream has already applied, on an override that still does something
   * else. Not an error, but the `reason` is drifting out of date.
   */
  redundant?: string[];
  /** Upstream content (for diffing/reporting). */
  input: string;
  /** Corrected content to write. */
  content: string;
}

export function generate(inputDir: string): FileResult[] {
  const files = fs
    .readdirSync(inputDir)
    .filter((f) => f.endsWith('.json'))
    .sort();

  const results: FileResult[] = [];
  for (const fileName of files) {
    const input = fs.readFileSync(path.join(inputDir, fileName), 'utf8');

    if (RAW_PASSTHROUGH.has(fileName)) {
      results.push({ fileName, overridden: false, ruled: false, changed: false, input, content: input });
      continue;
    }

    const schema = parseSchema(input);

    let ruled = false;
    for (const rule of rules) if (rule.apply(schema, fileName)) ruled = true;

    const resolution = resolveOverride(overrides[fileName], schema);
    const result =
      resolution.kind === 'apply'
        ? applyOverride(schema, resolution.override, fileName)
        : schema;

    const content = serializeSchema(result);
    results.push({
      fileName,
      overridden: resolution.kind === 'apply',
      ruled,
      changed: content !== input,
      reason: resolution.kind === 'apply' ? resolution.override.reason : undefined,
      skipped: resolution.kind === 'skip' ? resolution.why : undefined,
      redundant:
        resolution.kind === 'apply' && resolution.redundant.length > 0
          ? resolution.redundant
          : undefined,
      input,
      content,
    });
  }
  return results;
}
