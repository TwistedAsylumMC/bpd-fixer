/**
 * Template. Copy to `<SchemaFileName>.ts` (matching the upstream file name
 * without `.json`), delete the ops you don't need, and register it in
 * `../registry.ts`. This file isn't registered, so it never affects output.
 *
 * Ops run in a fixed order and all reference pre-rename field names:
 *   root -> patch -> redescribe -> serializationOptions -> required -> rename -> transform
 */
import type { Override } from '../types.js';
import { DOUBLE_OPTIONAL } from '../quirks.js';

const override: Override = {
  reason: 'One specific sentence on what is wrong upstream and what this fixes.',

  // Shallow-merge keys into the schema root. Use for enum-type files (which have
  // no `properties`), e.g. fixing a top-level x-underlying-type or `enum`.
  root: {
    'x-underlying-type': 'uint32',
  },

  // Correct a wrong required/optional flag. `false` = optional, `true` = required.
  required: {
    'Some Field': false,
  },

  // Rename a field key. Preserves x-ordinal-index and updates `required`.
  rename: {
    'Old Name': 'New Name',
  },

  // Replace/add a field description.
  redescribe: {
    'Some Field': 'A clearer explanation of what this field is.',
  },

  // Shallow-merge arbitrary keys into a property (e.g. fix an x-underlying-type).
  patch: {
    'Some Field': { 'x-underlying-type': 'int32' },
  },

  // Append custom serialization-option string(s) to a field's
  // x-serialization-options array (alongside Mojang's own). Use the documented
  // kinds from ../quirks.js. Pass a single string or an array for several.
  serializationOptions: {
    'Some Field': DOUBLE_OPTIONAL,
  },

  // Escape hatch for anything structural or non-deterministic. Runs last. Full
  // access to the parsed schema. Mutate in place and/or return a replacement.
  transform: (schema, ctx) => {
    void schema;
    void ctx;
  },
};

export default override;
