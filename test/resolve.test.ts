import { describe, it, expect } from 'vitest';
import { resolveOverride, protocolVersion } from '../src/overrides/resolve.js';
import type { Override } from '../src/overrides/types.js';

const schema = (version?: number) =>
  (version === undefined ? {} : { 'x-protocol-version': version }) as Record<string, unknown>;

const fix = (o: Partial<Override>): Override => ({ reason: 'test', ...o });

describe('resolveOverride', () => {
  it('reads x-protocol-version whether it is a number or a lossless number', () => {
    expect(protocolVersion({ 'x-protocol-version': 2169 })).toBe(2169);
    expect(protocolVersion({ 'x-protocol-version': { toString: () => '2169' } })).toBe(2169);
    expect(protocolVersion({})).toBeUndefined();
  });

  it('applies an unbounded override to any version, including unknown ones', () => {
    const o = fix({});
    const applied = { kind: 'apply', override: o, redundant: [] };
    expect(resolveOverride(o, schema(2168))).toEqual(applied);
    expect(resolveOverride(o, schema(9999))).toEqual(applied);
    expect(resolveOverride(o, schema())).toEqual(applied);
  });

  it('treats both bounds as inclusive', () => {
    const o = fix({ minProtocol: 2168, maxProtocol: 2169 });
    expect(resolveOverride(o, schema(2168)).kind).toBe('apply');
    expect(resolveOverride(o, schema(2169)).kind).toBe('apply');
    expect(resolveOverride(o, schema(2167)).kind).toBe('skip');
    expect(resolveOverride(o, schema(2170)).kind).toBe('skip');
  });

  it('carries an open-ended override forward to newer versions', () => {
    const o = fix({ minProtocol: 2171 });
    expect(resolveOverride(o, schema(2187)).kind).toBe('apply');
    expect(resolveOverride(o, schema(3000)).kind).toBe('apply');
  });

  it('picks the first variant whose range matches', () => {
    const old = fix({ maxProtocol: 2169, reason: 'old' });
    const recent = fix({ minProtocol: 2171, reason: 'new' });
    const r = resolveOverride([old, recent], schema(2187));
    expect(r.kind === 'apply' && r.override.reason).toBe('new');
  });

  it('reports the ranges it has when a version falls in a gap', () => {
    const r = resolveOverride([fix({ maxProtocol: 2169 }), fix({ minProtocol: 2187 })], schema(2177));
    expect(r.kind).toBe('skip');
    expect(r.kind === 'skip' && r.why).toContain('2177');
    expect(r.kind === 'skip' && r.why).toContain('<=2169');
    expect(r.kind === 'skip' && r.why).toContain('>=2187');
  });

  it('will not place a bounded override on a schema with no version', () => {
    expect(resolveOverride(fix({ minProtocol: 2168 }), schema()).kind).toBe('skip');
  });

  it('skips, rather than applies, when expect complains', () => {
    const r = resolveOverride(fix({ expect: () => 'members moved' }), schema(2169));
    expect(r).toEqual({ kind: 'skip', why: 'members moved' });
  });

  it('applies when expect stays silent', () => {
    expect(resolveOverride(fix({ expect: () => undefined }), schema(2169)).kind).toBe('apply');
  });

  it('runs expect only on the variant the version selected', () => {
    const wrongVariant = fix({ maxProtocol: 2169, expect: () => 'should not run' });
    const rightVariant = fix({ minProtocol: 2171 });
    expect(resolveOverride([wrongVariant, rightVariant], schema(2187)).kind).toBe('apply');
  });

  it('treats a missing or empty entry as no override', () => {
    expect(resolveOverride(undefined, schema(2169))).toEqual({ kind: 'none' });
    expect(resolveOverride([], schema(2169))).toEqual({ kind: 'none' });
  });
});
