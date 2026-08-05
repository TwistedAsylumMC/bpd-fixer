import type { Override } from '../types.js';

const override: Override = {
  reason: "Every instruction slot is an optional; a packet carries only the instructions it is issuing.",
  required: {
    "Set": false,
    "Clear": false,
    "Fade": false,
    "Target": false,
    "RemoveTarget": false,
    "FieldOfView": false,
    "Spline": false,
    "AttachToEntity": false,
    "DetachFromEntity": false,
  },
};

export default override;
