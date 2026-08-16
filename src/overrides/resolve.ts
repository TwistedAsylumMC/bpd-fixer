import type { AnySchema } from '../schema.js';
import { impliedExpect, redundantOps } from './expect.js';
import type { Override } from './types.js';

/** What `resolveOverride` decided to do with a file. */
export type Resolution =
  | { kind: 'none' }
  | { kind: 'apply'; override: Override; redundant: string[] }
  | { kind: 'skip'; why: string };

/**
 * Read `x-protocol-version` off a schema. Every upstream file carries one; a file
 * without it matches only unbounded overrides, since we can't place it on the
 * timeline.
 */
export function protocolVersion(schema: AnySchema): number | undefined {
  const raw = schema['x-protocol-version'];
  const n = typeof raw === 'number' ? raw : Number(String(raw));
  return Number.isFinite(n) ? n : undefined;
}

const inRange = (v: number | undefined, o: Override): boolean => {
  if (o.minProtocol === undefined && o.maxProtocol === undefined) return true;
  if (v === undefined) return false;
  if (o.minProtocol !== undefined && v < o.minProtocol) return false;
  if (o.maxProtocol !== undefined && v > o.maxProtocol) return false;
  return true;
};

const describeRange = (o: Override): string =>
  o.minProtocol !== undefined && o.maxProtocol !== undefined
    ? `${o.minProtocol}-${o.maxProtocol}`
    : o.minProtocol !== undefined
      ? `>=${o.minProtocol}`
      : o.maxProtocol !== undefined
        ? `<=${o.maxProtocol}`
        : 'any';

/**
 * Pick the variant that applies to this schema, then run its precondition.
 *
 * Variants are tried in registration order and the first whose protocol range
 * matches wins, so order entries most-specific first. A file no variant covers is
 * passed through and reported rather than fixed with values from a version it was
 * never verified against.
 */
export function resolveOverride(
  entry: Override | Override[] | undefined,
  schema: AnySchema,
): Resolution {
  if (!entry) return { kind: 'none' };
  const variants = Array.isArray(entry) ? entry : [entry];
  if (variants.length === 0) return { kind: 'none' };

  const version = protocolVersion(schema);
  const match = variants.find((v) => inRange(version, v));

  if (!match) {
    const ranges = variants.map(describeRange).join(', ');
    return {
      kind: 'skip',
      why: `no variant covers protocol ${version ?? 'unknown'} (have ${ranges})`,
    };
  }

  // The derived guard runs first: it's the one every override gets, and a
  // hand-written `expect` is the narrower, more specific claim on top of it.
  const complaint = impliedExpect(match)(schema) || match.expect?.(schema);
  if (complaint) return { kind: 'skip', why: complaint };

  return { kind: 'apply', override: match, redundant: redundantOps(match, schema) };
}
