import type { Override } from '../types.js';

const override: Override = {
  reason: "splineIdentifier and loadFromJson are always written at the end of the instruction.",
  required: {
    "splineIdentifier": true,
    "loadFromJson": true,
  },
};

export default override;
