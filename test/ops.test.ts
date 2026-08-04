import { describe, it, expect } from 'vitest';
import { parseSchema } from '../src/util/json.js';
import type { ObjectSchema } from '../src/schema.js';
import {
  OverrideError,
  addSerializationOptions,
  patch,
  patchRoot,
  redescribe,
  rename,
  setRequired,
} from '../src/overrides/ops.js';

const FIXTURE = `{
    "title": "T",
    "type": "object",
    "properties": {
        "Alpha": {
            "type": "boolean",
            "x-ordinal-index": 0
        },
        "Beta": {
            "description": "b",
            "$ref": "./X.json",
            "x-ordinal-index": 1
        }
    },
    "required": [
        "Alpha",
        "Beta"
    ]
}`;

const load = () => parseSchema(FIXTURE) as ObjectSchema;
const F = 'Fixture.json';

describe('setRequired', () => {
  it('removes a field from required', () => {
    const s = load();
    setRequired(s, 'Alpha', false, F);
    expect(s.required).toEqual(['Beta']);
  });

  it('adds a field and keeps the array sorted', () => {
    const s = load();
    setRequired(s, 'Alpha', false, F);
    setRequired(s, 'Alpha', true, F);
    expect(s.required).toEqual(['Alpha', 'Beta']);
  });

  it('throws on an unknown field', () => {
    expect(() => setRequired(load(), 'Ghost', false, F)).toThrow(OverrideError);
  });
});

describe('rename', () => {
  it('renames the key and preserves x-ordinal-index', () => {
    const s = load();
    rename(s, 'Alpha', 'Zeta', F);
    expect(Object.keys(s.properties!)).toContain('Zeta');
    expect(Object.keys(s.properties!)).not.toContain('Alpha');
    expect(String(s.properties!['Zeta']!['x-ordinal-index'])).toBe('0');
  });

  it('updates the required array', () => {
    const s = load();
    rename(s, 'Alpha', 'Zeta', F);
    expect(s.required).toEqual(['Beta', 'Zeta']);
  });

  it('throws when the target already exists', () => {
    expect(() => rename(load(), 'Alpha', 'Beta', F)).toThrow(OverrideError);
  });
});

describe('redescribe', () => {
  it('replaces an existing description', () => {
    const s = load();
    redescribe(s, 'Beta', 'new', F);
    expect(s.properties!['Beta']!.description).toBe('new');
  });

  it('inserts description as the first key when absent', () => {
    const s = load();
    redescribe(s, 'Alpha', 'added', F);
    expect(Object.keys(s.properties!['Alpha']!)[0]).toBe('description');
    expect(s.properties!['Alpha']!.description).toBe('added');
  });
});

describe('patch', () => {
  it('shallow-merges keys into a property', () => {
    const s = load();
    patch(s, 'Alpha', { 'x-underlying-type': 'int32' }, F);
    expect(s.properties!['Alpha']!['x-underlying-type']).toBe('int32');
  });
});

describe('patchRoot', () => {
  it('updates an existing root key in place', () => {
    const s = parseSchema('{"type":"string","enum":["A"],"x-underlying-type":"object"}');
    patchRoot(s, { 'x-underlying-type': 'uint32' });
    expect(s['x-underlying-type']).toBe('uint32');
  });

  it('replaces a root enum', () => {
    const s = parseSchema('{"type":"string","enum":["A"]}');
    patchRoot(s, { enum: ['A', 'B'] });
    expect(s['enum']).toEqual(['A', 'B']);
  });
});

describe('addSerializationOptions', () => {
  it('creates the array before x-ordinal-index when absent', () => {
    const s = load();
    addSerializationOptions(s, 'Alpha', 'double-optional', F);
    expect(s.properties!['Alpha']!['x-serialization-options']).toEqual(['double-optional']);
    // inserted immediately before x-ordinal-index to match upstream ordering
    const keys = Object.keys(s.properties!['Alpha']!);
    expect(keys.indexOf('x-serialization-options')).toBe(keys.indexOf('x-ordinal-index') - 1);
  });

  it('appends to an existing array and dedupes', () => {
    const s = load();
    patch(s, 'Beta', { 'x-serialization-options': ['Enum-as-Value'] }, F);
    addSerializationOptions(s, 'Beta', ['double-optional', 'Enum-as-Value'], F);
    expect(s.properties!['Beta']!['x-serialization-options']).toEqual([
      'Enum-as-Value',
      'double-optional',
    ]);
  });

  it('throws on an unknown field', () => {
    expect(() => addSerializationOptions(load(), 'Ghost', 'x', F)).toThrow(OverrideError);
  });
});
