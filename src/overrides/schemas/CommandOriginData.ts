import type { Override } from '../types.js';

const override: Override = {
  reason: "RequestId and PlayerId are always written, so all four fields are unconditional.",
  required: {
    "RequestId": true,
    "PlayerId": true,
  },
};

export default override;
