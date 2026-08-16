import type { AnySchema, ObjectSchema } from '../schema.js';
import type { Override } from './types.js';

/**
 * Guard for an override that replaces a schema's `enum` wholesale.
 *
 * A `root` merge overwrites whatever is there, so a stale list doesn't error —
 * it quietly rewrites correct upstream data. That matters because these
 * overrides are open-ended by default and the sync workflow builds them against
 * every upstream branch, where the member list may legitimately differ.
 *
 * The fix is safe exactly when our list still accounts for everything upstream
 * has, so this checks two things:
 *
 *   - every upstream member appears in the replacement — catches a member Mojang
 *     added, and catches a rename, which looks the same from here and should;
 *   - upstream still has the number of members the fix was written against —
 *     catches a removal, which the first check can't see.
 *
 * On a complaint the file is passed through untouched and reported, rather than
 * being "fixed" against a list it no longer matches.
 */
export function expectEnumMembers(replacement: string[], upstreamCount: number) {
  const known = new Set(replacement);

  return (schema: AnySchema): string | void => {
    const members = (schema as { enum?: unknown }).enum;
    if (!Array.isArray(members) || members.some((m) => typeof m !== 'string')) {
      return 'schema has no string "enum" array; it may no longer be an enum';
    }

    const unknown = (members as string[]).filter((m) => !known.has(m));
    if (unknown.length > 0) {
      const shown = unknown.slice(0, 5).join(', ');
      const more = unknown.length > 5 ? ` (+${unknown.length - 5} more)` : '';
      return `upstream has ${unknown.length} member(s) this fix doesn't know: ${shown}${more}`;
    }

    if (members.length !== upstreamCount) {
      return `upstream has ${members.length} members, but this fix was written against ${upstreamCount}`;
    }
  };
}

/** One declarative op, and whether upstream already looks the way it would leave it. */
interface OpState {
  label: string;
  satisfied: boolean;
}

const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

/**
 * Work out which of an override's declarative ops upstream has already applied.
 *
 * Only the ops whose target state is readable are considered. `redescribe` is
 * prose and `rename` throws in the ops when its source field is gone, so neither
 * says anything useful here; `root` and `transform` are opaque and need a
 * hand-written `expect`.
 */
function opStates(override: Override, schema: AnySchema): OpState[] {
  const obj = schema as ObjectSchema;
  const props = obj.properties ?? {};
  const required = obj.required ?? [];
  const states: OpState[] = [];

  for (const [field, want] of Object.entries(override.required ?? {})) {
    states.push({
      label: `required.${field}=${want}`,
      satisfied: required.includes(field) === want,
    });
  }

  for (const [field, patch] of Object.entries(override.patch ?? {})) {
    const target = props[field];
    for (const [k, v] of Object.entries(patch)) {
      states.push({
        label: `patch.${field}.${k}`,
        satisfied: target !== undefined && same(target[k], v),
      });
    }
  }

  for (const [field, options] of Object.entries(override.serializationOptions ?? {})) {
    const wanted = Array.isArray(options) ? options : [options];
    const current = props[field]?.['x-serialization-options'];
    states.push({
      label: `serializationOptions.${field}`,
      satisfied: Array.isArray(current) && wanted.every((o) => current.includes(o)),
    });
  }

  return states;
}

/**
 * A precondition derived from the override's own ops: upstream must still be in
 * the state the fix was written to correct.
 *
 * This is the field-op counterpart to `expectEnumMembers`, and it is applied
 * automatically to every override rather than hand-written per file — so it can't
 * drift from the ops it guards, and new overrides get it for free.
 *
 * It fires only when *every* readable op is already satisfied, i.e. the override
 * would change nothing. That means Mojang has since published what we were
 * correcting, so the `reason` no longer describes reality and the fix should be
 * re-derived rather than left to apply as a silent no-op. A partially-satisfied
 * override still applies; `redundantOps` reports the dead parts.
 *
 * Note the limit: this cannot tell "Mojang still has the bug" from "Mojang
 * deliberately changed it to this", because those are the same bytes. Only a
 * `maxProtocol` bound separates them.
 */
export function impliedExpect(override: Override) {
  return (schema: AnySchema): string | void => {
    const states = opStates(override, schema);
    if (states.length === 0) return;
    if (states.every((s) => s.satisfied)) {
      return `upstream already matches this fix (${states.map((s) => s.label).join(', ')})`;
    }
  };
}

/** The ops upstream has already applied, for an override that still does something. */
export function redundantOps(override: Override, schema: AnySchema): string[] {
  const states = opStates(override, schema);
  if (states.every((s) => s.satisfied)) return []; // reported as a skip instead
  return states.filter((s) => s.satisfied).map((s) => s.label);
}

/**
 * Guard for a `patch` that overwrites a concrete value: the value being replaced
 * must still be the one the fix diagnosed.
 *
 * The derived guard only knows whether upstream already holds our *target* value.
 * It can't see a change to some third value, which is exactly when overwriting
 * would destroy information — so a patch that replaces a `$ref`, a type or a
 * discriminator says here what it expects to find.
 */
export function expectProperty(field: string, key: string, before: unknown) {
  return (schema: AnySchema): string | void => {
    const target = (schema as ObjectSchema).properties?.[field];
    if (!target) return `"${field}" is gone from properties`;
    const actual = target[key];
    if (same(actual, before)) return;
    if (same(actual, undefined)) return `"${field}".${key} is gone`;
    return (
      `"${field}".${key} is ${JSON.stringify(actual)}, not the ` +
      `${JSON.stringify(before)} this fix was written to replace`
    );
  };
}

/**
 * Guard for a `transform` that adds properties: they must not already exist.
 *
 * Adding a field Mojang has since documented would overwrite their definition of
 * it with ours, silently and with no op to throw — the fix should be retired
 * instead.
 */
export function expectAbsentProperties(...fields: string[]) {
  return (schema: AnySchema): string | void => {
    const props = (schema as ObjectSchema).properties ?? {};
    const present = fields.filter((f) => f in props);
    if (present.length > 0) {
      return `upstream now documents ${present.join(', ')}; this fix would overwrite it`;
    }
  };
}
