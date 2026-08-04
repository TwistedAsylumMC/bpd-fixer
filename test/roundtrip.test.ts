import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parse, stringify } from 'lossless-json';
import { generate } from '../src/pipeline.js';

const IN = path.join('vendor', 'bedrock-protocol-docs', 'json');

describe('serializer round-trip', () => {
  it('lossless-json reproduces every standard 4-space schema byte-for-byte', () => {
    const files = fs
      .readdirSync(IN)
      .filter((f) => f.endsWith('.json') && f !== '__protocoldoc.json');
    const bad: string[] = [];
    for (const f of files) {
      const raw = fs.readFileSync(path.join(IN, f), 'utf8');
      if (stringify(parse(raw), null, 4) !== raw) bad.push(f);
    }
    expect(bad).toEqual([]);
  });
});

describe('pipeline pass-through', () => {
  const results = generate(IN);

  it('emits one result per input file', () => {
    const count = fs.readdirSync(IN).filter((f) => f.endsWith('.json')).length;
    expect(results.length).toBe(count);
  });

  it('files untouched by any override or rule are byte-identical to upstream', () => {
    for (const r of results.filter((x) => !x.overridden && !x.ruled)) {
      const raw = fs.readFileSync(path.join(IN, r.fileName), 'utf8');
      expect(r.content, r.fileName).toBe(raw);
    }
  });

  it('every changed file still parses as valid JSON', () => {
    for (const r of results.filter((x) => x.changed)) {
      expect(() => parse(r.content), r.fileName).not.toThrow();
    }
  });
});
