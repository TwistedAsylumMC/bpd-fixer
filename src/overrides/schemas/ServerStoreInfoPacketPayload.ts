import type { Override } from '../types.js';

const override: Override = {
  reason: "The store configuration is an optional, so the server can clear it by omitting it.",
  required: {
    "client_store_entry_point_configuration": false,
  },
};

export default override;
