import { expectEnumMembers } from '../expect.js';
import type { Override } from '../types.js';

/**
 * Referenced with `Enum-as-Value` from `PlayerAuthInputPacketPayload./Play Mode`,
 * so the ordinal is the wire value. Five VR/AR modes are missing upstream, which
 * puts `ExitLevel` at 3 instead of 7.
 *
 * Values cross-checked against EndstoneMC/protocol-docs @ r26_u4.
 */
const members = [
  'Normal', // 0
  'Teaser', // 1
  'Screen', // 2
  'Viewer', // 3 (missing upstream)
  'Reality', // 4 (missing upstream)
  'Placement', // 5 (missing upstream)
  'LivingRoom', // 6 (missing upstream)
  'ExitLevel', // 7
  'ExitLevelLivingRoom', // 8 (missing upstream)
  'NumModes', // 9
];

const override: Override = {
  reason:
    'Missing Viewer (3), Reality (4), Placement (5), LivingRoom (6) and ExitLevelLivingRoom (8); ExitLevel is 7 and NumModes 9.',
  expect: expectEnumMembers(members, 5),
  root: { enum: members },
};

export default override;
