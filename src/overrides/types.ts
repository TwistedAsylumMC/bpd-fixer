import type { AnySchema } from '../schema.js';

export interface OverrideContext {
  fileName: string;
}

/**
 * A declarative correction for a single schema file, plus an imperative escape
 * hatch for the cases the ops can't express. See the README for the op order
 * and semantics.
 *
 * Ops reference pre-rename field names, and every name must exist in the
 * upstream schema; if it doesn't (Mojang renamed or removed it) the op throws,
 * so the drift surfaces loudly instead of silently doing nothing.
 */
export interface Override {
  /** Why this override exists, shown in the run report; keep it specific. */
  reason?: string;

  /**
   * Lowest `x-protocol-version` this fix applies to, inclusive. Omit for "since
   * forever".
   */
  minProtocol?: number;

  /**
   * Highest `x-protocol-version` this fix applies to, inclusive. Omit to leave it
   * open-ended, which is the default: a fix carries forward to new protocol
   * versions and `expect` is what catches it if upstream moves underneath.
   *
   * Set one only when a later version genuinely needs a *different* fix — then
   * register both variants and let the ranges pick.
   */
  maxProtocol?: number;

  /**
   * Precondition on the upstream schema. Return a message to abandon the fix,
   * or nothing to proceed.
   *
   * Version bounds and `expect` catch different things and neither subsumes the
   * other. Bounds catch changes invisible in the schema (an enum's values moving
   * under a stable member list); `expect` catches upstream shapes that a version
   * range can't separate — two branches at the same protocol version, or a newer
   * version reverting to an older shape.
   *
   * Unlike the field ops, a failed `expect` is not an error: the file is passed
   * through untouched and reported. Use it where upstream may legitimately differ
   * per branch, and let the ops throw where a missing field means the override is
   * simply stale.
   */
  expect?: (schema: AnySchema) => string | void;

  /** Shallow-merge keys into the schema root, for files with no `properties`. */
  root?: Record<string, unknown>;

  /** Move fields into (`true`) or out of (`false`) the `required` array. */
  required?: Record<string, boolean>;

  /** Rename a property key, preserving its position and `x-ordinal-index`. */
  rename?: Record<string, string>;

  /** Replace (or add, as the first key) a property's `description`. */
  redescribe?: Record<string, string>;

  /** Shallow-merge arbitrary keys into a property object. */
  patch?: Record<string, Record<string, unknown>>;

  /** Append option string(s) to a field's `x-serialization-options`. */
  serializationOptions?: Record<string, string | string[]>;

  /** Escape hatch; runs last. Mutate in place and/or return a replacement. */
  transform?: (schema: AnySchema, ctx: OverrideContext) => AnySchema | void;
}
