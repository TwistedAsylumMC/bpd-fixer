import type { Override } from '../types.js';

const override: Override = {
  reason: "party_info is an optional, so the packet can report leaving a party by omitting it.",
  required: {
    "party_info": false,
  },
};

export default override;
