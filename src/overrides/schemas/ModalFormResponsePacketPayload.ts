import type { Override } from '../types.js';

const override: Override = {
  reason:
    "Both the response body and the cancel reason are optionals; exactly one is present per packet.",
  required: {
    "JSON Response": false,
    "Form Cancel Reason": false,
  },
};

export default override;
