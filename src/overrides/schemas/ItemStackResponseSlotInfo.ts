import type { Override } from '../types.js';
import { DOUBLE_OPTIONAL } from '../quirks.js';

const override: Override = {
  reason: 'Item Stack Net Id is a double optional (presence header serialized twice).',
  serializationOptions: {
    'Item Stack Net Id': DOUBLE_OPTIONAL,
  },
};

export default override;
