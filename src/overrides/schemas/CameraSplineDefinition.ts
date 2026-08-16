import type { ObjectSchema } from '../../schema.js';
import { expectAbsentProperties } from '../expect.js';
import type { Override } from '../types.js';

const override: Override = {
  reason:
    'spline_type is always written, and the definition ends with two fields the schema omits entirely — the same splineIdentifier/loadFromJson pair that CameraInstruction__SplineInstruction documents.',
  expect: expectAbsentProperties('splineIdentifier', 'loadFromJson'),
  required: {
    spline_type: true,
  },
  transform: (schema) => {
    const objectSchema = schema as ObjectSchema;
    const properties = objectSchema.properties;
    if (!properties) return;
    properties['splineIdentifier'] = {
      description: 'Identifier of the spline definition.',
      type: 'string',
      'x-ordinal-index': 6,
    };
    properties['loadFromJson'] = {
      description: 'Whether the spline is loaded from JSON rather than from this packet.',
      type: 'boolean',
      'x-underlying-type': 'boolean',
      'x-ordinal-index': 7,
    };
    objectSchema.required = [
      ...(objectSchema.required ?? []),
      'loadFromJson',
      'splineIdentifier',
    ].sort();
  },
};

export default override;
