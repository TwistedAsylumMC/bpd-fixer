import { expectProperty } from '../expect.js';
import type { Override } from '../types.js';

const override: Override = {
  reason: "The actor id is a runtime id (uint64 varint), not a unique id (int64 zigzag varint).",
  expect: expectProperty('Actor Unique ID', '$ref', './ActorUniqueID.json'),
  patch: {
    'Actor Unique ID': { $ref: './ActorRuntimeID.json' },
  },
  rename: {
    'Actor Unique ID': 'Actor Runtime ID',
  },
};

export default override;
