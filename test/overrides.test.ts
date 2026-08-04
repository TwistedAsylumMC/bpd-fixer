import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { overrides } from '../src/overrides/registry.js';

const IN = path.join('vendor', 'bedrock-protocol-docs', 'json');

// Declarative ops are covered against a fixture in ops.test.ts, so a plain
// override needs no test of its own. Write one for a `transform`, or when the
// fix isn't evident from the declaration.
describe('registry', () => {
  it('every registered override targets an existing upstream file', () => {
    for (const fileName of Object.keys(overrides)) {
      expect(fs.existsSync(path.join(IN, fileName)), fileName).toBe(true);
    }
  });
});
