import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parseSchema } from '../src/util/json.js';
import { rules } from '../src/rules.js';

const IN = path.join('vendor', 'bedrock-protocol-docs', 'json');
const apply = (schema: unknown) => rules.some((r) => r.apply(schema as Record<string, unknown>, 't.json'));

describe('compress-variant-control-values rule', () => {
  it('adds Compression to a top-level oneOf variant, before x-ordinal-index', () => {
    const s = parseSchema(`{
        "type": "object",
        "properties": {
            "Location": {
                "oneOf": [ { "$ref": "./A.json" } ],
                "x-control-value-type": "uint32",
                "x-ordinal-index": 1
            }
        }
    }`) as any;
    expect(apply(s)).toBe(true);
    const loc = s.properties.Location;
    expect(loc['x-serialization-options']).toEqual(['Compression']);
    const keys = Object.keys(loc);
    expect(keys.indexOf('x-serialization-options')).toBe(keys.indexOf('x-ordinal-index') - 1);
  });

  it('adds Compression to a oneOf nested in array items', () => {
    const s = parseSchema(`{
        "type": "object",
        "properties": {
            "List": {
                "type": "array",
                "items": {
                    "oneOf": [ { "$ref": "./A.json" } ],
                    "x-control-value-type": "uint32"
                }
            }
        }
    }`) as any;
    expect(apply(s)).toBe(true);
    expect(s.properties.List.items['x-serialization-options']).toEqual(['Compression']);
  });

  it('does not touch a oneOf without a control value type', () => {
    const s = parseSchema(`{ "oneOf": [ { "$ref": "./A.json" } ] }`) as any;
    expect(apply(s)).toBe(false);
    expect(s['x-serialization-options']).toBeUndefined();
  });

  it('is idempotent (does not duplicate Compression)', () => {
    const s = parseSchema(`{
        "oneOf": [ { "$ref": "./A.json" } ],
        "x-control-value-type": "uint32",
        "x-serialization-options": [ "Compression" ]
    }`) as any;
    expect(apply(s)).toBe(false);
    expect(s['x-serialization-options']).toEqual(['Compression']);
  });

  it('covers every real variant: no upstream oneOf+control-value lacks Compression after rules', () => {
    const files = fs.readdirSync(IN).filter((f) => f.endsWith('.json') && f !== '__protocoldoc.json');
    let variantCount = 0;
    for (const f of files) {
      const schema = parseSchema(fs.readFileSync(path.join(IN, f), 'utf8'));
      rules.forEach((r) => r.apply(schema as Record<string, unknown>, f));
      variantCount += countUncompressedVariants(schema);
    }
    expect(variantCount).toBe(0);
  });
});

function countUncompressedVariants(node: unknown): number {
  if (Array.isArray(node)) return node.reduce((n, x) => n + countUncompressedVariants(x), 0);
  if (node !== null && typeof node === 'object') {
    const obj = node as Record<string, unknown>;
    let n = 0;
    if (Array.isArray(obj['oneOf']) && 'x-control-value-type' in obj) {
      const opts = obj['x-serialization-options'];
      if (!Array.isArray(opts) || !opts.includes('Compression')) n += 1;
    }
    for (const k of Object.keys(obj)) n += countUncompressedVariants(obj[k]);
    return n;
  }
  return 0;
}
