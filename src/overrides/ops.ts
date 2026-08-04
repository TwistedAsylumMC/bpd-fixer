import type { AnySchema, ObjectSchema, Property } from '../schema.js';
import type { Override, OverrideContext } from './types.js';

export class OverrideError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OverrideError';
  }
}

function requireProperty(
  schema: ObjectSchema,
  field: string,
  fileName: string,
  op: string,
): Property {
  const props = schema.properties;
  if (!props || !Object.prototype.hasOwnProperty.call(props, field)) {
    throw new OverrideError(
      `[${fileName}] ${op}: field "${field}" not found in properties. ` +
        `The upstream schema may have renamed or removed it; update the override.`,
    );
  }
  return props[field]!;
}

/** Add/remove a field from `required`, keeping the array sorted like upstream. */
export function setRequired(
  schema: ObjectSchema,
  field: string,
  required: boolean,
  fileName: string,
): void {
  requireProperty(schema, field, fileName, 'required');
  const arr = schema.required ?? [];
  const has = arr.includes(field);
  if (required && !has) {
    schema.required = [...arr, field].sort();
  } else if (!required && has) {
    schema.required = arr.filter((f) => f !== field);
  } else {
    schema.required = arr;
  }
}

/** Rename a property key in place, preserving order, ordinal index and required. */
export function rename(
  schema: ObjectSchema,
  from: string,
  to: string,
  fileName: string,
): void {
  requireProperty(schema, from, fileName, 'rename');
  const props = schema.properties!;
  if (Object.prototype.hasOwnProperty.call(props, to)) {
    throw new OverrideError(
      `[${fileName}] rename: target "${to}" already exists in properties.`,
    );
  }
  const rebuilt: Record<string, Property> = {};
  for (const [key, value] of Object.entries(props)) {
    rebuilt[key === from ? to : key] = value;
  }
  schema.properties = rebuilt;
  if (schema.required?.includes(from)) {
    schema.required = schema.required.map((f) => (f === from ? to : f)).sort();
  }
}

/** Replace a description, or insert one as the first key to match upstream style. */
export function redescribe(
  schema: ObjectSchema,
  field: string,
  description: string,
  fileName: string,
): void {
  const prop = requireProperty(schema, field, fileName, 'redescribe');
  if (Object.prototype.hasOwnProperty.call(prop, 'description')) {
    prop.description = description;
    return;
  }
  const rebuilt: Property = { description };
  for (const [key, value] of Object.entries(prop)) rebuilt[key] = value;
  schema.properties![field] = rebuilt;
}

/** Shallow-merge arbitrary keys into the schema root (for enum-type files etc.). */
export function patchRoot(schema: AnySchema, patchObj: Record<string, unknown>): void {
  Object.assign(schema, patchObj);
}

/** Shallow-merge arbitrary keys into a property. */
export function patch(
  schema: ObjectSchema,
  field: string,
  patchObj: Record<string, unknown>,
  fileName: string,
): void {
  const prop = requireProperty(schema, field, fileName, 'patch');
  Object.assign(prop, patchObj);
}

/** Append option string(s) to any node's `x-serialization-options`, in place. */
export function insertSerializationOptions(
  node: Record<string, unknown>,
  options: string | string[],
): boolean {
  const toAdd = Array.isArray(options) ? options : [options];

  const existing = node['x-serialization-options'];
  if (Array.isArray(existing)) {
    let changed = false;
    for (const opt of toAdd) {
      if (!existing.includes(opt)) {
        existing.push(opt);
        changed = true;
      }
    }
    return changed;
  }

  const value = [...new Set(toAdd)];
  const entries = Object.entries(node);
  for (const key of Object.keys(node)) delete node[key];
  let inserted = false;
  for (const [key, val] of entries) {
    if (key === 'x-ordinal-index' && !inserted) {
      node['x-serialization-options'] = value;
      inserted = true;
    }
    node[key] = val;
  }
  if (!inserted) node['x-serialization-options'] = value;
  return true;
}

/** Append option string(s) to a field's `x-serialization-options`. */
export function addSerializationOptions(
  schema: ObjectSchema,
  field: string,
  options: string | string[],
  fileName: string,
): void {
  const prop = requireProperty(schema, field, fileName, 'serializationOptions');
  insertSerializationOptions(prop, options);
}

/** Apply a full override to a parsed schema, in the fixed op order. */
export function applyOverride(
  schema: AnySchema,
  override: Override,
  fileName: string,
): AnySchema {
  const obj = schema as ObjectSchema;
  if (override.root) patchRoot(obj, override.root);
  if (override.patch)
    for (const [f, v] of Object.entries(override.patch)) patch(obj, f, v, fileName);
  if (override.redescribe)
    for (const [f, v] of Object.entries(override.redescribe)) redescribe(obj, f, v, fileName);
  if (override.serializationOptions)
    for (const [f, v] of Object.entries(override.serializationOptions))
      addSerializationOptions(obj, f, v, fileName);
  if (override.required)
    for (const [f, v] of Object.entries(override.required)) setRequired(obj, f, v, fileName);
  if (override.rename)
    for (const [f, v] of Object.entries(override.rename)) rename(obj, f, v, fileName);

  let result: AnySchema = obj;
  if (override.transform) {
    const ctx: OverrideContext = { fileName };
    const replaced = override.transform(result, ctx);
    if (replaced) result = replaced;
  }
  return result;
}
