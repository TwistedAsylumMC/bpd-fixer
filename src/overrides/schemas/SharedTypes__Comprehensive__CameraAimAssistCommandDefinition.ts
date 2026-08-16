import { expectProperty } from '../expect.js';
import type { Override } from '../types.js';

const override: Override = {
  reason:
    "All four fields are optionals on the wire, and Target Mode is a 4-byte enum value, not a single byte.",
  expect: expectProperty('Target Mode', 'x-underlying-type', 'uint8'),
  patch: {
    'Target Mode': { 'x-underlying-type': 'int32' },
  },
  required: {
    'Preset Id': false,
    'Target Mode': false,
    'View Angle': false,
    Distance: false,
  },
};

export default override;
