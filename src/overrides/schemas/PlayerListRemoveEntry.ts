import { expectProperty } from '../expect.js';
import type { Override } from '../types.js';

const override: Override = {
  reason: 'Action is the {0: Add, 1: Remove} discriminator; upstream lists only the single variant value.',
  expect: expectProperty('Action', 'enum', ['Remove']),
  patch: {
    Action: { enum: ['Add', 'Remove'] },
  },
};

export default override;
