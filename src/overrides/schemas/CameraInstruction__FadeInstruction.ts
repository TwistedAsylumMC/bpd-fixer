import type { Override } from '../types.js';

const override: Override = {
  reason: "Both the fade timings and the fade colour are optionals.",
  required: {
    "Time": false,
    "Color": false,
  },
};

export default override;
