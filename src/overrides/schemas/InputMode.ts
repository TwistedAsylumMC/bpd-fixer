import type { Override } from '../types.js';

/**
 * Referenced with `Enum-as-Value` from `PlayerAuthInputPacketPayload./Input Mode`,
 * so the ordinal is the wire value. `MotionController` (4) is missing upstream,
 * leaving `Count` at 4 instead of 5.
 *
 * Values cross-checked against EndstoneMC/protocol-docs @ r26_u4.
 */
const override: Override = {
  reason: 'Missing MotionController (4); Count is 5, not 4.',
  root: {
    enum: [
      'Undefined', // 0
      'Mouse', // 1
      'Touch', // 2
      'GamePad', // 3
      'MotionController', // 4 (missing upstream)
      'Count', // 5
    ],
  },
};

export default override;
