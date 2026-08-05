import type { Override } from '../types.js';

const override: Override = {
  reason: "Loading Screen Id is an optional (bool + int32) on the wire, not a plain uint32.",
  required: {
    "Loading Screen Id": false,
  },
};

export default override;
