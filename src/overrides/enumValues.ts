/**
 * Numeric wire values for the enums whose members are not a plain 0..n-1 run.
 *
 * Mojang publishes enums as bare draft-07 string lists, so the only value a
 * consumer can infer is the member's index. That is wrong wherever the real C++
 * enum has gaps, sentinels (`Unknown = -1`), aliases, or values far outside the
 * ordinal range. Those files get an `x-enum-values` array positionally aligned
 * with `enum`, so index-based consumers see an unchanged member list and
 * value-aware ones get the truth.
 *
 * `values` is keyed by member *name*, not position, and may be a superset across
 * protocol versions: upstream adding, removing or reordering members is absorbed
 * without a code change. Two things are not absorbed, by design:
 *
 *   - A name whose value *changes* between versions. A single map can't hold both
 *     facts, so the enum is split into version-bounded variants (see
 *     `CurrentCmdVersion`, where `Latest` moves 50 -> 51).
 *   - A name we have no value for. The fix is abandoned for that file and
 *     reported, rather than guessed at.
 *
 * Enums that only needed missing members inserted, or reordering, are fixed in
 * their own override file and carry no `x-enum-values`; see
 * `PlayerAuthInputData`, `ClientPlayMode`, `InputMode`, `ContainerEnumName` and
 * `ItemStackRequestActionType`.
 *
 * Values are cross-checked against EndstoneMC/protocol-docs, which publishes each
 * enum as explicit `{name, value}` pairs: `r26_u4` (1.26.40.31 / 2168) and
 * `r26_u5` (1.26.50.25 / 2187). See DOCS-INCONSISTENCIES.md §10.
 */

/** One version-bounded set of values for a single enum. */
export interface EnumValueVariant {
  /** Why this override exists, shown in the run report. */
  reason: string;
  /** Lowest `x-protocol-version` this applies to, inclusive. */
  minProtocol?: number;
  /** Highest `x-protocol-version` this applies to, inclusive. Omit for open-ended. */
  maxProtocol?: number;
  /**
   * Members Mojang omits from the published list, each placed directly after an
   * existing member (`null` = at the front). Applied in order, so an entry may
   * sit after one inserted before it.
   */
  insert?: { name: string; after: string | null }[];
  /** Wire value per member name. */
  values: Record<string, number>;
}

/** Variants are tried in order; the first whose protocol range matches wins. */
export const enumValues: Record<string, EnumValueVariant[]> = {
  'ActorEvent.json': [
    {
      reason:
        'Values are gapped (no 9, nothing between 39 and 57, no 75), so 52 of 61 members are misnumbered by ordinal.',
      values: {
      NONE: 0, JUMP: 1, HURT: 2, DEATH: 3, START_ATTACKING: 4, STOP_ATTACKING: 5, TAMING_FAILED: 6,
      TAMING_SUCCEEDED: 7, SHAKE_WETNESS: 8, EAT_GRASS: 10, FISHHOOK_BUBBLE: 11, FISHHOOK_FISHPOS: 12,
      FISHHOOK_HOOKTIME: 13, FISHHOOK_TEASE: 14, SQUID_FLEEING: 15, ZOMBIE_CONVERTING: 16,
      PLAY_AMBIENT: 17, SPAWN_ALIVE: 18, START_OFFER_FLOWER: 19, STOP_OFFER_FLOWER: 20, LOVE_HEARTS: 21,
      VILLAGER_ANGRY: 22, VILLAGER_HAPPY: 23, WITCH_HAT_MAGIC: 24, FIREWORKS_EXPLODE: 25,
      IN_LOVE_HEARTS: 26, SILVERFISH_MERGE_ANIM: 27, GUARDIAN_ATTACK_SOUND: 28, DRINK_POTION: 29,
      THROW_POTION: 30, PRIME_TNTCART: 31, PRIME_CREEPER: 32, AIR_SUPPLY: 33,
      DEPRECATED_ADD_PLAYER_LEVELS: 34, GUARDIAN_MINING_FATIGUE: 35, AGENT_SWING_ARM: 36,
      DRAGON_START_DEATH_ANIM: 37, GROUND_DUST: 38, SHAKE: 39, FEED: 57, BABY_AGE: 60, INSTANT_DEATH: 61,
      NOTIFY_TRADE: 62, LEASH_DESTROYED: 63, CARAVAN_UPDATED: 64, TALISMAN_ACTIVATE: 65,
      DEPRECATED_UPDATE_STRUCTURE_FEATURE: 66, PLAYER_SPAWNED_MOB: 67, PUKE: 68, UPDATE_STACK_SIZE: 69,
      START_SWIMMING: 70, BALLOON_POP: 71, TREASURE_HUNT: 72, SUMMON_AGENT: 73, FINISHED_CHARGING_ITEM: 74,
      ACTOR_GROW_UP: 76, VIBRATION_DETECTED: 77, DRINK_MILK: 78, SHAKE_WETNESS_STOP: 79,
      KINETIC_DAMAGE_DEALT: 80, HURT_WITHOUT_RECEIVING_DAMAGE: 81,
      },
    },
  ],
  'ActorType.json': [
    {
      reason:
        'Values are a category bitfield, not ordinals: 1-based and reaching 16777999.',
      values: {
      Undefined: 1, Mob: 256, PathfinderMob: 768, Monster: 2816, Animal: 4864, TamableAnimal: 21248,
      Ambient: 33024, UndeadMonster: 68352, ZombieMonster: 199424, Arthropod: 264960, Minecart: 524288,
      SkeletonMonster: 1116928, EquineAnimal: 2118400, Projectile: 4194304, AbstractArrow: 8388608,
      WaterAnimal: 8960, VillagerBase: 16777984, Chicken: 4874, Cow: 4875, Pig: 4876, Sheep: 4877,
      Wolf: 21262, Villager: 16777999, MushroomCow: 4880, Squid: 8977, Rabbit: 4882, Bat: 33043,
      IronGolem: 788, SnowGolem: 789, Ocelot: 21270, Horse: 2118423, PolarBear: 4892, Llama: 4893,
      Parrot: 21278, Dolphin: 8991, Donkey: 2118424, Mule: 2118425, SkeletonHorse: 2183962,
      ZombieHorse: 2183963, Zombie: 199456, Creeper: 2849, Skeleton: 1116962, Spider: 264995,
      PigZombie: 68388, Slime: 2853, EnderMan: 2854, Silverfish: 264999, CaveSpider: 265000, Ghast: 2857,
      LavaSlime: 2858, Blaze: 2859, ZombieVillager: 199468, Witch: 2861, Stray: 1116974, Husk: 199471,
      WitherSkeleton: 1116976, Guardian: 2865, ElderGuardian: 2866, Npc: 307, WitherBoss: 68404,
      Dragon: 2869, Shulker: 2870, Endermite: 265015, Agent: 312, Vindicator: 2873, Phantom: 68410,
      IllagerBeast: 2875, ArmorStand: 317, TripodCamera: 318, Player: 319, ItemEntity: 64, PrimedTnt: 65,
      FallingBlock: 66, MovingBlock: 67, ExperiencePotion: 4194372, Experience: 69, EyeOfEnder: 70,
      EnderCrystal: 71, FireworksRocket: 72, Trident: 12582985, Turtle: 4938, Cat: 21323,
      ShulkerBullet: 4194380, FishingHook: 77, Chalkboard: 78, DragonFireball: 4194383, Arrow: 12582992,
      Snowball: 4194385, ThrownEgg: 4194386, Painting: 83, LargeFireball: 4194389, ThrownPotion: 4194390,
      Enderpearl: 4194391, LeashKnot: 88, WitherSkull: 4194393, BoatRideable: 90,
      WitherSkullDangerous: 4194395, LightningBolt: 93, SmallFireball: 4194398, AreaEffectCloud: 95,
      LingeringPotion: 4194405, LlamaSpit: 4194406, EvocationFang: 4194407, EvocationIllager: 2920,
      Vex: 2921, MinecartRideable: 524372, MinecartHopper: 524384, MinecartTNT: 524385,
      MinecartChest: 524386, MinecartFurnace: 524387, MinecartCommandBlock: 524388, IceBomb: 4194410,
      Balloon: 107, Pufferfish: 9068, Salmon: 9069, Drowned: 199534, Tropicalfish: 9071, Fish: 9072,
      Panda: 4977, Pillager: 2930, VillagerV2: 16778099, ZombieVillagerV2: 199540, Shield: 117,
      WanderingTrader: 886, Lectern: 119, ElderGuardianGhost: 2936, Fox: 4985, Bee: 378, Piglin: 379,
      Hoglin: 4988, Strider: 4989, Zoglin: 68478, PiglinBrute: 383, Goat: 4992, GlowSquid: 9089,
      Axolotl: 4994, Warden: 2947, Frog: 4996, Tadpole: 9093, Allay: 390, ChestBoatRideable: 218,
      TraderLlama: 5021, Camel: 5002, Sniffer: 5003, Breeze: 2956, BreezeWindChargeProjectile: 4194445,
      Armadillo: 5006, WindChargeProjectile: 4194447, Bogged: 1117072, OminousItemSpawner: 145,
      Creaking: 2962, HappyGhast: 5011, CopperGolem: 916, Nautilus: 9109, ZombieNautilus: 74646,
      Parched: 1117079, CamelHusk: 70552, SulfurCube: 921, Cushion: 154,
      },
    },
  ],
  'AgentActionType.json': [
    {
      reason:
        'Values are 1-based, so every member is off by one by ordinal.',
      values: {
      Attack: 1, Collect: 2, Destroy: 3, DetectRedstone: 4, DetectObstacle: 5, Drop: 6, DropAll: 7,
      Inspect: 8, InspectData: 9, InspectItemCount: 10, InspectItemDetail: 11, InspectItemSpace: 12,
      Interact: 13, Move: 14, PlaceBlock: 15, Till: 16, TransferItemTo: 17, Turn: 18,
      },
    },
  ],
  'AnimatePacketPayload_Action.json': [
    {
      reason:
        'Value 2 is retired: Swing is 1 and WakeUp is 3.',
      values: {
      NoAction: 0, Swing: 1, WakeUp: 3, CriticalHit: 4, MagicCriticalHit: 5,
      },
    },
  ],
  'AttributeModifierOperation.json': [
    {
      reason:
        'TOTAL_OPERATIONS and OPERATION_INVALID are both 4, so OPERATION_INVALID is not 5.',
      values: {
      OPERATION_ADDITION: 0, OPERATION_MULTIPLY_BASE: 1, OPERATION_MULTIPLY_TOTAL: 2, OPERATION_CAP: 3,
      TOTAL_OPERATIONS: 4, OPERATION_INVALID: 4,
      },
    },
  ],
  'AttributeOperands.json': [
    {
      reason:
        'TOTAL_OPERANDS and OPERAND_INVALID are both 3, so OPERAND_INVALID is not 4.',
      values: {
      OPERAND_MIN: 0, OPERAND_MAX: 1, OPERAND_CURRENT: 2, TOTAL_OPERANDS: 3, OPERAND_INVALID: 3,
      },
    },
  ],
  'BuildPlatform.json': [
    {
      reason:
        'Values are 1-based with gaps and a trailing Unknown = -1, and four platforms are missing upstream.',
      insert: [
        { name: 'GearVR', after: 'Amazon' },
        { name: 'UWP', after: 'GearVR' },
        { name: 'tvOS', after: 'Dedicated' },
        { name: 'WindowsPhone', after: 'Xbox' },
      ],
      values: {
      Google: 1, iOS: 2, OSX: 3, Amazon: 4, GearVR: 5, UWP: 7, Win32: 8, Dedicated: 9, tvOS: 10, Sony: 11,
      Nx: 12, Xbox: 13, WindowsPhone: 14, Linux: 15, Unknown: -1, Nintendo: 12,
      },
    },
  ],
  'ContainerID.json': [
    {
      reason:
        'Values are sentinels and slot ranges (-1, 0, 1, 100, 119-125), not ordinals.',
      values: {
      CONTAINER_ID_NONE: -1, CONTAINER_ID_INVENTORY: 0, CONTAINER_ID_FIRST: 1, CONTAINER_ID_LAST: 100,
      CONTAINER_ID_OFFHAND: 119, CONTAINER_ID_ARMOR: 120, CONTAINER_ID_SELECTION_SLOTS: 122,
      CONTAINER_ID_PLAYER_ONLY_UI: 124, CONTAINER_ID_REGISTRY: 125,
      },
    },
  ],
  'ContainerType.json': [
    {
      reason:
        'NONE is -9 and INVENTORY is -1, so every member is misnumbered by ordinal.',
      values: {
      NONE: -9, INVENTORY: -1, CONTAINER: 0, WORKBENCH: 1, FURNACE: 2, ENCHANTMENT: 3, BREWING_STAND: 4,
      ANVIL: 5, DISPENSER: 6, DROPPER: 7, HOPPER: 8, CAULDRON: 9, MINECART_CHEST: 10, MINECART_HOPPER: 11,
      HORSE: 12, BEACON: 13, STRUCTURE_EDITOR: 14, TRADE: 15, COMMAND_BLOCK: 16, JUKEBOX: 17, ARMOR: 18,
      HAND: 19, COMPOUND_CREATOR: 20, ELEMENT_CONSTRUCTOR: 21, MATERIAL_REDUCER: 22, LAB_TABLE: 23,
      LOOM: 24, LECTERN: 25, GRINDSTONE: 26, BLAST_FURNACE: 27, SMOKER: 28, STONECUTTER: 29,
      CARTOGRAPHY: 30, HUD: 31, JIGSAW_EDITOR: 32, SMITHING_TABLE: 33, CHEST_BOAT: 34, DECORATED_POT: 35,
      CRAFTER: 36,
      },
    },
  ],
  'ExpressionOp.json': [
    {
      reason:
        'Unknown is -1, so all 110 members are off by one by ordinal.',
      values: {
      Unknown: -1, LeftBrace: 0, RightBrace: 1, LeftBracket: 2, RightBracket: 3, LeftParenthesis: 4,
      RightParenthesis: 5, Negate: 6, LogicalNot: 7, Abs: 8, Add: 9, Acos: 10, Asin: 11, Atan: 12,
      Atan2: 13, Ceil: 14, Clamp: 15, CopySign: 16, Cos: 17, DieRoll: 18, DieRollInt: 19, Div: 20, Exp: 21,
      Floor: 22, HermiteBlend: 23, Lerp: 24, LerpRotate: 25, Ln: 26, Max: 27, Min: 28, MinAngle: 29,
      Mod: 30, Mul: 31, Pow: 32, Random: 33, RandomInt: 34, Round: 35, Sin: 36, Sign: 37, Sqrt: 38,
      Trunc: 39, QueryFunction: 40, ArrayVariable: 41, ContextVariable: 42, EntityVariable: 43,
      TempVariable: 44, MemberAccessor: 45, HashedStringHash: 46, GeometryVariable: 47,
      MaterialVariable: 48, TextureVariable: 49, LessThan: 50, LessEqual: 51, GreaterEqual: 52,
      GreaterThan: 53, LogicalEqual: 54, LogicalNotEqual: 55, LogicalOr: 56, LogicalAnd: 57,
      NullCoalescing: 58, Conditional: 59, ConditionalElse: 60, Float: 61, Pi: 62, Array: 63, Geometry: 64,
      Material: 65, Texture: 66, Loop: 67, ForEach: 68, Break: 69, Continue: 70, Assignment: 71,
      Pointer: 72, Semicolon: 73, Return: 74, Comma: 75, This: 76, Internal_NonEvaluatedArray: 77,
      InverseLerp: 78, EaseInQuad: 79, EaseOutQuad: 80, EaseInOutQuad: 81, EaseInCubic: 82,
      EaseOutCubic: 83, EaseInOutCubic: 84, EaseInQuart: 85, EaseOutQuart: 86, EaseInOutQuart: 87,
      EaseInQuint: 88, EaseOutQuint: 89, EaseInOutQuint: 90, EaseInSine: 91, EaseOutSine: 92,
      EaseInOutSine: 93, EaseInExpo: 94, EaseOutExpo: 95, EaseInOutExpo: 96, EaseInCirc: 97,
      EaseOutCirc: 98, EaseInOutCirc: 99, EaseInBounce: 100, EaseOutBounce: 101, EaseInOutBounce: 102,
      EaseInBack: 103, EaseOutBack: 104, EaseInOutBack: 105, EaseInElastic: 106, EaseOutElastic: 107,
      EaseInOutElastic: 108,
      },
    },
  ],
  'GameType.json': [
    {
      reason:
        'Undefined is -1, values 3-4 are retired, and WorldDefault is an alias of Survival (0).',
      values: {
      Undefined: -1, Survival: 0, Creative: 1, Adventure: 2, Default: 5, Spectator: 6, WorldDefault: 0,
      },
    },
  ],
  'InteractPacketPayload_Action.json': [
    {
      reason:
        'Values 1 and 2 are retired: StopRiding is 3, not 1.',
      values: {
      Invalid: 0, StopRiding: 3, InteractUpdate: 4, NpcOpen: 5, OpenInventory: 6,
      },
    },
  ],
  'InventorySourceType.json': [
    {
      reason:
        'Non Implemented Feature TODO is 99999, not 4.',
      values: {
      'Container Inventory': 0, 'Global Inventory': 1, 'World Interaction': 2, 'Creative Inventory': 3,
      'Non Implemented Feature TODO': 99999,
      },
    },
  ],
  'LevelSoundEvent.json': [
    {
      reason:
        'Members are listed in declaration order across 570 non-sequential values.',
      values: {
      'item.use.on': 0, hit: 1, step: 2, 'step.baby': 221, fly: 3, jump: 4, 'jump.prevent': 287, break: 5,
      place: 6, 'heavy.step': 7, gallop: 8, fall: 9, hurt: 17, 'hurt.baby': 219, 'hurt.in.water': 18,
      death: 14, 'death.baby': 220, 'death.in.water': 15, 'death.to.zombie': 16, ambient: 10,
      'ambient.baby': 11, 'ambient.in.water': 12, 'ambient.in.air': 492, 'ambient.tame': 242,
      'ambient.pollinate': 288, breathe: 13, mad: 19, boost: 20, bow: 21, 'squish.big': 22,
      'squish.small': 23, 'fall.big': 24, 'fall.small': 25, splash: 26, fizz: 27, flap: 28, swim: 29,
      drink: 30, 'drink.honey': 294, 'drink.milk': 432, eat: 31, takeoff: 32, shake: 33, plop: 34,
      land: 35, saddle: 36, armor: 37, 'mob.armor_stand.place': 38, 'add.chest': 39, throw: 40, attack: 41,
      'attack.nodamage': 42, 'attack.strong': 43, warn: 44, shear: 45, milk: 46, thunder: 47, explode: 48,
      fire: 49, ignite: 50, fuse: 51, stare: 52, spawn: 53, born: 223, shoot: 54, 'break.block': 55,
      launch: 56, blast: 57, 'large.blast': 58, twinkle: 59, remedy: 60, unfect: 61,
      convert_to_drowned: 211, levelup: 62, 'bow.hit': 63, 'bullet.hit': 64, 'extinguish.fire': 65,
      'item.fizz': 66, 'chest.open': 67, 'chest.closed': 68, 'shulkerbox.open': 69,
      'shulkerbox.closed': 70, 'enderchest.open': 71, 'enderchest.closed': 72, 'power.on': 73,
      'power.off': 74, attach: 75, detach: 76, deny: 77, tripod: 78, pop: 79, 'drop.slot': 80, note: 81,
      thorns: 82, 'piston.in': 83, 'piston.out': 84, portal: 85, water: 86, 'lava.pop': 87, lava: 88,
      'beacon.activate': 229, 'beacon.ambient': 230, 'beacon.deactivate': 231, 'beacon.power': 232,
      'conduit.activate': 233, 'conduit.ambient': 234, 'conduit.attack': 235, 'conduit.deactivate': 236,
      'conduit.short': 237, 'bubble.pop': 216, 'bubble.up': 214, 'bubble.upinside': 217,
      'bubble.down': 215, 'bubble.downinside': 218, burp: 89, 'bucket.fill.water': 90,
      'bucket.empty.water': 92, 'bucket.fill.lava': 91, 'bucket.empty.lava': 93, 'bucket.fill.fish': 212,
      'bucket.empty.fish': 213, 'armor.equip_chain': 94, 'armor.equip_diamond': 95,
      'armor.equip_elytra': 100, 'armor.equip_generic': 96, 'armor.equip_gold': 97, 'armor.equip_iron': 98,
      'armor.equip_leather': 99, 'armor.equip_netherite': 317, 'record.13': 101, 'record.cat': 102,
      'record.blocks': 103, 'record.chirp': 104, 'record.creator': 527, 'record.creator_music_box': 528,
      'record.far': 105, 'record.mall': 106, 'record.mellohi': 107, 'record.stal': 108,
      'record.strad': 109, 'record.ward': 110, 'record.11': 111, 'record.wait': 112, 'record.null': 113,
      'record.pigstep': 314, 'record.precipice': 529, 'record.relic': 469, 'record.otherside': 371,
      'record.5': 439, 'record.tears': 555, 'record.lava_chicken': 562, flop: 114,
      'elderguardian.curse': 115, teleport: 118, 'shulker.open': 119, 'shulker.close': 120,
      'mob.warning': 116, 'mob.warning.baby': 117, haggle: 121, 'haggle.yes': 122, 'haggle.no': 123,
      'haggle.idle': 124, disappeared: 430, reappeared: 431, chorusgrow: 125, chorusdeath: 126, glass: 127,
      'potion.brewed': 128, 'cast.spell': 129, 'prepare.attack': 130, 'prepare.summon': 131,
      'prepare.wololo': 132, fang: 133, charge: 134, 'camera.take_picture': 135, 'leashknot.break': 137,
      'leashknot.place': 136, growl: 138, whine: 139, pant: 140, purr: 141, purreow: 142,
      'death.min.volume': 143, 'death.mid.volume': 144, 'imitate.blaze': 145, 'imitate.cave_spider': 146,
      'imitate.creeper': 147, 'imitate.elder_guardian': 148, 'imitate.ender_dragon': 149,
      'imitate.enderman': 150, 'imitate.endermite': 151, 'imitate.evocation_illager': 152,
      'imitate.ghast': 153, 'imitate.husk': 154, 'imitate.magma_cube': 156, 'imitate.polar_bear': 157,
      'imitate.shulker': 158, 'imitate.silverfish': 159, 'imitate.skeleton': 160, 'imitate.slime': 161,
      'imitate.spider': 162, 'imitate.stray': 163, 'imitate.vex': 164, 'imitate.vindication_illager': 165,
      'imitate.witch': 166, 'imitate.wither': 167, 'imitate.wither_skeleton': 168, 'imitate.wolf': 169,
      'imitate.zombie': 170, 'imitate.zombie_pigman': 171, 'imitate.zombie_villager': 172,
      'block.end_portal_frame.fill': 173, 'block.end_portal.spawn': 174, 'random.anvil_use': 175,
      'bottle.dragonbreath': 176, balloonpop: 190, 'sparkler.active': 210, 'item.trident.hit': 178,
      'item.trident.hit_ground': 185, 'item.trident.return': 179, 'item.trident.riptide_1': 180,
      'item.trident.riptide_2': 181, 'item.trident.riptide_3': 182, 'item.trident.throw': 183,
      'item.trident.thunder': 184, 'block.fletching_table.use': 187, 'elemconstruct.open': 188,
      'icebomb.hit': 189, 'lt.reaction.icebomb': 191, 'lt.reaction.bleach': 192, 'lt.reaction.epaste': 193,
      'lt.reaction.epaste2': 194, 'lt.reaction.fertilizer': 199, 'lt.reaction.fireball': 200,
      'lt.reaction.mgsalt': 201, 'lt.reaction.miscfire': 202, 'lt.reaction.fire': 203,
      'lt.reaction.miscexplosion': 204, 'lt.reaction.miscmystical': 205, 'lt.reaction.miscmystical2': 206,
      'lt.reaction.product': 207, 'sparkler.use': 208, 'glowstick.use': 209, 'block.turtle_egg.break': 224,
      'block.turtle_egg.crack': 225, 'block.turtle_egg.hatch': 226, 'block.turtle_egg.attack': 228,
      'block.sniffer_egg.crack': 466, 'block.sniffer_egg.hatch': 467, 'block.frog_spawn.hatch': 433,
      'block.frog_spawn.break': 435, swoop: 238, presneeze: 240, sneeze: 241, scared: 243,
      'ambient.aggressive': 252, 'ambient.worried': 253, cant_breed: 254, 'block.scaffolding.climb': 244,
      'block.bamboo_sapling.place': 239, 'crossbow.loading.start': 245, 'crossbow.loading.middle': 246,
      'crossbow.loading.end': 247, 'crossbow.shoot': 248, 'crossbow.quick_charge.start': 249,
      'crossbow.quick_charge.middle': 250, 'crossbow.quick_charge.end': 251, 'item.shield.block': 255,
      'portal.travel': 177, 'item.book.put': 256, 'block.grindstone.use': 257, 'block.bell.hit': 258,
      'block.campfire.crackle': 259, 'block.sweet_berry_bush.hurt': 262,
      'block.sweet_berry_bush.pick': 263, 'block.stonecutter.use': 265, 'block.cartography_table.use': 264,
      'block.composter.empty': 266, 'block.composter.fill': 267, 'block.composter.fill_success': 268,
      'block.composter.ready': 269, roar: 260, stun: 261, 'block.barrel.open': 270,
      'block.barrel.close': 271, 'raid.horn': 272, 'ui.stonecutter.take_result': 276,
      'ui.cartography_table.take_result': 275, 'ui.loom.take_result': 277, 'block.smoker.smoke': 278,
      'block.blastfurnace.fire_crackle': 279, 'block.smithing_table.use': 280, 'block.loom.use': 273,
      'ambient.in.raid': 274, screech: 281, sleep: 282, 'block.furnace.lit': 283, convert_mooshroom: 284,
      milk_suspiciously: 285, celebrate: 286, 'block.beehive.enter': 290, 'block.beehive.exit': 291,
      'block.beehive.shear': 293, 'block.beehive.work': 292, 'block.beehive.drip': 289,
      'ambient.cave': 295, angry: 302, retreat: 296, converted_to_zombified: 297, step_lava: 299,
      tempt: 300, panic: 301, admire: 298, 'particle.soul_escape.quiet': 312,
      'particle.soul_escape.loud': 313, 'respawn_anchor.charge': 308, 'respawn_anchor.deplete': 309,
      'respawn_anchor.set_spawn': 310, 'respawn_anchor.ambient': 311, 'ambient.crimson_forest.mood': 307,
      'ambient.warped_forest.mood': 303, 'ambient.soulsand_valley.mood': 304,
      'ambient.nether_wastes.mood': 305, 'ambient.crimson_forest.additions': 327,
      'ambient.warped_forest.additions': 323, 'ambient.soulsand_valley.additions': 324,
      'ambient.nether_wastes.additions': 325, 'ambient.basalt_deltas.additions': 326,
      'ambient.crimson_forest.loop': 322, 'ambient.warped_forest.loop': 318,
      'ambient.soulsand_valley.loop': 319, 'ambient.nether_wastes.loop': 320,
      'ambient.basalt_deltas.loop': 321, 'lodestone_compass.link_compass_to_lodestone': 315,
      'ambient.basalt_deltas.mood': 306, 'power.on.sculk_sensor': 328, 'power.off.sculk_sensor': 329,
      'smithing_table.use': 316, default: 186, lay_egg: 227, lay_spawn: 434,
      'bucket.fill.powder_snow': 330, 'bucket.empty.powder_snow': 331,
      'cauldron_drip.water.pointed_dripstone': 332, 'cauldron_drip.lava.pointed_dripstone': 333,
      'tilt_down.big_dripleaf': 337, 'tilt_up.big_dripleaf': 338, 'drip.water.pointed_dripstone': 334,
      'pick_berries.cave_vines': 336, 'drip.lava.pointed_dripstone': 335, 'copper.wax.on': 339,
      'copper.wax.off': 340, scrape: 341, 'item.spyglass.use': 345, 'item.spyglass.stop_using': 346,
      'chime.amethyst_block': 347, 'mob.player.hurt_drown': 342, 'mob.player.hurt_on_fire': 343,
      'mob.player.hurt_freeze': 344, 'ambient.screamer': 348, 'hurt.screamer': 349, 'death.screamer': 350,
      'milk.screamer': 351, jump_to_block: 352, pre_ram: 353, 'pre_ram.screamer': 354, ram_impact: 355,
      'ram_impact.screamer': 356, 'squid.ink_squirt': 357, 'glow_squid.ink_squirt': 358,
      convert_to_stray: 359, 'cake.add_candle': 360, 'extinguish.candle': 361, 'ambient.candle': 362,
      'block.click': 363, 'block.click.fail': 364, 'block.sculk_catalyst.bloom': 365,
      'block.sculk_shrieker.shriek': 366, nearby_close: 367, nearby_closer: 368, nearby_closest: 369,
      agitated: 370, listening: 375, heartbeat: 376, tongue: 372, item_given: 428, item_taken: 429,
      item_thrown: 438, 'irongolem.crack': 373, 'irongolem.repair': 374, horn_break: 377, horn_call0: 383,
      horn_call1: 384, horn_call2: 385, horn_call3: 386, horn_call4: 387, horn_call5: 388, horn_call6: 389,
      horn_call7: 390, 'imitate.warden': 426, listening_angry: 427, sonic_boom: 436, sonic_charge: 437,
      convert_to_frog: 440, 'block.sculk.spread': 379, 'charge.sculk': 380,
      'block.sculk_sensor.place': 381, 'block.sculk_shrieker.place': 382,
      'block.enchanting_table.use': 442, 'bundle.drop_contents': 445, 'bundle.insert': 446,
      'bundle.insert_fail': 533, 'bundle.remove_one': 447, step_sand: 443, dash_ready: 444,
      'pressure_plate.click_off': 448, 'pressure_plate.click_on': 449, 'button.click_off': 450,
      'button.click_on': 451, 'door.open': 452, 'door.close': 453, 'trapdoor.open': 454,
      'trapdoor.close': 455, 'fence_gate.open': 456, 'fence_gate.close': 457, insert: 458, pickup: 459,
      insert_enchanted: 460, pickup_enchanted: 461, shatter_pot: 464, break_pot: 465, brush: 462,
      brush_completed: 463, 'block.sign.waxed_interact_fail': 468, 'note.bass': 470, 'pumpkin.carve': 471,
      'mob.husk.convert_to_zombie': 472, 'mob.pig.death': 473, 'mob.hoglin.converted_to_zombified': 474,
      'ambient.underwater.enter': 475, 'ambient.underwater.exit': 476, 'bottle.fill': 477,
      'bottle.empty': 478, 'block.decorated_pot.insert': 481, 'block.decorated_pot.insert_fail': 482,
      'crafter.craft': 479, 'crafter.fail': 480, 'crafter.disable_slot': 483,
      'block.copper_bulb.turn_on': 490, 'block.copper_bulb.turn_off': 491, 'breeze_wind_charge.burst': 493,
      'imitate.breeze': 494, 'trial_spawner.open_shutter': 484, 'trial_spawner.detect_player': 486,
      'trial_spawner.close_shutter': 488, 'trial_spawner.spawn_mob': 487, 'trial_spawner.eject_item': 485,
      'trial_spawner.ambient': 489, 'mob.armadillo.brush': 495, 'mob.armadillo.scute_drop': 496,
      'armor.equip_wolf': 497, 'armor.unequip_wolf': 498, reflect: 499, 'vault.open_shutter': 500,
      'vault.close_shutter': 501, 'vault.eject_item': 502, 'vault.insert_item': 503,
      'vault.insert_item_fail': 504, 'vault.ambient': 505, 'vault.activate': 506, 'vault.deactivate': 507,
      'hurt.reduced': 508, 'wind_charge.burst': 509, 'armor.break_wolf': 512, 'armor.crack_wolf': 511,
      'armor.repair_wolf': 513, 'mace.smash_air': 514, 'mace.smash_ground': 515,
      'mace.heavy_smash_ground': 520, 'trial_spawner.charge_activate': 516,
      'trial_spawner.ambient_ominous': 517, 'apply_effect.bad_omen': 523, 'apply_effect.raid_omen': 524,
      'apply_effect.trial_omen': 525, 'ominous_item_spawner.spawn_item': 518,
      'ominous_bottle.end_use': 519, 'ominous_item_spawner.spawn_item_begin': 521,
      'ominous_item_spawner.about_to_spawn_item': 526, 'imitate.bogged': 510,
      'vault.reject_rewarded_player': 530, 'imitate.drowned': 531, 'sponge.absorb': 534,
      'imitate.creaking': 532, 'block.creaking_heart.trail': 536, creaking_heart_spawn: 537, activate: 538,
      deactivate: 539, freeze: 540, unfreeze: 541, open: 542, open_long: 543, close: 544, close_long: 545,
      'imitate.phantom': 546, 'imitate.zoglin': 547, 'imitate.guardian': 548, 'imitate.ravager': 549,
      'imitate.pillager': 550, place_in_water: 551, state_change: 552, 'imitate.happy_ghast': 553,
      'armor.unequip_generic': 554, 'ambient.weather.the_end_light_flash': 556, 'lead.leash': 557,
      'lead.unleash': 558, 'lead.break': 559, unsaddle: 560, 'armor.equip_copper': 561, place_item: 563,
      single_swap: 564, multi_swap: 565, 'item.enchant.lunge1': 566, 'item.enchant.lunge2': 567,
      'item.enchant.lunge3': 568, 'attack.critical': 569, 'item.spear.attack_hit': 570,
      'item.spear.attack_miss': 571, 'item.wooden_spear.attack_hit': 572,
      'item.wooden_spear.attack_miss': 573, 'imitate.parched': 574, 'imitate.camel_husk': 575,
      'item.spear.use': 576, 'item.wooden_spear.use': 577, saddle_in_water: 578,
      'item.stone_spear.attack_hit': 579, 'item.iron_spear.attack_hit': 580,
      'item.copper_spear.attack_hit': 581, 'item.golden_spear.attack_hit': 582,
      'item.diamond_spear.attack_hit': 583, 'item.netherite_spear.attack_hit': 584,
      'item.stone_spear.attack_miss': 585, 'item.iron_spear.attack_miss': 586,
      'item.copper_spear.attack_miss': 587, 'item.golden_spear.attack_miss': 588,
      'item.diamond_spear.attack_miss': 589, 'item.netherite_spear.attack_miss': 590,
      'item.stone_spear.use': 591, 'item.iron_spear.use': 592, 'item.copper_spear.use': 593,
      'item.golden_spear.use': 594, 'item.diamond_spear.use': 595, 'item.netherite_spear.use': 596,
      pause_growth: 597, reset_growth: 598, pushed_by_player: 599, bounce: 600, slime_landing: 601,
      absorb_block: 602, eject_block: 603, geyser_eruption_start: 604, geyser_eruption_active: 605,
      'record.bounce': 606, 'bucket.fill.land_animal': 607, 'bucket.empty.land_animal': 608,
      geyser_continuous_eruption_start: 609, geyser_continuous_eruption_active: 610, mount: 611,
      dismount: 612, 'straw_bed.break_leave': 613, undefined: 614,
      },
    },
  ],
  'MinecraftEventing__AchievementIds.json': [
    {
      reason:
        'Values start at 7 and are heavily gapped.',
      values: {
      ChestFullOfCobblestone: 7, DiamondForYou: 10, IronBelly: 20, IronMan: 21, OnARail: 29, Overkill: 30,
      ReturnToSender: 37, SniperDuel: 38, StayinFrosty: 39, TakeInventory: 40, MapRoom: 50,
      FreightStation: 52, SmeltEverything: 53, TasteOfYourOwnMedicine: 54, WhenPigsFly: 56, Inception: 58,
      ArtificialSelection: 60, FreeDiver: 61, SpawnTheWither: 62, Beaconator: 63, GreatView: 64,
      SuperSonic: 65, TheEndAgain: 66, TreasureHunter: 67, ShootingStar: 68, FashionShow: 69,
      SelfPublishedAuthor: 71, AlternativeFuel: 72, SleepWithTheFishes: 73, Castaway: 74,
      ImAMarineBiologist: 75, SailThe7Seas: 76, MeGold: 77, Ahoy: 78, Atlantis: 79,
      OnePickleTwoPickleSeaPickleFour: 80, DoaBarrelRoll: 81, Moskstraumen: 82, Echolocation: 83,
      WhereHaveYouBeen: 84, TopOfTheWorld: 85, FruitOnTheLoom: 86, SoundTheAlarm: 87, BuyLowSellHigh: 88,
      Disenchanted: 89, TimeForStew: 90, BeeOurGuest: 91, TotalBeeLocation: 92, StickySituation: 93,
      CoverMeInDebris: 94, FloatYourGoat: 95, Friend: 96, WaxOnWaxOff: 97,
      StriderRiddenInLavaInOverworld: 98, GoatHornAcquired: 99, JukeboxUsedInMeadows: 100,
      TradedAtWorldHeight: 101, SurvivedFallFromWorldHeight: 102, SneakCloseToSculkSensor: 103,
      ItSpreads: 104, BirthdaySong: 105, WithOurPowersCombined: 106, PlantingThePast: 107,
      CarefulRestoration: 108, Revaulting: 109, CraftersCraftingCrafters: 110, WhoNeedsRockets: 111,
      OverOverkill: 112, HeartTransplanter: 113, StayHydrated: 114, MobKabob: 115, AdventuringTime: 116,
      UhOh: 117, GettingWood: 118, BenchMaking: 119, TimeToMine: 120, HotTopic: 121, AcquireHardware: 122,
      GettingAnUpgrade: 123, MonsterHunter: 124, Diamonds: 125, PlethoraOfCats: 126,
      },
    },
  ],
  'MinecraftEventing__InteractionType.json': [
    {
      reason:
        'Values are 1-based, so every member is off by one by ordinal.',
      values: {
      Breeding: 1, Taming: 2, Curing: 3, Crafted: 4, Shearing: 5, Milking: 6, Trading: 7, Feeding: 8,
      Igniting: 9, Coloring: 10, Naming: 11, Leashing: 12, Unleashing: 13, PetSleep: 14, Trusting: 15,
      Commanding: 16, Equipping: 17,
      },
    },
  ],
  'MinecraftPacketIds.json': [
    {
      reason:
        'Ids are gapped rather than sequential, and nineteen packets are missing upstream.',
      insert: [
        { name: 'PassengerJump', after: 'MovePlayer' },
        { name: 'TickSync', after: 'AddPainting' },
        { name: 'LevelSoundEventV1', after: 'TickSync' },
        { name: 'ActorFall', after: 'PlayerAction' },
        { name: 'CraftingEvent', after: 'CraftingData' },
        { name: 'AdventureSettings', after: 'GuiDataPickItem' },
        { name: 'PlayerInput', after: 'BlockActorData' },
        { name: 'ItemFrameDropItem', after: 'ChunkRadiusUpdated' },
        { name: 'BlockPalette', after: 'Ping' },
        { name: 'LevelSoundEventV2', after: 'AvailableActorIDList' },
        { name: 'VideoStreamConnect', after: 'LecternUpdate' },
        { name: 'AddEntity', after: 'VideoStreamConnect' },
        { name: 'RemoveEntity', after: 'AddEntity' },
        { name: 'FilterTextPacket', after: 'ItemRegistryPacket' },
        { name: 'PhotoInfoRequest', after: 'UpdateSubChunkBlocks' },
        { name: 'ClientCheatAbilityPacket', after: 'PlayerClientInputPermissions' },
        { name: 'CompressedBiomeDefinitionList', after: 'CameraInstruction' },
        { name: 'ClientboundLoadingScreenPacket', after: 'ClientboundCloseScreen' },
        { name: 'SetMovementAuthorityMode', after: 'MovementEffect' },
      ],
      values: {
      KeepAlive: 0, Login: 1, PlayStatus: 2, ServerToClientHandshake: 3, ClientToServerHandshake: 4,
      Disconnect: 5, ResourcePacksInfo: 6, ResourcePackStack: 7, ResourcePackClientResponse: 8, Text: 9,
      SetTime: 10, StartGame: 11, AddPlayer: 12, AddActor: 13, RemoveActor: 14, AddItemActor: 15,
      ServerPlayerPostMovePosition: 16, TakeItemActor: 17, MoveAbsoluteActor: 18, MovePlayer: 19,
      PassengerJump: 20, UpdateBlock: 21, AddPainting: 22, TickSync: 23, LevelSoundEventV1: 24,
      LevelEvent: 25, TileEvent: 26, ActorEvent: 27, MobEffect: 28, UpdateAttributes: 29,
      InventoryTransaction: 30, PlayerEquipment: 31, MobArmorEquipment: 32, Interact: 33,
      BlockPickRequest: 34, ActorPickRequest: 35, PlayerAction: 36, ActorFall: 37, HurtArmor: 38,
      SetActorData: 39, SetActorMotion: 40, SetActorLink: 41, SetHealth: 42, SetSpawnPosition: 43,
      Animate: 44, Respawn: 45, ContainerOpen: 46, ContainerClose: 47, PlayerHotbar: 48,
      InventoryContent: 49, InventorySlot: 50, ContainerSetData: 51, CraftingData: 52, CraftingEvent: 53,
      GuiDataPickItem: 54, AdventureSettings: 55, BlockActorData: 56, PlayerInput: 57, FullChunkData: 58,
      SetCommandsEnabled: 59, SetDifficulty: 60, ChangeDimension: 61, SetPlayerGameType: 62,
      PlayerList: 63, SimpleEvent: 64, LegacyTelemetryEvent: 65, SpawnExperienceOrb: 66, MapData: 67,
      MapInfoRequest: 68, RequestChunkRadius: 69, ChunkRadiusUpdated: 70, ItemFrameDropItem: 71,
      GameRulesChanged: 72, Camera: 73, BossEvent: 74, ShowCredits: 75, AvailableCommands: 76,
      CommandRequest: 77, CommandBlockUpdate: 78, CommandOutput: 79, UpdateTrade: 80, UpdateEquip: 81,
      ResourcePackDataInfo: 82, ResourcePackChunkData: 83, ResourcePackChunkRequest: 84, Transfer: 85,
      PlaySound: 86, StopSound: 87, SetTitle: 88, AddBehaviorTree: 89, StructureBlockUpdate: 90,
      ShowStoreOffer: 91, PurchaseReceipt: 92, PlayerSkin: 93, SubclientLogin: 94,
      AutomationClientConnect: 95, SetLastHurtBy: 96, BookEdit: 97, NPCRequest: 98, PhotoTransfer: 99,
      ShowModalForm: 100, ModalFormResponse: 101, ServerSettingsRequest: 102, ServerSettingsResponse: 103,
      ShowProfile: 104, SetDefaultGameType: 105, RemoveObjective: 106, SetDisplayObjective: 107,
      SetScore: 108, LabTable: 109, UpdateBlockSynced: 110, MoveDeltaActor: 111,
      SetScoreboardIdentity: 112, SetLocalPlayerAsInit: 113, UpdateSoftEnum: 114, Ping: 115,
      BlockPalette: 116, ScriptCustomEvent: 117, SpawnParticleEffect: 118, AvailableActorIDList: 119,
      LevelSoundEventV2: 120, NetworkChunkPublisherUpdate: 121, BiomeDefinitionList: 122,
      LevelSoundEvent: 123, LevelEventGeneric: 124, LecternUpdate: 125, VideoStreamConnect: 126,
      AddEntity: 127, RemoveEntity: 128, ClientCacheStatus: 129, OnScreenTextureAnimation: 130,
      MapCreateLockedCopy: 131, StructureTemplateDataExportRequest: 132,
      StructureTemplateDataExportResponse: 133, ClientCacheBlobStatusPacket: 135,
      ClientCacheMissResponsePacket: 136, EducationSettingsPacket: 137, Emote: 138,
      MultiplayerSettingsPacket: 139, SettingsCommandPacket: 140, AnvilDamage: 141,
      CompletedUsingItem: 142, NetworkSettings: 143, PlayerAuthInputPacket: 144, CreativeContent: 145,
      PlayerEnchantOptions: 146, ItemStackRequest: 147, ItemStackResponse: 148, PlayerArmorDamage: 149,
      CodeBuilderPacket: 150, UpdatePlayerGameType: 151, EmoteList: 152,
      PositionTrackingDBServerBroadcast: 153, PositionTrackingDBClientRequest: 154, DebugInfoPacket: 155,
      PacketViolationWarning: 156, MotionPredictionHints: 157, TriggerAnimation: 158, CameraShake: 159,
      PlayerFogSetting: 160, CorrectPlayerMovePredictionPacket: 161, ItemRegistryPacket: 162,
      FilterTextPacket: 163, ClientBoundDebugRendererPacket: 164, SyncActorProperty: 165,
      AddVolumeEntityPacket: 166, RemoveVolumeEntityPacket: 167, SimulationTypePacket: 168,
      NpcDialoguePacket: 169, EduUriResourcePacket: 170, CreatePhotoPacket: 171, UpdateSubChunkBlocks: 172,
      PhotoInfoRequest: 173, SubChunkPacket: 174, SubChunkRequestPacket: 175, PlayerStartItemCooldown: 176,
      ScriptMessagePacket: 177, CodeBuilderSourcePacket: 178, TickingAreasLoadStatus: 179,
      DimensionDataPacket: 180, AgentAction: 181, ChangeMobProperty: 182, LessonProgressPacket: 183,
      RequestAbilityPacket: 184, RequestPermissionsPacket: 185, ToastRequest: 186,
      UpdateAbilitiesPacket: 187, UpdateAdventureSettingsPacket: 188, DeathInfo: 189,
      EditorNetworkPacket: 190, FeatureRegistryPacket: 191, ServerStats: 192, RequestNetworkSettings: 193,
      GameTestRequestPacket: 194, GameTestResultsPacket: 195, PlayerClientInputPermissions: 196,
      ClientCheatAbilityPacket: 197, CameraPresets: 198, UnlockedRecipes: 199,
      TitleSpecificPacketsStart: 200, TitleSpecificPacketsEnd: 299, CameraInstruction: 300,
      CompressedBiomeDefinitionList: 301, TrimData: 302, OpenSign: 303, AgentAnimation: 304,
      RefreshEntitlementsPacket: 305, PlayerToggleCrafterSlotRequestPacket: 306,
      SetPlayerInventoryOptions: 307, SetHudPacket: 308, AwardAchievementPacket: 309,
      ClientboundCloseScreen: 310, ClientboundLoadingScreenPacket: 311,
      ServerboundLoadingScreenPacket: 312, JigsawStructureDataPacket: 313,
      CurrentStructureFeaturePacket: 314, ServerboundDiagnosticsPacket: 315, CameraAimAssist: 316,
      ContainerRegistryCleanup: 317, MovementEffect: 318, SetMovementAuthorityMode: 319,
      CameraAimAssistActorPriority: 339, CameraAimAssistPresets: 320, ClientCameraAimAssist: 321,
      ClientMovementPredictionSyncPacket: 322, UpdateClientOptions: 323, PlayerVideoCapturePacket: 324,
      PlayerUpdateEntityOverridesPacket: 325, PlayerLocation: 326, SyncWorldClocks: 344,
      SendPartyDestinationCookie: 349, PartyDestinationCookieResponse: 350, SetPlayerFurnaceOptions: 351,
      RecordStarted: 352,
      },
    },
  ],
  'MolangVersion.json': [
    {
      reason:
        'Invalid is -1, and Latest and HardcodedMolang are both 13 while NumValidVersions is 14.',
      values: {
      Invalid: -1, BeforeVersioning: 0, Initial: 1, FixedItemRemainingUseDurationQuery: 2,
      ExpressionErrorMessages: 3, UnexpectedOperatorErrors: 4, ConditionalOperatorAssociativity: 5,
      ComparisonAndLogicalOperatorPrecedence: 6, DivideByNegativeValue: 7, FixedCapeFlapAmountQuery: 8,
      QueryBlockPropertyRenamedToState: 9, DeprecateOldBlockQueryNames: 10,
      DeprecatedSnifferAndCamelQueries: 11, LeafSupportingInFirstSolidBlockBelow: 12, NumValidVersions: 14,
      Latest: 13, HardcodedMolang: 13,
      },
    },
  ],
  'PacketCompressionAlgorithm.json': [
    {
      reason:
        'None is 65535, not 2.',
      values: {
      ZLib: 0, Snappy: 1, None: 65535,
      },
    },
  ],
  'PacketViolationSeverity.json': [
    {
      reason:
        'Unknown is -1, so every member is off by one by ordinal.',
      values: {
      Unknown: -1, Warning: 0, FinalWarning: 1, TerminatingConnection: 2,
      },
    },
  ],
  'PacketViolationType.json': [
    {
      reason:
        'Unknown is -1, so PacketMalformed is 0, not 1.',
      values: {
      Unknown: -1, PacketMalformed: 0,
      },
    },
  ],
  'PlayerActionType.json': [
    {
      reason:
        'Unknown is -1, and six actions are missing upstream.',
      insert: [
        { name: 'GetUpdatedBlock', after: 'StopDestroyBlock' },
        { name: 'DropItem', after: 'GetUpdatedBlock' },
        { name: 'ChangeSkin', after: 'CrackBlock' },
        { name: 'UpdatedEnchantingSeed', after: 'ChangeSkin' },
        { name: 'InteractWithBlock', after: 'StopSpinAttack' },
        { name: 'ClientAckServerData', after: 'StopFlying' },
      ],
      values: {
      Unknown: -1, StartDestroyBlock: 0, AbortDestroyBlock: 1, StopDestroyBlock: 2, GetUpdatedBlock: 3,
      DropItem: 4, StartSleeping: 5, StopSleeping: 6, Respawn: 7, StartJump: 8, StartSprinting: 9,
      StopSprinting: 10, StartSneaking: 11, StopSneaking: 12, CreativeDestroyBlock: 13,
      ChangeDimensionAck: 14, StartGliding: 15, StopGliding: 16, DenyDestroyBlock: 17, CrackBlock: 18,
      ChangeSkin: 19, UpdatedEnchantingSeed: 20, StartSwimming: 21, StopSwimming: 22, StartSpinAttack: 23,
      StopSpinAttack: 24, InteractWithBlock: 25, PredictDestroyBlock: 26, ContinueDestroyBlock: 27,
      StartItemUseOn: 28, StopItemUseOn: 29, HandledTeleport: 30, MissedSwing: 31, StartCrawling: 32,
      StopCrawling: 33, StartFlying: 34, StopFlying: 35, ClientAckServerData: 36, StartUsingItem: 37,
      InternalUpdate: 38, Count: 39,
      },
    },
  ],
  'persona__PieceType.json': [
    {
      reason:
        'Values are 1-based, so every member is off by one by ordinal.',
      values: {
      Skeleton: 1, Body: 2, Skin: 3, Bottom: 4, Feet: 5, Dress: 6, Top: 7, High_Pants: 8, Hands: 9,
      Outerwear: 10, FacialHair: 11, Mouth: 12, Eyes: 13, Hair: 14, Hood: 15, Back: 16, FaceAccessory: 17,
      Head: 18, Legs: 19, LeftLeg: 20, RightLeg: 21, Arms: 22, LeftArm: 23, RightArm: 24, Capes: 25,
      ClassicSkin: 26, Emote: 27,
      },
    },
  ],
  'ResourcePackResponse.json': [
    {
      reason:
        'Values are 1-based (Cancel is 1); serialized by name on the wire, so this is documentation only.',
      values: {
      Cancel: 1, Downloading: 2, DownloadingFinished: 3, ResourcePackStackFinished: 4,
      },
    },
  ],
  'Rotation.json': [
    {
      reason:
        'Clockwise90/180 and CounterClockwise90 are aliases of 1, 2 and 3, not distinct values 4-6.',
      values: {
      None: 0, Rotate90: 1, Rotate180: 2, Rotate270: 3, Clockwise90: 1, Clockwise180: 2,
      CounterClockwise90: 3,
      },
    },
  ],
  'TextProcessingEventOrigin.json': [
    {
      reason:
        'unknown is -1, so every member is off by one by ordinal.',
      values: {
      unknown: -1, ServerChatPublic: 0, ServerChatWhisper: 1, SignText: 2, AnvilText: 3,
      BookAndQuillText: 4, CommandBlockText: 5, BlockActorDataText: 6, JoinEventText: 7, LeaveEventText: 8,
      SlashCommandChat: 9, CartographyText: 10, KickCommand: 11, TitleCommand: 12, SummonCommand: 13,
      ServerForm: 14, DataDrivenUI: 15,
      },
    },
  ],
  'CurrentCmdVersion.json': [
    {
      reason:
        'Invalid is -1, two pairs of members share values 34 and 35, and Count is listed before Latest. Verified at 2168-2169, where Latest is 50 and Count 51.',
      maxProtocol: 2169,
      values: {
      Invalid: -1, Initial: 1, TpRotationClamping: 2, NewBedrockCmdSystem: 3, ExecuteUsesVec3: 4,
      CloneFixes: 5, UpdateAquatic: 6, EntitySelectorUsesVec3: 7, ContainersDontDropItemsAnymore: 8,
      FiltersObeyDimensions: 9, ExecuteAndBlockCommandAndSelfSelectorFixes: 10, InstantEffectsUseTicks: 11,
      DontRegisterBrokenFunctionCommands: 12, ClearSpawnPointCommand: 13,
      CloneAndTeleportRotationFixes: 14, TeleportDimensionFixes: 15, CloneUpdateBlockAndTimeFixes: 16,
      CloneIntersectFix: 17, FunctionExecuteOrderAndChestSlotFix: 18,
      NonTickingAreasNoLongerConsideredLoaded: 19, SpreadplayersHazardAndResolvePlayerByNameFix: 20,
      NewExecuteCommandSyntaxExperimentAndChestLootTableFixAndTeleportFacingVerticalUnclampedAndLocateBiomeAndFeatureMerged: 21,
      WaterloggingAddedToStructureCommand: 22, SelectorDistanceFilteredAndRelativeRotationFix: 23,
      NewSummonCommandAddedRotationOptionsAndBubbleColumnCloneFixAndExecuteInDimensionTeleportFixAndNewExecuteRotationFix: 24,
      NewExecuteCommandReleaseEnchantCommandLevelFixAndHasItemDataFixAndCommandDeferral: 25,
      ExecuteIfScoreFixes: 26, ReplaceItemAndLootReplaceBlockCommandsDoNotPlaceItemsIntoCauldronsFix: 27,
      ChangesToCommandOriginRotation: 28, RemoveAuxValueParameterFromBlockCommands: 29,
      VolumeSelectorFixes: 30, EnableSummonRotation: 31, SummonCommandDefaultRotation: 32,
      PositionalDimensionFiltering: 33, CommandSelectorHasItemFilterNoLongerCallsSameItemFunction: 34,
      AgentSweepingBlockTest: 34, BlockStateEquals: 35, CommandPositionFix: 35,
      CommandSelectorHasItemFilterUsesDataAsDamageForSelectingDamageableItems: 36,
      ExecuteDetectConditionSubcommandNotAllowNonLoadedBlocks: 37, RemoveSuicideKeyword: 38,
      CloneContainerBlockEntityRemovalFix: 39, StopSoundMusicFix: 40,
      SpreadPlayersStuckInGroundFixAndMaxHeightParameter: 41, LocateStructureOutput: 42,
      PostBlockFlattening: 43, TestForBlockCommandDoesNotIgnoreBlockState: 44, Count: 51, Latest: 50,
      },
    },
    {
      reason:
        'Invalid is -1, two pairs of members share values 34 and 35, and Count is listed before Latest. Verified at 2187, where Latest moved to 51 and Count to 52.',
      minProtocol: 2187,
      values: {
      Invalid: -1, Initial: 1, TpRotationClamping: 2, NewBedrockCmdSystem: 3, ExecuteUsesVec3: 4,
      CloneFixes: 5, UpdateAquatic: 6, EntitySelectorUsesVec3: 7, ContainersDontDropItemsAnymore: 8,
      FiltersObeyDimensions: 9, ExecuteAndBlockCommandAndSelfSelectorFixes: 10, InstantEffectsUseTicks: 11,
      DontRegisterBrokenFunctionCommands: 12, ClearSpawnPointCommand: 13,
      CloneAndTeleportRotationFixes: 14, TeleportDimensionFixes: 15, CloneUpdateBlockAndTimeFixes: 16,
      CloneIntersectFix: 17, FunctionExecuteOrderAndChestSlotFix: 18,
      NonTickingAreasNoLongerConsideredLoaded: 19, SpreadplayersHazardAndResolvePlayerByNameFix: 20,
      NewExecuteCommandSyntaxExperimentAndChestLootTableFixAndTeleportFacingVerticalUnclampedAndLocateBiomeAndFeatureMerged: 21,
      WaterloggingAddedToStructureCommand: 22, SelectorDistanceFilteredAndRelativeRotationFix: 23,
      NewSummonCommandAddedRotationOptionsAndBubbleColumnCloneFixAndExecuteInDimensionTeleportFixAndNewExecuteRotationFix: 24,
      NewExecuteCommandReleaseEnchantCommandLevelFixAndHasItemDataFixAndCommandDeferral: 25,
      ExecuteIfScoreFixes: 26, ReplaceItemAndLootReplaceBlockCommandsDoNotPlaceItemsIntoCauldronsFix: 27,
      ChangesToCommandOriginRotation: 28, RemoveAuxValueParameterFromBlockCommands: 29,
      VolumeSelectorFixes: 30, EnableSummonRotation: 31, SummonCommandDefaultRotation: 32,
      PositionalDimensionFiltering: 33, CommandSelectorHasItemFilterNoLongerCallsSameItemFunction: 34,
      AgentSweepingBlockTest: 34, BlockStateEquals: 35, CommandPositionFix: 35,
      CommandSelectorHasItemFilterUsesDataAsDamageForSelectingDamageableItems: 36,
      ExecuteDetectConditionSubcommandNotAllowNonLoadedBlocks: 37, RemoveSuicideKeyword: 38,
      CloneContainerBlockEntityRemovalFix: 39, StopSoundMusicFix: 40,
      SpreadPlayersStuckInGroundFixAndMaxHeightParameter: 41, LocateStructureOutput: 42,
      PostBlockFlattening: 43, TestForBlockCommandDoesNotIgnoreBlockState: 44, Count: 52, Latest: 51,
      },
    },
  ],
};
