import type { Override } from '../types.js';

const override: Override = {
  reason:
    "Only Name and Inherit From are unconditional; every other preset field is an optional, so a preset sends just the values it overrides.",
  required: {
    "Pos X": false,
    "Pos Y": false,
    "Pos Z": false,
    "Rot X": false,
    "Rot Y": false,
    "Rotation Speed": false,
    "Snap to Target": false,
    "Horizontal Rotation Limit": false,
    "Vertical Rotation Limit": false,
    "Continue Targeting": false,
    "Block Listening Radius": false,
    "View Offset": false,
    "Entity Offset": false,
    "Radius": false,
    "Yaw Limit Min": false,
    "Yaw Limit Max": false,
    "Listener": false,
    "Player Effects": false,
    "Aim Assist": false,
    "Control Scheme": false,
  },
};

export default override;
