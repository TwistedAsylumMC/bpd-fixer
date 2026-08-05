import type { Override } from '../types.js';

const override: Override = {
  reason:
    "The four priority lists are always written, empty if unused; only entity_default and block_default are real optionals.",
  required: {
    "entities": true,
    "blocks": true,
    "block_tags": true,
    "entity_type_families": true,
  },
};

export default override;
