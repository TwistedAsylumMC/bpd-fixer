import type { Override } from '../types.js';

const override: Override = {
  reason: "Every arrow field is an optional, matching the rest of the primitive-shape payloads.",
  required: {
    "Arrow End Location": false,
    "Arrow Head Length": false,
    "Arrow Head Radius": false,
    "Num Segments": false,
  },
};

export default override;
