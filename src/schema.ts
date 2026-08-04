/**
 * Minimal typings for Mojang's Bedrock protocol JSON Schema files.
 */
import type { LosslessNumber } from 'lossless-json';

export interface Property {
  description?: string;
  type?: string;
  $ref?: string;
  'x-underlying-type'?: string;
  'x-serialization-options'?: string[];
  'x-ordinal-index'?: LosslessNumber | number;
  [key: string]: unknown;
}

export interface ObjectSchema {
  title?: string;
  $schema?: string;
  $id?: string;
  type?: string;
  properties?: Record<string, Property>;
  required?: string[];
  [key: string]: unknown;
}

export type AnySchema = Record<string, unknown>;
