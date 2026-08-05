import type { Override } from '../types.js';
import { DOUBLE_OPTIONAL } from '../quirks.js';

const override: Override = {
  reason: "Container ID and Bit Flags both hit the double-write bug (presence header serialized twice).",
  serializationOptions: {
    'Container ID': DOUBLE_OPTIONAL,
    'Bit Flags': DOUBLE_OPTIONAL,
  },
};

export default override;
