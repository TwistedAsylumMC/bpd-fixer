import type { Override } from '../types.js';

const override: Override = {
  reason: 'Score Info is required on the wire but the schema marks it optional.',
  required: {
    'Score Info': true,
  },
};

export default override;
