import type { ObjectSchema } from '../../schema.js';
import { expectProperty } from '../expect.js';
import type { Override } from '../types.js';

const override: Override = {
  reason:
    'The Target variant tag is a single bool (false selects EntityCommandTarget, true BlockCommandData), not a compressed uint32.',
  expect: expectProperty('Target', 'x-control-value-type', 'uint32'),
  patch: {
    Target: { 'x-control-value-type': 'boolean' },
  },
  transform: (schema) => {
    // The global rule that adds "Compression" to every oneOf control value does not
    // apply to a bool tag, so drop it again here (transform runs last).
    const target = (schema as ObjectSchema).properties?.['Target'];
    if (!target) return;
    const options = target['x-serialization-options'];
    if (!Array.isArray(options)) return;
    const kept = options.filter((option) => option !== 'Compression');
    if (kept.length > 0) target['x-serialization-options'] = kept;
    else delete target['x-serialization-options'];
  },
};

export default override;
