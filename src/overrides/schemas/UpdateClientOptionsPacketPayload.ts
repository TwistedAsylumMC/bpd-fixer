import type { Override } from '../types.js';

const override: Override = {
  reason: "Both options are optionals, so the packet reports only the settings that actually changed.",
  required: {
    "Graphics Mode Change": false,
    "Filter Profanity Change": false,
  },
};

export default override;
