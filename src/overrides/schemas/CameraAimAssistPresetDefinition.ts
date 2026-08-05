import type { Override } from '../types.js';

const override: Override = {
  reason:
    "The exclusion settings, liquid-targeting list and item settings are always written, empty if unused; only default_item_settings and hand_settings are real optionals.",
  required: {
    "exclusion_settings": true,
    "liquid_targeting_list": true,
    "item_settings": true,
  },
};

export default override;
