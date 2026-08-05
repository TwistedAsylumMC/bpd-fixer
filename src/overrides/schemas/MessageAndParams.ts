import type { Override } from '../types.js';

const override: Override = {
  reason: "Both the message body and the parameter list are always written for this variant.",
  required: {
    "Message": true,
    "Parameter List": true,
  },
};

export default override;
