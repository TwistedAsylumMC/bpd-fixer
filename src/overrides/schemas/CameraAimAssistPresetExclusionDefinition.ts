import type { Override } from '../types.js';

const override: Override = {
  reason:
    "All four exclusion lists are always written, empty if unused; the schema declares no required fields at all.",
  required: {
    "blocks": true,
    "entities": true,
    "block_tags": true,
    "entity_type_families": true,
  },
};

export default override;
