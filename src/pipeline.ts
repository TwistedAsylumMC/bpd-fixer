import fs from 'node:fs';
import path from 'node:path';
import { parseSchema, serializeSchema } from './util/json.js';
import { overrides } from './overrides/registry.js';
import { applyOverride } from './overrides/ops.js';
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

    const override = overrides[fileName];
    const result = override ? applyOverride(schema, override, fileName) : schema;

    const content = serializeSchema(result);
    results.push({
      fileName,
      overridden: Boolean(override),
      ruled,
      changed: content !== input,
      reason: override?.reason,
      input,
      content,
    });
  }
  return results;
}
