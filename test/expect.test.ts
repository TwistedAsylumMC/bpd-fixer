import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  expectAbsentProperties,
  expectEnumMembers,
  expectProperty,
  impliedExpect,
  redundantOps,
} from '../src/overrides/expect.js';
import { overrides } from '../src/overrides/registry.js';
import { resolveOverride } from '../src/overrides/resolve.js';
import { parseSchema } from '../src/util/json.js';

const IN = path.join('vendor', 'bedrock-protocol-docs', 'json');

/** The overrides that replace a schema's `enum` wholesale via `root`. */
const WHOLESALE = [
  'PlayerAuthInputData.json',
  'ClientPlayMode.json',
  'InputMode.json',
  'ContainerEnumName.json',
  'ItemStackRequestActionType.json',
];

describe('expectEnumMembers', () => {
  const guard = expectEnumMembers(['A', 'B', 'C'], 2);

  it('passes when upstream is a known subset of the expected size', () => {
    expect(guard({ enum: ['A', 'C'] })).toBeUndefined();
  });

  it('catches a member the fix has never heard of', () => {
    expect(guard({ enum: ['A', 'D'] })).toMatch(/doesn't know: D/);
  });

  it('reads a rename as an unknown member, which is the safe reading', () => {
    // Nx -> Nintendo: indistinguishable from a replacement without a human, so
    // the fix declines rather than guessing they're the same member.
    expect(expectEnumMembers(['Nx', 'Win32'], 2)({ enum: ['Nintendo', 'Win32'] })).toMatch(
      /doesn't know: Nintendo/,
    );
  });

  it('catches a removal, which the membership check alone cannot see', () => {
    expect(guard({ enum: ['A'] })).toMatch(/upstream has 1 members.*written against 2/);
  });

  it('catches a schema that is no longer an enum', () => {
    expect(guard({ type: 'object' })).toMatch(/no string "enum" array/);
    expect(guard({ enum: [1, 2] })).toMatch(/no string "enum" array/);
  });
});

describe('wholesale enum overrides', () => {
  it.each(WHOLESALE)('%s is guarded, so it cannot silently clobber upstream', (fileName) => {
    const entry = overrides[fileName];
    const variants = Array.isArray(entry) ? entry : [entry!];
    for (const v of variants) expect(v.expect, `${fileName} has no expect guard`).toBeDefined();
  });

  it.each(WHOLESALE)('%s still applies to the vendored schemas', (fileName) => {
    const schema = parseSchema(fs.readFileSync(path.join(IN, fileName), 'utf8'));
    expect(resolveOverride(overrides[fileName], schema as never).kind).toBe('apply');
  });

  it.each(WHOLESALE)('%s declines when upstream grows a member', (fileName) => {
    const schema = parseSchema(fs.readFileSync(path.join(IN, fileName), 'utf8')) as unknown as {
      enum: string[];
    };
    schema.enum = [...schema.enum, 'SomeNewMemberMojangAdded'];

    const result = resolveOverride(overrides[fileName], schema as never);
    expect(result.kind).toBe('skip');
    expect(result.kind === 'skip' && result.why).toMatch(/SomeNewMemberMojangAdded/);
  });
});

describe('impliedExpect', () => {
  const schema = () => ({
    properties: {
      A: { 'x-serialization-options': ['Compression'] },
      B: { 'x-underlying-type': 'uint8' },
    },
    required: ['A'],
  });

  it('passes while upstream still has the bug being corrected', () => {
    expect(impliedExpect({ required: { A: false } })(schema())).toBeUndefined();
    expect(impliedExpect({ required: { B: true } })(schema())).toBeUndefined();
  });

  it('declines once upstream has published the whole fix itself', () => {
    // A is already required, B already absent from required: nothing left to do,
    // so the reason no longer describes reality.
    expect(impliedExpect({ required: { A: true, B: false } })(schema())).toMatch(
      /already matches this fix/,
    );
  });

  it('still applies when only part of the fix has landed upstream', () => {
    const o = { required: { A: true, B: true } };
    expect(impliedExpect(o)(schema())).toBeUndefined();
    expect(redundantOps(o, schema())).toEqual(['required.A=true']);
  });

  it('reads patch and serializationOptions too', () => {
    expect(impliedExpect({ patch: { B: { 'x-underlying-type': 'uint8' } } })(schema())).toMatch(
      /already matches/,
    );
    expect(
      impliedExpect({ patch: { B: { 'x-underlying-type': 'int32' } } })(schema()),
    ).toBeUndefined();
    expect(impliedExpect({ serializationOptions: { A: 'Compression' } })(schema())).toMatch(
      /already matches/,
    );
  });

  it('says nothing about overrides it cannot read', () => {
    expect(impliedExpect({ redescribe: { A: 'clearer' } })(schema())).toBeUndefined();
    expect(impliedExpect({ transform: () => undefined })(schema())).toBeUndefined();
  });
});

describe('expectProperty', () => {
  const schema = () => ({ properties: { Target: { 'x-control-value-type': 'uint32' } } });

  it('passes while the value being replaced is the diagnosed one', () => {
    expect(expectProperty('Target', 'x-control-value-type', 'uint32')(schema())).toBeUndefined();
  });

  it('declines when upstream moved to a value the fix never saw', () => {
    const drifted = { properties: { Target: { 'x-control-value-type': 'uint16' } } };
    expect(expectProperty('Target', 'x-control-value-type', 'uint32')(drifted)).toMatch(
      /is "uint16", not the "uint32" this fix was written to replace/,
    );
  });

  it('declines when the field or key is gone', () => {
    expect(expectProperty('Gone', 'x', 1)({ properties: {} })).toMatch(/gone from properties/);
    expect(expectProperty('Target', 'other', 1)(schema())).toMatch(/is gone/);
  });
});

describe('expectAbsentProperties', () => {
  it('passes while upstream still omits the fields the fix adds', () => {
    expect(expectAbsentProperties('a', 'b')({ properties: { c: {} } })).toBeUndefined();
  });

  it('declines once upstream documents them, rather than overwriting', () => {
    expect(expectAbsentProperties('a', 'b')({ properties: { a: {} } })).toMatch(
      /upstream now documents a; this fix would overwrite it/,
    );
  });
});

describe('every registered override is guarded', () => {
  it.each(Object.keys(overrides))('%s', (fileName) => {
    const entry = overrides[fileName];
    for (const v of Array.isArray(entry) ? entry : [entry!]) {
      const guarded =
        Boolean(v.expect) || Boolean(v.required ?? v.patch ?? v.serializationOptions);
      expect(guarded, `${fileName} has neither an expect nor a readable op`).toBe(true);
    }
  });
});
