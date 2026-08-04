import { parse, stringify } from 'lossless-json';
import type { AnySchema } from '../schema.js';

export function parseSchema(raw: string): AnySchema {
  return parse(raw) as AnySchema;
}

/** Serialize with upstream's formatting: 4-space indent, LF, no trailing newline. */
export function serializeSchema(schema: AnySchema): string {
  const out = stringify(schema, null, 4);
  if (out === undefined) {
    throw new Error('serializeSchema: lossless-json returned undefined');
  }
  return out;
}
