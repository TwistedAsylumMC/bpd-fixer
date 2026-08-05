import type { Override } from '../types.js';

const override: Override = {
  reason:
    "Agent Capabilities, Local Settings and External Link Settings are each optionals on the wire.",
  required: {
    "Agent Capabilities": false,
    "Local Settings": false,
    "External Link Settings": false,
  },
};

export default override;
