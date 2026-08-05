import type { Override } from '../types.js';
import { ALWAYS_SET_OPTIONAL } from '../quirks.js';

const override: Override = {
  reason:
    "The transaction is framed as an optional whose presence header is always set; the header precedes the variant tag, and a false header is a malformed packet.",
  serializationOptions: {
    Transaction: ALWAYS_SET_OPTIONAL,
  },
};

export default override;
