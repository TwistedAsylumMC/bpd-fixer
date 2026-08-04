/**
 * Registry of per-file overrides, keyed by the exact upstream file name.
 *
 * To add a fix: create `schemas/<SchemaFileName>.ts` (copy `_TEMPLATE.ts`) and
 * add one line here. Files without an entry are passed through byte-for-byte.
 */
import type { Override } from './types.js';
import FullContainerName from './schemas/FullContainerName.js';
import ItemStackRequestActionType from './schemas/ItemStackRequestActionType.js';
import ItemStackResponseInfo from './schemas/ItemStackResponseInfo.js';
import ItemStackResponseSlotInfo from './schemas/ItemStackResponseSlotInfo.js';
import PlayerAuthInputPacketPayload from './schemas/PlayerAuthInputPacketPayload.js';
import PlayerListAddEntry from './schemas/PlayerListAddEntry.js';
import PlayerListRemoveEntry from './schemas/PlayerListRemoveEntry.js';
import SetScorePacketPayload from './schemas/SetScorePacketPayload.js';

export const overrides: Record<string, Override> = {
  'FullContainerName.json': FullContainerName,
  'ItemStackRequestActionType.json': ItemStackRequestActionType,
  'ItemStackResponseInfo.json': ItemStackResponseInfo,
  'ItemStackResponseSlotInfo.json': ItemStackResponseSlotInfo,
  'PlayerAuthInputPacketPayload.json': PlayerAuthInputPacketPayload,
  'PlayerListAddEntry.json': PlayerListAddEntry,
  'PlayerListRemoveEntry.json': PlayerListRemoveEntry,
  'SetScorePacketPayload.json': SetScorePacketPayload,
};
