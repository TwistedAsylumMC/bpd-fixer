/**
 * Numeric wire values for the enums whose members are not a plain 0..n-1 run.
 *
 * Mojang publishes enums as bare draft-07 string lists, so the only value a
 * consumer can infer is the member's index. That is wrong wherever the real C++
 * enum has gaps, sentinels (`Unknown = -1`), aliases, or values far outside the
 * ordinal range. For those enums we emit an `x-enum-values` array positionally
 * aligned with `enum`, so index-based consumers see an unchanged member list and
 * value-aware ones get the truth.
 *
 * Enums that only needed missing members inserted (or reordering) are fixed in
 * their own override file instead and carry no `x-enum-values`.
 */

export interface EnumValueSpec {
  /** Why this override exists, shown in the run report. */
  reason: string;
  /**
   * Replacement member list, only where upstream omits members. When absent the
   * upstream list is kept and must already match `values` in length and order.
   */
  enum?: string[];
  /** Wire value of each member, positionally aligned with the member list. */
  values: number[];
}

export const enumValues: Record<string, EnumValueSpec> = {
  'ActorEvent.json': {
    reason:
      'Values are gapped (no 9, nothing between 39 and 57, no 75); 52 of 61 members are misnumbered by ordinal.',
    values: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
      29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 57, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
      74, 76, 77, 78, 79, 80, 81,
    ],
  },
  'ActorType.json': {
    reason:
      'Values are a category bitfield, not ordinals, 1-based and reaching 16777999. Every member is misnumbered by ordinal.',
    values: [
      1, 256, 768, 2816, 4864, 21248, 33024, 68352, 199424, 264960, 524288, 1116928, 2118400, 4194304,
      8388608, 8960, 16777984, 4874, 4875, 4876, 4877, 21262, 16777999, 4880, 8977, 4882, 33043, 788, 789,
      21270, 2118423, 4892, 4893, 21278, 8991, 2118424, 2118425, 2183962, 2183963, 199456, 2849, 1116962,
      264995, 68388, 2853, 2854, 264999, 265000, 2857, 2858, 2859, 199468, 2861, 1116974, 199471, 1116976,
      2865, 2866, 307, 68404, 2869, 2870, 265015, 312, 2873, 68410, 2875, 317, 318, 319, 64, 65, 66, 67,
      4194372, 69, 70, 71, 72, 12582985, 4938, 21323, 4194380, 77, 78, 4194383, 12582992, 4194385, 4194386,
      83, 4194389, 4194390, 4194391, 88, 4194393, 90, 4194395, 93, 4194398, 95, 4194405, 4194406, 4194407,
      2920, 2921, 524372, 524384, 524385, 524386, 524387, 524388, 4194410, 107, 9068, 9069, 199534, 9071,
      9072, 4977, 2930, 16778099, 199540, 117, 886, 119, 2936, 4985, 378, 379, 4988, 4989, 68478, 383, 4992,
      9089, 4994, 2947, 4996, 9093, 390, 218, 5021, 5002, 5003, 2956, 4194445, 5006, 4194447, 1117072, 145,
      2962, 5011, 916, 9109, 74646, 1117079, 70552, 921, 154,
    ],
  },
  'AgentActionType.json': {
    reason:
      'Values are 1-based, so every member is off by one by ordinal.',
    values: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    ],
  },
  'AnimatePacketPayload_Action.json': {
    reason:
      'Value 2 is retired: Swing is 1 and WakeUp is 3, not 2.',
    values: [
      0, 1, 3, 4, 5,
    ],
  },
  'AttributeModifierOperation.json': {
    reason:
      'TOTAL_OPERATIONS and OPERATION_INVALID are both 4, so OPERATION_INVALID is not 5.',
    values: [
      0, 1, 2, 3, 4, 4,
    ],
  },
  'AttributeOperands.json': {
    reason:
      'TOTAL_OPERANDS and OPERAND_INVALID are both 3, so OPERAND_INVALID is not 4.',
    values: [
      0, 1, 2, 3, 3,
    ],
  },
  'BuildPlatform.json': {
    reason:
      'Values are 1-based with gaps and a trailing Unknown = -1, and GearVR (5), UWP (7), tvOS (10) and WindowsPhone (14) are missing upstream.',
    enum: [
      'Google', 'iOS', 'OSX', 'Amazon', 'GearVR', 'UWP', 'Win32', 'Dedicated', 'tvOS', 'Sony', 'Nx', 'Xbox',
      'WindowsPhone', 'Linux', 'Unknown',
    ],
    values: [
      1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, -1,
    ],
  },
  'ContainerID.json': {
    reason:
      'Values are sentinels and slot ranges (-1, 0, 1, 100, 119-125), not ordinals.',
    values: [
      -1, 0, 1, 100, 119, 120, 122, 124, 125,
    ],
  },
  'ContainerType.json': {
    reason:
      'NONE is -9 and INVENTORY is -1, so every member is misnumbered by ordinal.',
    values: [
      -9, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
      26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
    ],
  },
  'CurrentCmdVersion.json': {
    reason:
      'Invalid is -1, two pairs of members share values 34 and 35, and Count (51) is listed before Latest (50).',
    values: [
      -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
      28, 29, 30, 31, 32, 33, 34, 34, 35, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 51, 50,
    ],
  },
  'ExpressionOp.json': {
    reason:
      'Unknown is -1, so all 110 members are off by one by ordinal.',
    values: [
      -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
      53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
      79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
      104, 105, 106, 107, 108,
    ],
  },
  'GameType.json': {
    reason:
      'Undefined is -1, values 3-4 are retired, and WorldDefault is an alias of Survival (0).',
    values: [
      -1, 0, 1, 2, 5, 6, 0,
    ],
  },
  'InteractPacketPayload_Action.json': {
    reason:
      'Values 1 and 2 are retired: StopRiding is 3, not 1.',
    values: [
      0, 3, 4, 5, 6,
    ],
  },
  'InventorySourceType.json': {
    reason:
      'Non Implemented Feature TODO is 99999, not 4.',
    values: [
      0, 1, 2, 3, 99999,
    ],
  },
  'LevelSoundEvent.json': {
    reason:
      'Members are listed in declaration order across 570 non-sequential values; 567 are misnumbered by ordinal.',
    values: [
      0, 1, 2, 221, 3, 4, 287, 5, 6, 7, 8, 9, 17, 219, 18, 14, 220, 15, 16, 10, 11, 12, 492, 242, 288, 13,
      19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 294, 432, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
      42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 223, 54, 55, 56, 57, 58, 59, 60, 61, 211, 62, 63, 64,
      65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 229,
      230, 231, 232, 233, 234, 235, 236, 237, 216, 214, 217, 215, 218, 89, 90, 92, 91, 93, 212, 213, 94, 95,
      100, 96, 97, 98, 99, 317, 101, 102, 103, 104, 527, 528, 105, 106, 107, 108, 109, 110, 111, 112, 113,
      314, 529, 469, 371, 439, 555, 562, 114, 115, 118, 119, 120, 116, 117, 121, 122, 123, 124, 430, 431,
      125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 137, 136, 138, 139, 140, 141, 142, 143, 144,
      145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165,
      166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 190, 210, 178, 185, 179, 180, 181, 182, 183,
      184, 187, 188, 189, 191, 192, 193, 194, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 224,
      225, 226, 228, 466, 467, 433, 435, 238, 240, 241, 243, 252, 253, 254, 244, 239, 245, 246, 247, 248,
      249, 250, 251, 255, 177, 256, 257, 258, 259, 262, 263, 265, 264, 266, 267, 268, 269, 260, 261, 270,
      271, 272, 276, 275, 277, 278, 279, 280, 273, 274, 281, 282, 283, 284, 285, 286, 290, 291, 293, 292,
      289, 295, 302, 296, 297, 299, 300, 301, 298, 312, 313, 308, 309, 310, 311, 307, 303, 304, 305, 327,
      323, 324, 325, 326, 322, 318, 319, 320, 321, 315, 306, 328, 329, 316, 186, 227, 434, 330, 331, 332,
      333, 337, 338, 334, 336, 335, 339, 340, 341, 345, 346, 347, 342, 343, 344, 348, 349, 350, 351, 352,
      353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 375, 376,
      372, 428, 429, 438, 373, 374, 377, 383, 384, 385, 386, 387, 388, 389, 390, 426, 427, 436, 437, 440,
      379, 380, 381, 382, 442, 445, 446, 533, 447, 443, 444, 448, 449, 450, 451, 452, 453, 454, 455, 456,
      457, 458, 459, 460, 461, 464, 465, 462, 463, 468, 470, 471, 472, 473, 474, 475, 476, 477, 478, 481,
      482, 479, 480, 483, 490, 491, 493, 494, 484, 486, 488, 487, 485, 489, 495, 496, 497, 498, 499, 500,
      501, 502, 503, 504, 505, 506, 507, 508, 509, 512, 511, 513, 514, 515, 520, 516, 517, 523, 524, 525,
      518, 519, 521, 526, 510, 530, 531, 534, 532, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546,
      547, 548, 549, 550, 551, 552, 553, 554, 556, 557, 558, 559, 560, 561, 563, 564, 565, 566, 567, 568,
      569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588,
      589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608,
      609, 610, 611, 612, 613, 614,
    ],
  },
  'MinecraftEventing__AchievementIds.json': {
    reason:
      'Values start at 7 and are heavily gapped; every member is misnumbered by ordinal.',
    values: [
      7, 10, 20, 21, 29, 30, 37, 38, 39, 40, 50, 52, 53, 54, 56, 58, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
      71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
      97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117,
      118, 119, 120, 121, 122, 123, 124, 125, 126,
    ],
  },
  'MinecraftEventing__InteractionType.json': {
    reason:
      'Values are 1-based, so every member is off by one by ordinal.',
    values: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
    ],
  },
  'MinecraftPacketIds.json': {
    reason:
      'Nineteen packet ids are missing upstream (PassengerJump 20, TickSync 23, AdventureSettings 55, PhotoInfoRequest 173, SetMovementAuthorityMode 319 among them), and the remaining ids are gapped rather than sequential.',
    enum: [
      'KeepAlive', 'Login', 'PlayStatus', 'ServerToClientHandshake', 'ClientToServerHandshake', 'Disconnect',
      'ResourcePacksInfo', 'ResourcePackStack', 'ResourcePackClientResponse', 'Text', 'SetTime', 'StartGame',
      'AddPlayer', 'AddActor', 'RemoveActor', 'AddItemActor', 'ServerPlayerPostMovePosition',
      'TakeItemActor', 'MoveAbsoluteActor', 'MovePlayer', 'PassengerJump', 'UpdateBlock', 'AddPainting',
      'TickSync', 'LevelSoundEventV1', 'LevelEvent', 'TileEvent', 'ActorEvent', 'MobEffect',
      'UpdateAttributes', 'InventoryTransaction', 'PlayerEquipment', 'MobArmorEquipment', 'Interact',
      'BlockPickRequest', 'ActorPickRequest', 'PlayerAction', 'ActorFall', 'HurtArmor', 'SetActorData',
      'SetActorMotion', 'SetActorLink', 'SetHealth', 'SetSpawnPosition', 'Animate', 'Respawn',
      'ContainerOpen', 'ContainerClose', 'PlayerHotbar', 'InventoryContent', 'InventorySlot',
      'ContainerSetData', 'CraftingData', 'CraftingEvent', 'GuiDataPickItem', 'AdventureSettings',
      'BlockActorData', 'PlayerInput', 'FullChunkData', 'SetCommandsEnabled', 'SetDifficulty',
      'ChangeDimension', 'SetPlayerGameType', 'PlayerList', 'SimpleEvent', 'LegacyTelemetryEvent',
      'SpawnExperienceOrb', 'MapData', 'MapInfoRequest', 'RequestChunkRadius', 'ChunkRadiusUpdated',
      'ItemFrameDropItem', 'GameRulesChanged', 'Camera', 'BossEvent', 'ShowCredits', 'AvailableCommands',
      'CommandRequest', 'CommandBlockUpdate', 'CommandOutput', 'UpdateTrade', 'UpdateEquip',
      'ResourcePackDataInfo', 'ResourcePackChunkData', 'ResourcePackChunkRequest', 'Transfer', 'PlaySound',
      'StopSound', 'SetTitle', 'AddBehaviorTree', 'StructureBlockUpdate', 'ShowStoreOffer',
      'PurchaseReceipt', 'PlayerSkin', 'SubclientLogin', 'AutomationClientConnect', 'SetLastHurtBy',
      'BookEdit', 'NPCRequest', 'PhotoTransfer', 'ShowModalForm', 'ModalFormResponse',
      'ServerSettingsRequest', 'ServerSettingsResponse', 'ShowProfile', 'SetDefaultGameType',
      'RemoveObjective', 'SetDisplayObjective', 'SetScore', 'LabTable', 'UpdateBlockSynced',
      'MoveDeltaActor', 'SetScoreboardIdentity', 'SetLocalPlayerAsInit', 'UpdateSoftEnum', 'Ping',
      'BlockPalette', 'ScriptCustomEvent', 'SpawnParticleEffect', 'AvailableActorIDList',
      'LevelSoundEventV2', 'NetworkChunkPublisherUpdate', 'BiomeDefinitionList', 'LevelSoundEvent',
      'LevelEventGeneric', 'LecternUpdate', 'VideoStreamConnect', 'AddEntity', 'RemoveEntity',
      'ClientCacheStatus', 'OnScreenTextureAnimation', 'MapCreateLockedCopy',
      'StructureTemplateDataExportRequest', 'StructureTemplateDataExportResponse',
      'ClientCacheBlobStatusPacket', 'ClientCacheMissResponsePacket', 'EducationSettingsPacket', 'Emote',
      'MultiplayerSettingsPacket', 'SettingsCommandPacket', 'AnvilDamage', 'CompletedUsingItem',
      'NetworkSettings', 'PlayerAuthInputPacket', 'CreativeContent', 'PlayerEnchantOptions',
      'ItemStackRequest', 'ItemStackResponse', 'PlayerArmorDamage', 'CodeBuilderPacket',
      'UpdatePlayerGameType', 'EmoteList', 'PositionTrackingDBServerBroadcast',
      'PositionTrackingDBClientRequest', 'DebugInfoPacket', 'PacketViolationWarning',
      'MotionPredictionHints', 'TriggerAnimation', 'CameraShake', 'PlayerFogSetting',
      'CorrectPlayerMovePredictionPacket', 'ItemRegistryPacket', 'FilterTextPacket',
      'ClientBoundDebugRendererPacket', 'SyncActorProperty', 'AddVolumeEntityPacket',
      'RemoveVolumeEntityPacket', 'SimulationTypePacket', 'NpcDialoguePacket', 'EduUriResourcePacket',
      'CreatePhotoPacket', 'UpdateSubChunkBlocks', 'PhotoInfoRequest', 'SubChunkPacket',
      'SubChunkRequestPacket', 'PlayerStartItemCooldown', 'ScriptMessagePacket', 'CodeBuilderSourcePacket',
      'TickingAreasLoadStatus', 'DimensionDataPacket', 'AgentAction', 'ChangeMobProperty',
      'LessonProgressPacket', 'RequestAbilityPacket', 'RequestPermissionsPacket', 'ToastRequest',
      'UpdateAbilitiesPacket', 'UpdateAdventureSettingsPacket', 'DeathInfo', 'EditorNetworkPacket',
      'FeatureRegistryPacket', 'ServerStats', 'RequestNetworkSettings', 'GameTestRequestPacket',
      'GameTestResultsPacket', 'PlayerClientInputPermissions', 'ClientCheatAbilityPacket', 'CameraPresets',
      'UnlockedRecipes', 'TitleSpecificPacketsStart', 'TitleSpecificPacketsEnd', 'CameraInstruction',
      'CompressedBiomeDefinitionList', 'TrimData', 'OpenSign', 'AgentAnimation', 'RefreshEntitlementsPacket',
      'PlayerToggleCrafterSlotRequestPacket', 'SetPlayerInventoryOptions', 'SetHudPacket',
      'AwardAchievementPacket', 'ClientboundCloseScreen', 'ClientboundLoadingScreenPacket',
      'ServerboundLoadingScreenPacket', 'JigsawStructureDataPacket', 'CurrentStructureFeaturePacket',
      'ServerboundDiagnosticsPacket', 'CameraAimAssist', 'ContainerRegistryCleanup', 'MovementEffect',
      'SetMovementAuthorityMode', 'CameraAimAssistActorPriority', 'CameraAimAssistPresets',
      'ClientCameraAimAssist', 'ClientMovementPredictionSyncPacket', 'UpdateClientOptions',
      'PlayerVideoCapturePacket', 'PlayerUpdateEntityOverridesPacket', 'PlayerLocation', 'SyncWorldClocks',
      'SendPartyDestinationCookie', 'PartyDestinationCookieResponse',
    ],
    values: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
      28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
      54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
      80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
      104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
      124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144,
      145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164,
      165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184,
      185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 299, 300, 301, 302,
      303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 339, 320, 321,
      322, 323, 324, 325, 326, 344, 349, 350,
    ],
  },
  'MolangVersion.json': {
    reason:
      'Invalid is -1, and Latest and HardcodedMolang are both 13 while NumValidVersions is 14.',
    values: [
      -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 13, 13,
    ],
  },
  'PacketCompressionAlgorithm.json': {
    reason:
      'None is 65535, not 2.',
    values: [
      0, 1, 65535,
    ],
  },
  'PacketViolationSeverity.json': {
    reason:
      'Unknown is -1, so every member is off by one by ordinal.',
    values: [
      -1, 0, 1, 2,
    ],
  },
  'PacketViolationType.json': {
    reason:
      'Unknown is -1, so PacketMalformed is 0, not 1.',
    values: [
      -1, 0,
    ],
  },
  'PlayerActionType.json': {
    reason:
      'Unknown is -1, and GetUpdatedBlock (3), DropItem (4), ChangeSkin (19), UpdatedEnchantingSeed (20), InteractWithBlock (25) and ClientAckServerData (36) are missing upstream.',
    enum: [
      'Unknown', 'StartDestroyBlock', 'AbortDestroyBlock', 'StopDestroyBlock', 'GetUpdatedBlock', 'DropItem',
      'StartSleeping', 'StopSleeping', 'Respawn', 'StartJump', 'StartSprinting', 'StopSprinting',
      'StartSneaking', 'StopSneaking', 'CreativeDestroyBlock', 'ChangeDimensionAck', 'StartGliding',
      'StopGliding', 'DenyDestroyBlock', 'CrackBlock', 'ChangeSkin', 'UpdatedEnchantingSeed',
      'StartSwimming', 'StopSwimming', 'StartSpinAttack', 'StopSpinAttack', 'InteractWithBlock',
      'PredictDestroyBlock', 'ContinueDestroyBlock', 'StartItemUseOn', 'StopItemUseOn', 'HandledTeleport',
      'MissedSwing', 'StartCrawling', 'StopCrawling', 'StartFlying', 'StopFlying', 'ClientAckServerData',
      'StartUsingItem', 'InternalUpdate', 'Count',
    ],
    values: [
      -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    ],
  },
  'persona__PieceType.json': {
    reason:
      'Values are 1-based, so every member is off by one by ordinal.',
    values: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
    ],
  },
  'ResourcePackResponse.json': {
    reason:
      'Values are 1-based (Cancel is 1); serialized by name on the wire, so this is documentation only.',
    values: [
      1, 2, 3, 4,
    ],
  },
  'Rotation.json': {
    reason:
      'Clockwise90/180 and CounterClockwise90 are aliases of 1, 2 and 3, not distinct values 4-6.',
    values: [
      0, 1, 2, 3, 1, 2, 3,
    ],
  },
  'TextProcessingEventOrigin.json': {
    reason:
      'unknown is -1, so every member is off by one by ordinal.',
    values: [
      -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    ],
  },
};
