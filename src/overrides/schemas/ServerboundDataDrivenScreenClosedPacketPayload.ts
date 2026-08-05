import type { Override } from '../types.js';

const override: Override = {
  reason: "FormId is always written as a plain uint32, not an optional.",
  required: {
    "FormId": true,
  },
};

export default override;
