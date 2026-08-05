/**
 * Custom serialization-option markers we append to a field's
 * `x-serialization-options` array, alongside Mojang's own values.
 *
 * A leading `+` marks a synthetic marker of ours, so it's self-identifying and
 * reads as a diff over the original. Real Mojang options that a fix genuinely
 * adds (e.g. "Compression") are written plain, without the prefix.
 */

export const ADD_PREFIX = '+';

/** Mark an option as added by us. */
export const added = (option: string): string => `${ADD_PREFIX}${option}`;

/**
 * The optional presence header is written twice — `bool + (bool + value-if-true)`
 * instead of `bool + value-if-true` (a client double-write bug). Read/write two
 * booleans; the second gates the value.
 */
export const DOUBLE_OPTIONAL = added('double-optional');

/**
 * The value is preceded by an optional-presence `bool` that is always `true` on
 * the wire — the field is genuinely required, but it is framed as an optional.
 * Read/write the leading `bool` and then always the value; a `false` header is a
 * malformed packet.
 */
export const ALWAYS_SET_OPTIONAL = added('always-set-optional');
