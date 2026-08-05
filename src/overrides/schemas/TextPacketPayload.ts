import type { Override } from '../types.js';

const override: Override = {
  reason:
    "The XUID and platform id are always written (as empty strings when unset); only Filtered Message is a real optional.",
  required: {
    "Sender's XUID": true,
    "Platform Id": true,
  },
};

export default override;
