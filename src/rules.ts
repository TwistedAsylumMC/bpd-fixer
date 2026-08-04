/**
 * Global rules: deterministic corrections applied to every schema. Use a rule
 * when the fix follows a mechanical pattern that holds across many files.
 */
import type { AnySchema } from './schema.js';
import { insertSerializationOptions } from './overrides/ops.js';

export interface Rule {
  name: string;
  description: string;
  /** Mutate `schema` in place; return whether anything changed. */
  apply(schema: AnySchema, fileName: string): boolean;
}

/**
 * Every discriminated variant (`oneOf` + `x-control-value-type`) writes its
 * control value compressed (as a varint), but the schemas only record the raw
 * `uint32` type. Add the "Compression" serialization option to each such node.
 */
const compressVariantControlValues: Rule = {
  name: 'compress-variant-control-values',
  description: "Add Compression to every oneOf variant's control value (it is varint-encoded).",
  apply(schema) {
    return walk(schema);
  },
};

function walk(node: unknown): boolean {
  if (Array.isArray(node)) {
    let changed = false;
    for (const item of node) if (walk(item)) changed = true;
    return changed;
  }
  if (node !== null && typeof node === 'object') {
    const obj = node as Record<string, unknown>;
    let changed = false;
    if (Array.isArray(obj['oneOf']) && 'x-control-value-type' in obj) {
      if (insertSerializationOptions(obj, ['Compression'])) changed = true;
    }
    for (const key of Object.keys(obj)) {
      if (walk(obj[key])) changed = true;
    }
    return changed;
  }
  return false;
}

export const rules: Rule[] = [compressVariantControlValues];
