import type { Override } from '../types.js';

const override: Override = {
  reason: "Loading Screen Id is an optional (bool + int32), as in ChangeDimensionPacket.",
  required: {
    "Loading Screen Id": false,
  },
};

export default override;
