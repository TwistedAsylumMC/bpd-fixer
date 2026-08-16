# bpd-fixer

Produces corrected copies of [Mojang's official Bedrock protocol JSON schemas](https://github.com/Mojang/bedrock-protocol-docs), fixing the places where the published docs disagree with what the client actually does on the wire.

Output stays near-identical to upstream, so community tooling (such as the `bedrock-protocol` / PrismarineJS ecosystem) can consume it directly. Every schema that needs no fix is copied byte-for-byte, so the corrected set diffs cleanly against Mojang's.

## What it fixes

- Fields marked `required` that are actually optional, and vice versa.
- Wire-encoding quirks that plain JSON Schema can't express, such as the *double-write* bug where an optional value is serialized as `bool + (bool + value-if-true)` instead of `bool + value-if-true`.
- Enum members whose numeric value isn't their position in the list, plus members missing from it entirely.
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

### Protocol versions

`output/json` is built for whatever the submodule points at, and the sync workflow builds `main` against every upstream branch at protocol >= 2168. An override written against the newest docs is therefore applied to older branches too. Two things scope that.

**Version bounds.** `minProtocol` and `maxProtocol` are both inclusive and both optional. Omitting them, the default, means the fix applies everywhere and carries forward to protocol versions that don't exist yet. Set a bound only when a later version needs a genuinely *different* fix, then register an array of variants:

```ts
'BuildPlatform.json': [
  { maxProtocol: 2169, /* … */ },
  { minProtocol: 2171, /* … */ },
],
```

The first variant whose range covers the schema wins, so list them most-specific first. A version no variant covers is passed through unfixed and reported.

**`expect`.** A precondition on the upstream schema: return a message to abandon the fix, or nothing to proceed. A failed `expect` is not an error; the file is passed through and listed in the run output.

The two catch different things:

- Bounds catch changes invisible in the schema, such as an enum keeping its member names while the values move underneath.
- `expect` catches shapes a version range can't separate, such as two branches at the same protocol version carrying different member lists.

Both exist because the failure they prevent is silent. `root` and `transform` overwrite whatever is there, so a stale override doesn't error, it rewrites correct upstream data. Field ops are narrower but not immune: they will re-apply a correction Mojang has since published, leaving the `reason` describing a bug that no longer exists.

Most overrides need no `expect`. One is derived from `required`, `patch` and `serializationOptions`, which each declare the state they move the schema to, so the build can check upstream is still in the state the fix corrects. It fires when every readable op is already satisfied, meaning the fix would change nothing. Partly-satisfied overrides still apply, and the dead ops are reported separately.

Write an `expect` by hand only where the ops can't speak for themselves, using the helpers in `src/overrides/expect.ts`:

| Helper | For |
| ------ | --- |
| `expectEnumMembers(list, count)` | a `root` that replaces `enum` wholesale; catches members added, renamed or removed |
| `expectProperty(field, key, before)` | a `patch` that overwrites a concrete value; asserts the value being replaced is the diagnosed one |
| `expectAbsentProperties(...fields)` | a `transform` that adds properties; declines once Mojang documents them |

### Wire quirks

Some encodings can't be modeled with standard JSON Schema. Rather than a separate extension, we append documented custom strings to Mojang's existing `x-serialization-options` array (which already carries values like `Compression`), so files stay valid draft-07 and quirks ride the same channel consumers already read.

Our own markers get a `+` prefix so they read as a diff over the originals; real Mojang options that a fix genuinely adds are written plain. Markers are defined in `src/overrides/quirks.ts`.

| Marker | Meaning |
| ------ | ------- |
| `+double-optional` | The optional presence header is written twice: `bool + (bool + value-if-true)`. |
| `+always-set-optional` | The value is framed as an optional but the presence `bool` is always `true`; a `false` header is a malformed packet. |

### Enum values

Upstream publishes enums as bare draft-07 string lists with no numeric values, so the only value a consumer can infer is the member's index. Some enums have retired values, sentinels (`Unknown = -1`), aliases, and values well outside the ordinal range (`ActorType` reaches 16777999).

Where the fix is just inserting members Mojang omitted, or sorting the list into value order, we do that and the list stays a plain 0..n-1 run.

The rest can't be expressed that way, so those files gain an `x-enum-values` array positionally aligned with `enum`:

```json
{
  "type": "string",
  "enum": ["Invalid", "StopRiding", "InteractUpdate", "NpcOpen", "OpenInventory"],
  "x-enum-values": [0, 3, 4, 5, 6],
  "x-underlying-type": "uint8"
}
```

Index-based consumers see an unchanged member list; value-aware ones get the truth. The values live in `src/overrides/enumValues.ts` as one table, and `enumValueOverride.ts` turns each entry into a registered override.

`values` is keyed by member **name**, not position, and may be a superset across protocol versions, so upstream adding, removing or renaming members is absorbed without a code change. `Nx` and `Nintendo` both map to 12; a branch gets whichever it lists. Two things aren't absorbed, by design: a name whose value *changes* between versions needs version-bounded variants, and a name with no known value abandons the fix for that file rather than guessing.

`x-enum-values` is emitted only when it differs from the ordinals, so an enum Mojang already publishes complete and correctly numbered is left byte-identical to upstream.

## Updating to a new protocol version

```bash
cd vendor/bedrock-protocol-docs && git fetch && git checkout <ref> && cd ../..
npm test            # stale overrides throw here
npm run build:schemas
```

Commit the updated submodule pointer alongside the regenerated `output/json`.

## Automatic upstream sync

`.github/workflows/sync-upstream.yml` tracks [Mojang/bedrock-protocol-docs] on a 6-hourly cron, or on
demand via **Run workflow**.

- **Every non-default upstream branch** gets a same-named branch here: `main` (our code and overrides)
  with the submodule repointed at that branch and `output/json` regenerated.
- **Upstream `main`** opens a PR on `automated/upstream-main` rather than pushing, since a protocol bump
  is when an override goes stale. If `npm test` fails, the workflow files an issue and opens no PR.

Only branches at `x-protocol-version >= 2168` are mirrored; the format changed there. Branches with no
`json/` directory are skipped. Both are adjustable via the `min_protocol`, `branch_include` and
`branch_exclude` inputs.

Mirrors are force-pushed, so each generated commit carries two trailers:

```
Upstream-Commit: <upstream branch sha it was built from>
Fixer-Commit:    <our main sha it was built from>
```

`scripts/plan-sync.mjs` uses them to decide what needs rebuilding, a mirror is stale if either sha has
moved, so editing an override is enough to trigger one. A tip with no `Upstream-Commit` trailer wasn't
written by the workflow and is left alone.

[Mojang/bedrock-protocol-docs]: https://github.com/Mojang/bedrock-protocol-docs

## License

[MIT](LICENCE). The schemas under `vendor/` and the corrected copies in `output/json` derive from [Mojang's bedrock-protocol-docs](https://github.com/Mojang/bedrock-protocol-docs) and remain subject to its license.
