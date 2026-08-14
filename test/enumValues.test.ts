import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { enumValues } from '../src/overrides/enumValues.js';
import { enumValueOverride } from '../src/overrides/enumValueOverride.js';
import { applyOverride } from '../src/overrides/ops.js';
import { parseSchema } from '../src/util/json.js';

const IN = path.join('vendor', 'bedrock-protocol-docs', 'json');

const upstream = (fileName: string) =>
  parseSchema(fs.readFileSync(path.join(IN, fileName), 'utf8')) as unknown as {
    enum?: string[];
  };

describe('enumValues', () => {
  for (const [fileName, spec] of Object.entries(enumValues)) {
    describe(fileName, () => {
      it('produces a member list the same length as its values', () => {
        const members = spec.enum ?? upstream(fileName).enum;
        expect(members).toBeDefined();
        expect(members!.length).toBe(spec.values.length);
      });

      it('keeps every upstream member, in upstream order', () => {
        const before = upstream(fileName).enum!;
        const after = spec.enum ?? before;
        // `enum` only ever inserts members Mojang omitted, so the upstream list
        // must survive as a subsequence, a reorder or a drop is a mistake.
        let i = 0;
        for (const name of after) if (name === before[i]) i++;
        expect(i, `upstream members missing or reordered in ${fileName}`).toBe(before.length);
      });

      it('applies cleanly and attaches x-enum-values', () => {
        const result = applyOverride(
          upstream(fileName) as never,
          enumValueOverride(fileName, spec),
          fileName,
        ) as unknown as { enum: string[]; 'x-enum-values': number[] };

        expect(result['x-enum-values']).toEqual(spec.values);
        expect(result.enum.length).toBe(result['x-enum-values'].length);
      });

      it('is worth overriding, the values are not already the ordinals', () => {
        const isOrdinal = spec.values.every((v, i) => v === i);
        const addsMembers = spec.enum !== undefined;
        expect(isOrdinal && !addsMembers).toBe(false);
      });
    });
  }

  it('throws when upstream changes the member count', () => {
    const [fileName, spec] = Object.entries(enumValues)[0]!;
    const drifted = upstream(fileName) as { enum?: string[] };
    drifted.enum = [...(spec.enum ?? drifted.enum!), 'SomeNewMemberMojangAdded'];

    expect(() =>
      applyOverride(drifted as never, enumValueOverride(fileName, spec), fileName),
    ).toThrow(/x-enum-values/);
  });
});
