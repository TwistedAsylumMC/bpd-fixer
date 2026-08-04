import type { Override } from '../types.js';
import { DOUBLE_OPTIONAL } from '../quirks.js';

const override: Override = {
  reason:
    'Input Data is optional (marked required); and several optional fields hit the ' +
    'double-write bug (presence header serialized twice).',
  required: {
    'Input Data': false,
  },
  serializationOptions: {
    'Item Use Transaction': DOUBLE_OPTIONAL,
    'Item Stack Request': DOUBLE_OPTIONAL,
    'Player Block Actions': DOUBLE_OPTIONAL,
    'Vehicle Rotation': DOUBLE_OPTIONAL,
    'Client Predicted Vehicle': DOUBLE_OPTIONAL,
  },
};

export default override;
