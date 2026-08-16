import type { AnySchema } from '../schema.js';
import type { Override } from './types.js';
import { enumValues, type EnumValueVariant } from './enumValues.js';

/**
 * The member list this variant produces: upstream's, with any members Mojang
 * omits spliced back in. Returns a complaint string instead when the schema isn't
 * one this variant can speak to.
 */
function memberList(schema: AnySchema, variant: EnumValueVariant): string[] | string {
  const upstream = (schema as { enum?: unknown }).enum;
  if (!Array.isArray(upstream) || upstream.some((m) => typeof m !== 'string')) {
    return 'schema has no string "enum" array; it may no longer be an enum';
  }

  const members = [...(upstream as string[])];
  for (const { name, after } of variant.insert ?? []) {
    if (members.includes(name)) continue; // upstream caught up and now lists it
    if (after === null) {
      members.unshift(name);
      continue;
    }
    const at = members.indexOf(after);
    if (at === -1) {
      return `cannot place missing member "${name}": upstream has no "${after}" to anchor it to`;
    }
    members.splice(at + 1, 0, name);
  }
  return members;
}

/**
 * Build the override for one enum: splice in omitted members, then attach
 * `x-enum-values` positionally aligned with the result.
 *
 * `x-enum-values` is emitted only when it says something — an enum whose values
 * really are its ordinals is left byte-identical to upstream, which is what makes
 * this safe to leave open-ended. Where Mojang publishes a complete, correctly
 * numbered list (as `persona__PieceType` does on `1.26.44`), we add nothing.
 */
export function enumValueOverride(variant: EnumValueVariant): Override {
  return {
    reason: variant.reason,
    minProtocol: variant.minProtocol,
    maxProtocol: variant.maxProtocol,

    expect: (schema) => {
      const members = memberList(schema, variant);
      if (typeof members === 'string') return members;

      const unknown = members.filter((m) => !(m in variant.values));
      if (unknown.length > 0) {
        const shown = unknown.slice(0, 5).join(', ');
        const more = unknown.length > 5 ? ` (+${unknown.length - 5} more)` : '';
        return `no value known for ${unknown.length} member(s): ${shown}${more}`;
      }
    },

    transform: (schema) => {
      const members = memberList(schema, variant);
      if (typeof members === 'string') return; // `expect` already vetoed this

      const values = members.map((m) => variant.values[m]!);
      const target = schema as Record<string, unknown>;
      target.enum = members;
      if (values.every((v, i) => v === i)) delete target['x-enum-values'];
      else target['x-enum-values'] = values;
    },
  };
}

/** Every enum-value override, keyed by upstream file name, variants in order. */
export const enumValueOverrides: Record<string, Override[]> = Object.fromEntries(
  Object.entries(enumValues).map(([file, variants]) => [file, variants.map(enumValueOverride)]),
);
