import type { Override } from '../types.js';

const override: Override = {
  reason:
    "preset and removeIgnoreStartingValuesComponent are unconditional; the seven fields between them are optionals.",
  required: {
    "ease": false,
    "pos": false,
    "rot": false,
    "facing": false,
    "view_offset": false,
    "entity_offset": false,
    "default": false,
  },
};

export default override;
