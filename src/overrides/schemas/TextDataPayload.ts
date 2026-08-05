import type { Override } from '../types.js';

const override: Override = {
  reason: "Only BackgroundColor is an optional; the four boolean flags are always written.",
  required: {
    "UseRotation": true,
    "DepthTest": true,
    "ShowBackface": true,
    "ShowTextBackface": true,
  },
};

export default override;
