import type { Override } from '../types.js';

const override: Override = {
  reason: "The presence configuration is an optional, so the server can clear it by omitting it.",
  required: {
    "presence_configuration": false,
  },
};

export default override;
