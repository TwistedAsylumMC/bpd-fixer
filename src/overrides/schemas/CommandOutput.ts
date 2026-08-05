import type { Override } from '../types.js';

const override: Override = {
  reason:
    "The output message list is always written, empty if there is no output; only Data Set is a real optional.",
  required: {
    "Output Messages": true,
  },
};

export default override;
