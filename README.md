# bpd-fixer

Produces corrected copies of [Mojang's official Bedrock protocol JSON schemas](https://github.com/Mojang/bedrock-protocol-docs), fixing the places where the published docs disagree with what the client actually does on the wire.

Output stays near-identical to upstream, so community tooling (such as the `bedrock-protocol` / PrismarineJS ecosystem) can consume it directly. Every schema that needs no fix is copied byte-for-byte, so the corrected set diffs cleanly against Mojang's.

## What it fixes

- Fields marked `required` that are actually optional, and vice versa.
- Wire-encoding quirks that plain JSON Schema can't express, such as the *double-write* bug where an optional value is serialized as `bool + (bool + value-if-true)` instead of `bool + value-if-true`.
- Unclear field names and descriptions.

## Getting started

```bash
git submodule update --init --recursive
npm install

npm run build:schemas    # write corrected schemas to output/json
npm run check            # fail if output/json is out of date
npm test                 # run the test suite
```

Flags for `build:schemas`: `--in <dir>`, `--out <dir>`, `--check`, `--verbose`.

## How it works

Each schema is parsed, run through the global rules, then its override (if any), then serialized. There are two ways a fix is applied:

- **Rules** (`src/rules.ts`) are deterministic corrections applied to every schema, for issues that follow a mechanical pattern across many files.
- **Overrides** (`src/overrides/schemas/`) are hand-authored, per-file corrections for specific issues that can't be inferred by a rule.

## Adding a patch

Most fixes are per-file overrides. To add one:

1. Copy `src/overrides/schemas/_TEMPLATE.ts` to `src/overrides/schemas/<SchemaFileName>.ts` (match the upstream file name without `.json`).
2. Keep only the ops you need. They reference the **original** field names and run in the order `root → patch → redescribe → serializationOptions → required → rename → transform`.
3. Register it in `src/overrides/registry.ts`.
4. Run `npm test` and `npm run build:schemas`, then commit the updated `output/json`.

If an override references a field the upstream schema no longer has, the run throws. That's the intended signal to update the override after a protocol bump.

### Override ops

| Op | Effect |
| -- | ------ |
| `root` | Shallow-merge keys into the schema root (top-level `enum`/type). |
| `required` | Move a field in or out of the `required` array. |
| `rename` | Rename a property key; preserves `x-ordinal-index`, updates `required`. |
| `redescribe` | Replace or add a field description. |
| `patch` | Shallow-merge arbitrary keys into a property. |
| `serializationOptions` | Append option string(s) to `x-serialization-options`. |
| `transform` | Escape hatch for arbitrary reshaping; runs last. |

### Wire quirks

Some encodings can't be modeled with standard JSON Schema. Rather than a separate extension, we append documented custom strings to Mojang's existing `x-serialization-options` array (which already carries values like `Compression`), so files stay valid draft-07 and quirks ride the same channel consumers already read.

Our own markers get a `+` prefix so they read as a diff over the originals; real Mojang options that a fix genuinely adds are written plain. Markers are defined in `src/overrides/quirks.ts`.

| Marker | Meaning |
| ------ | ------- |
| `+double-optional` | The optional presence header is written twice: `bool + (bool + value-if-true)`. |

## Updating to a new protocol version

```bash
cd vendor/bedrock-protocol-docs && git fetch && git checkout <ref> && cd ../..
npm test            # stale overrides throw here
npm run build:schemas
```

Commit the updated submodule pointer alongside the regenerated `output/json`.

## License

[MIT](LICENCE). The schemas under `vendor/` and the corrected copies in `output/json` derive from [Mojang's bedrock-protocol-docs](https://github.com/Mojang/bedrock-protocol-docs) and remain subject to its license.
