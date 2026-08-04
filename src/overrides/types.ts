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
