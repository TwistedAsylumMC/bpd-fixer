import type { Override } from '../types.js';

const override: Override = {
  reason:
    "Fire At Position is an optional, matching ActorEventPacket where it is already documented as one.",
  required: {
    "Fire At Position": false,
  },
};

export default override;
