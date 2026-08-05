/**
 * Registry of per-file overrides, keyed by the exact upstream file name.
 *
 * To add a fix: create `schemas/<SchemaFileName>.ts` (copy `_TEMPLATE.ts`) and
 * add one line here. Files without an entry are passed through byte-for-byte.
 */
import type { Override } from './types.js';
import ArrowDataPayload from './schemas/ArrowDataPayload.js';
import AuthorAndMessage from './schemas/AuthorAndMessage.js';
import AvailableCommandsPacketChainedSubcommandData from './schemas/AvailableCommandsPacketChainedSubcommandData.js';
import Bedrock__Safety__RedactableString from './schemas/Bedrock__Safety__RedactableString.js';
import CameraAimAssistCategoryPriorities from './schemas/CameraAimAssistCategoryPriorities.js';
import CameraAimAssistPresetDefinition from './schemas/CameraAimAssistPresetDefinition.js';
import CameraAimAssistPresetExclusionDefinition from './schemas/CameraAimAssistPresetExclusionDefinition.js';
import CameraInstruction from './schemas/CameraInstruction.js';
import CameraInstruction__FadeInstruction from './schemas/CameraInstruction__FadeInstruction.js';
import CameraInstruction__SetInstruction from './schemas/CameraInstruction__SetInstruction.js';
import CameraInstruction__SplineInstruction from './schemas/CameraInstruction__SplineInstruction.js';
import CameraInstruction__TargetInstruction from './schemas/CameraInstruction__TargetInstruction.js';
import CameraPresets from './schemas/CameraPresets.js';
import CameraSplineDefinition from './schemas/CameraSplineDefinition.js';
import ChangeDimensionPacketPayload from './schemas/ChangeDimensionPacketPayload.js';
import ClientCameraAimAssistPacketPayload from './schemas/ClientCameraAimAssistPacketPayload.js';
import ClientMovementPredictionSyncPacketPayload from './schemas/ClientMovementPredictionSyncPacketPayload.js';
import CommandBlockUpdatePacketPayload from './schemas/CommandBlockUpdatePacketPayload.js';
import CommandOriginData from './schemas/CommandOriginData.js';
import CommandOutput from './schemas/CommandOutput.js';
import CommandOutputMessage from './schemas/CommandOutputMessage.js';
import EducationLevelSettings from './schemas/EducationLevelSettings.js';
import FullContainerName from './schemas/FullContainerName.js';
import GraphicsParameterOverridePacketPayload from './schemas/GraphicsParameterOverridePacketPayload.js';
import InventorySource from './schemas/InventorySource.js';
import InventoryTransaction from './schemas/InventoryTransaction.js';
import InventoryTransactionPacketPayload from './schemas/InventoryTransactionPacketPayload.js';
import ItemStackRequestActionType from './schemas/ItemStackRequestActionType.js';
import ItemStackResponseInfo from './schemas/ItemStackResponseInfo.js';
import ItemStackResponseSlotInfo from './schemas/ItemStackResponseSlotInfo.js';
import LevelSoundEventPacketPayload from './schemas/LevelSoundEventPacketPayload.js';
import MessageAndParams from './schemas/MessageAndParams.js';
import MessageOnly from './schemas/MessageOnly.js';
import ModalFormResponsePacketPayload from './schemas/ModalFormResponsePacketPayload.js';
import PartyChangedPacketPayload from './schemas/PartyChangedPacketPayload.js';
import PlayerAuthInputPacketPayload from './schemas/PlayerAuthInputPacketPayload.js';
import PlayerListAddEntry from './schemas/PlayerListAddEntry.js';
import PlayerListPacketPayload from './schemas/PlayerListPacketPayload.js';
import PlayerListRemoveEntry from './schemas/PlayerListRemoveEntry.js';
import PrimitiveShapeDataPayload from './schemas/PrimitiveShapeDataPayload.js';
import ServerPresenceInfoPacketPayload from './schemas/ServerPresenceInfoPacketPayload.js';
import ServerStoreInfoPacketPayload from './schemas/ServerStoreInfoPacketPayload.js';
import ServerboundDataDrivenScreenClosedPacketPayload from './schemas/ServerboundDataDrivenScreenClosedPacketPayload.js';
import ServerboundLoadingScreenPacketPayload from './schemas/ServerboundLoadingScreenPacketPayload.js';
import SetScorePacketPayload from './schemas/SetScorePacketPayload.js';
import SharedTypes__Comprehensive__CameraAimAssistCommandDefinition from './schemas/SharedTypes__Comprehensive__CameraAimAssistCommandDefinition.js';
import SpawnParticleEffectPacketPayload from './schemas/SpawnParticleEffectPacketPayload.js';
import StructureTemplateDataResponsePacketPayload from './schemas/StructureTemplateDataResponsePacketPayload.js';
import TextDataPayload from './schemas/TextDataPayload.js';
import TextPacketPayload from './schemas/TextPacketPayload.js';
import TimeMarkerData from './schemas/TimeMarkerData.js';
import UpdateClientOptionsPacketPayload from './schemas/UpdateClientOptionsPacketPayload.js';
import gatheringsConfig from './schemas/gatheringsConfig.js';

export const overrides: Record<string, Override> = {
  'ArrowDataPayload.json': ArrowDataPayload,
  'AuthorAndMessage.json': AuthorAndMessage,
  'AvailableCommandsPacketChainedSubcommandData.json': AvailableCommandsPacketChainedSubcommandData,
  'Bedrock__Safety__RedactableString.json': Bedrock__Safety__RedactableString,
  'CameraAimAssistCategoryPriorities.json': CameraAimAssistCategoryPriorities,
  'CameraAimAssistPresetDefinition.json': CameraAimAssistPresetDefinition,
  'CameraAimAssistPresetExclusionDefinition.json': CameraAimAssistPresetExclusionDefinition,
  'CameraInstruction.json': CameraInstruction,
  'CameraInstruction__FadeInstruction.json': CameraInstruction__FadeInstruction,
  'CameraInstruction__SetInstruction.json': CameraInstruction__SetInstruction,
  'CameraInstruction__SplineInstruction.json': CameraInstruction__SplineInstruction,
  'CameraInstruction__TargetInstruction.json': CameraInstruction__TargetInstruction,
  'CameraPresets.json': CameraPresets,
  'CameraSplineDefinition.json': CameraSplineDefinition,
  'ChangeDimensionPacketPayload.json': ChangeDimensionPacketPayload,
  'ClientCameraAimAssistPacketPayload.json': ClientCameraAimAssistPacketPayload,
  'ClientMovementPredictionSyncPacketPayload.json': ClientMovementPredictionSyncPacketPayload,
  'CommandBlockUpdatePacketPayload.json': CommandBlockUpdatePacketPayload,
  'CommandOriginData.json': CommandOriginData,
  'CommandOutput.json': CommandOutput,
  'CommandOutputMessage.json': CommandOutputMessage,
  'EducationLevelSettings.json': EducationLevelSettings,
  'FullContainerName.json': FullContainerName,
  'GraphicsParameterOverridePacketPayload.json': GraphicsParameterOverridePacketPayload,
  'InventorySource.json': InventorySource,
  'InventoryTransaction.json': InventoryTransaction,
  'InventoryTransactionPacketPayload.json': InventoryTransactionPacketPayload,
  'ItemStackRequestActionType.json': ItemStackRequestActionType,
  'ItemStackResponseInfo.json': ItemStackResponseInfo,
  'ItemStackResponseSlotInfo.json': ItemStackResponseSlotInfo,
  'LevelSoundEventPacketPayload.json': LevelSoundEventPacketPayload,
  'MessageAndParams.json': MessageAndParams,
  'MessageOnly.json': MessageOnly,
  'ModalFormResponsePacketPayload.json': ModalFormResponsePacketPayload,
  'PartyChangedPacketPayload.json': PartyChangedPacketPayload,
  'PlayerAuthInputPacketPayload.json': PlayerAuthInputPacketPayload,
  'PlayerListAddEntry.json': PlayerListAddEntry,
  'PlayerListPacketPayload.json': PlayerListPacketPayload,
  'PlayerListRemoveEntry.json': PlayerListRemoveEntry,
  'PrimitiveShapeDataPayload.json': PrimitiveShapeDataPayload,
  'ServerPresenceInfoPacketPayload.json': ServerPresenceInfoPacketPayload,
  'ServerStoreInfoPacketPayload.json': ServerStoreInfoPacketPayload,
  'ServerboundDataDrivenScreenClosedPacketPayload.json': ServerboundDataDrivenScreenClosedPacketPayload,
  'ServerboundLoadingScreenPacketPayload.json': ServerboundLoadingScreenPacketPayload,
  'SetScorePacketPayload.json': SetScorePacketPayload,
  'SharedTypes__Comprehensive__CameraAimAssistCommandDefinition.json': SharedTypes__Comprehensive__CameraAimAssistCommandDefinition,
  'SpawnParticleEffectPacketPayload.json': SpawnParticleEffectPacketPayload,
  'StructureTemplateDataResponsePacketPayload.json': StructureTemplateDataResponsePacketPayload,
  'TextDataPayload.json': TextDataPayload,
  'TextPacketPayload.json': TextPacketPayload,
  'TimeMarkerData.json': TimeMarkerData,
  'UpdateClientOptionsPacketPayload.json': UpdateClientOptionsPacketPayload,
  'gatheringsConfig.json': gatheringsConfig,
};
