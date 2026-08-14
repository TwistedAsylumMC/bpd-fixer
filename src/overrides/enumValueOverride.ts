import type { AnySchema } from '../schema.js';
import { OverrideError } from './ops.js';
import type { Override } from './types.js';
import { enumValues, type EnumValueSpec } from './enumValues.js';

/**
 * Build the override for one entry in `enumValues`: replace the member list when
 * the spec carries one, then attach `x-enum-values` positionally aligned with it.
 *
 * The transform is a drift guard rather than a fix. If Mojang adds or removes a
 * member, the two arrays fall out of alignment and every value after that point
 * is silently wrong, so a length or membership mismatch throws, the same
 * fail-loud contract the field ops use.
 */
export function enumValueOverride(fileName: string, spec: EnumValueSpec): Override {
  return {
    reason: spec.reason,
    root: spec.enum
      ? { enum: spec.enum, 'x-enum-values': spec.values }
      : { 'x-enum-values': spec.values },
    transform: (schema: AnySchema) => {
      const members = (schema as { enum?: unknown }).enum;
      if (!Array.isArray(members)) {
        throw new OverrideError(
          `[${fileName}] x-enum-values: schema has no "enum" array; it may no longer be an enum.`,
        );
      }
      if (members.length !== spec.values.length) {
        throw new OverrideError(
          `[${fileName}] x-enum-values: ${members.length} members but ${spec.values.length} values. ` +
            `Upstream changed the member list; re-derive the values from a protocol dump.`,
        );
      }
    },
  };
}

/** Every `x-enum-values` override, keyed by upstream file name. */
export const enumValueOverrides: Record<string, Override> = Object.fromEntries(
  Object.entries(enumValues).map(([file, spec]) => [file, enumValueOverride(file, spec)]),
);
