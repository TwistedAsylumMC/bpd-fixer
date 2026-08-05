import type { Override } from '../types.js';

const override: Override = {
  reason:
    "experienceId, experienceName and creatorId are unconditional; the other five fields are optionals.",
  required: {
    "worldId": false,
    "worldName": false,
    "targetId": false,
    "scenarioId": false,
    "serverId": false,
  },
};

export default override;
