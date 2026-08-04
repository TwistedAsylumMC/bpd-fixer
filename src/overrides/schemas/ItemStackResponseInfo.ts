import type { Override } from '../types.js';
import { DOUBLE_OPTIONAL } from '../quirks.js';

const override: Override = {
  reason: 'Containers is a double optional (presence header serialized twice).',
  serializationOptions: {
    Containers: DOUBLE_OPTIONAL,
  },
};

export default override;
