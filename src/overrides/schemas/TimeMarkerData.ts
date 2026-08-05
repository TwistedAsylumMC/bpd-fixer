import type { Override } from '../types.js';

const override: Override = {
  reason: "Period is an optional; a non-repeating time marker omits it.",
  required: {
    "Period": false,
  },
};

export default override;
