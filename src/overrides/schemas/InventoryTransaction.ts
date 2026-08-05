import type { Override } from '../types.js';
import { ALWAYS_SET_OPTIONAL } from '../quirks.js';

const override: Override = {
  reason:
    "Actions is framed as an optional whose presence header is always set; a false header is a malformed packet.",
  serializationOptions: {
    Actions: ALWAYS_SET_OPTIONAL,
  },
};

export default override;
