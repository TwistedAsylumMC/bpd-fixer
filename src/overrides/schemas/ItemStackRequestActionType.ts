import { expectEnumMembers } from '../expect.js';
import type { Override } from '../types.js';

const members = [
  'Take', // 0
  'Place', // 1
  'Swap', // 2
  'Drop', // 3
  'Destroy', // 4
  'Consume', // 5
  'Create', // 6
  'PlaceInItemContainer', // 7 (deprecated, still serialized)
  'TakeFromItemContainer', // 8 (deprecated, still serialized)
  'ScreenLabTableCombine', // 9
  'ScreenBeaconPayment', // 10
  'ScreenHUDMineBlock', // 11
  'CraftRecipe', // 12
  'CraftRecipeAuto', // 13
  'CraftCreative', // 14
  'CraftRecipeOptional', // 15
  'CraftRepairAndDisenchant', // 16
  'CraftLoom', // 17
  'CraftNonImplemented', // 18
  'CraftResults', // 19
];

const override: Override = {
  reason:
    'Enum must keep removed legacy types PlaceInItemContainer=7 and TakeFromItemContainer=8.',
  expect: expectEnumMembers(members, 18),
  root: { enum: members },
};

export default override;
