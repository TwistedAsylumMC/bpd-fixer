import type { Override } from '../types.js';

const override: Override = {
  reason:
    "Dimension ID is an optional, while Extra Shape Data is unconditional: its variant tag is always written (0 selects the null variant).",
  required: {
    "Dimension ID": false,
    "Extra Shape Data": true,
  },
};

export default override;
