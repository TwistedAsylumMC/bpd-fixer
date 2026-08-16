import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { enumValues } from '../src/overrides/enumValues.js';
import { enumValueOverride } from '../src/overrides/enumValueOverride.js';
import { applyOverride } from '../src/overrides/ops.js';
import { resolveOverride } from '../src/overrides/resolve.js';
import { parseSchema } from '../src/util/json.js';

const IN = path.join('vendor', 'bedrock-protocol-docs', 'json');

const upstream = (fileName: string) =>
  parseSchema(fs.readFileSync(path.join(IN, fileName), 'utf8')) as unknown as Record<
    string,
    unknown
  > & { enum?: string[] };

const applied = (fileName: string, schema = upstream(fileName)) => {
  const resolution = resolveOverride(
    enumValues[fileName]!.map(enumValueOverride),
    schema as never,
  );
  if (resolution.kind !== 'apply') return resolution;
  return {
    kind: 'apply' as const,
    schema: applyOverride(schema as never, resolution.override, fileName) as unknown as {
      enum: string[];
      'x-enum-values'?: number[];
    },
  };
};

describe('enumValues', () => {
  for (const [fileName, variants] of Object.entries(enumValues)) {
    describe(fileName, () => {
      it('either applies or declines with a reason, never silently', () => {
        // This suite runs against whatever the submodule points at, and the sync
        // workflow repoints it at each upstream branch in turn. Declining is a
        // legitimate outcome there — `CurrentCmdVersion` has no variant for
        // 2170-2186, and `persona__PieceType` is already correct on 1.26.44 — so
        // this must not demand full coverage.
        //
        // The guarantee for *this* repo's pinned version is `npm run check`: if a
        // fix stopped applying at 2169, output/json would drift from what's
        // committed and that fails. Which is content-exact, where a version-based
        // assertion here could not be: 1.26.44 and 1.26.40 are both 2168 and need
        // different answers.
        const result = applied(fileName);
        expect(['apply', 'skip']).toContain(result.kind);
        if (result.kind === 'skip') expect(result.why.length).toBeGreaterThan(0);
      });

      it('emits a value for every member, or nothing at all', () => {
        const result = applied(fileName);
        if (result.kind !== 'apply') return;
        const { enum: members, 'x-enum-values': values } = result.schema;
        if (values) expect(values.length).toBe(members.length);
      });

      it('never invents a value it does not have', () => {
        for (const v of variants) {
          for (const { name } of v.insert ?? []) {
            expect(v.values, `${fileName} inserts ${name} with no value`).toHaveProperty(name);
          }
        }
      });

      it('keeps every upstream member, in upstream order', () => {
        const before = upstream(fileName).enum!;
        const result = applied(fileName);
        if (result.kind !== 'apply') return;
        // `insert` only ever adds members Mojang omitted, so upstream's list must
        // survive as a subsequence: a reorder or a drop is a mistake.
        let i = 0;
        for (const name of result.schema.enum) if (name === before[i]) i++;
        expect(i, `upstream members missing or reordered in ${fileName}`).toBe(before.length);
      });

      it('is worth overriding at the vendored version', () => {
        const before = upstream(fileName).enum!;
        const result = applied(fileName);
        if (result.kind !== 'apply') return;
        const addedMembers = result.schema.enum.length !== before.length;
        expect(Boolean(result.schema['x-enum-values']) || addedMembers).toBe(true);
      });
    });
  }

  it('skips rather than clobbers when a member has no known value', () => {
    // persona__PieceType on automated/1.26.44: upstream is already complete there,
    // carrying Unknown and Unsupported, which our 2168 dump has no values for.
    // Built explicitly rather than from the submodule: this suite also runs with
    // the submodule pointed at 1.26.44, where upstream already carries both.
    const schema = upstream('persona__PieceType.json');
    const without = schema.enum!.filter((m) => m !== 'Unknown' && m !== 'Unsupported');
    schema.enum = ['Unknown', ...without, 'Unsupported'];

    const result = resolveOverride(
      enumValues['persona__PieceType.json']!.map(enumValueOverride),
      schema as never,
    );
    expect(result.kind).toBe('skip');
    expect(result.kind === 'skip' && result.why).toMatch(/no value known/);
  });

  it('absorbs an upstream rename without touching the other members', () => {
    // Nx -> Nintendo at 2171. Both names live in `values` at the same value, so
    // the member list is left as upstream has it.
    const schema = upstream('BuildPlatform.json');
    schema.enum = schema.enum!.map((m) => (m === 'Nx' ? 'Nintendo' : m));
    schema['x-protocol-version'] = 2187;
    expect(schema.enum).toContain('Nintendo');

    const result = applied('BuildPlatform.json', schema);
    expect(result.kind).toBe('apply');
    if (result.kind !== 'apply') return;
    expect(result.schema.enum).toContain('Nintendo');
    expect(result.schema.enum).not.toContain('Nx');
    expect(result.schema['x-enum-values']![result.schema.enum.indexOf('Nintendo')]).toBe(12);
  });

  it('absorbs members upstream adds, without inventing them on older versions', () => {
    // Both schemas are built explicitly, so this holds whichever branch the
    // submodule points at.
    const added = ['SetPlayerFurnaceOptions', 'RecordStarted'];
    const base = upstream('MinecraftPacketIds.json').enum!.filter((m) => !added.includes(m));

    const newer = upstream('MinecraftPacketIds.json');
    newer.enum = [...base, ...added];
    newer['x-protocol-version'] = 2187;

    const result = applied('MinecraftPacketIds.json', newer);
    expect(result.kind).toBe('apply');
    if (result.kind !== 'apply') return;
    const at = (n: string) => result.schema['x-enum-values']![result.schema.enum.indexOf(n)];
    expect(at('SetPlayerFurnaceOptions')).toBe(351);
    expect(at('RecordStarted')).toBe(352);

    // A schema that doesn't list them is one where those packets don't exist yet,
    // so we must not add them.
    const older = upstream('MinecraftPacketIds.json');
    older.enum = base;
    older['x-protocol-version'] = 2169;
    const old = applied('MinecraftPacketIds.json', older);
    expect(old.kind === 'apply' && old.schema.enum).not.toContain('RecordStarted');
  });

  it('picks values by protocol version where a name is renumbered', () => {
    const variants = enumValues['CurrentCmdVersion.json']!.map(enumValueOverride);
    const at = (version: number) => {
      const schema = upstream('CurrentCmdVersion.json');
      schema['x-protocol-version'] = version;
      const r = resolveOverride(variants, schema as never);
      if (r.kind !== 'apply') return r;
      const out = applyOverride(schema as never, r.override, 'CurrentCmdVersion.json') as unknown as {
        enum: string[];
        'x-enum-values': number[];
      };
      return { kind: 'apply' as const, latest: out['x-enum-values'][out.enum.indexOf('Latest')] };
    };

    expect(at(2169)).toEqual({ kind: 'apply', latest: 50 });
    expect(at(2187)).toEqual({ kind: 'apply', latest: 51 });
    // 2170-2186 is unverified: no Endstone dump sits between r26_u4 and r26_u5,
    // so we decline rather than guess which side of the renumber it falls on.
    expect(at(2177).kind).toBe('skip');
  });
});
