import type { Override } from '../types.js';

const override: Override = {
  reason:
    "Structure's NBT is preceded by a presence bool and is only written when the response carries a save.",
  required: {
    "Structure's NBT": false,
  },
};

export default override;
