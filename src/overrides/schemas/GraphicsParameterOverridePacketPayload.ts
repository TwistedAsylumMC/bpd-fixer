import type { Override } from '../types.js';

const override: Override = {
  reason:
    "Float Value and Vec3 Value are optionals; a parameter override carries whichever one matches its type.",
  required: {
    "Float Value": false,
    "Vec3 Value": false,
  },
};

export default override;
