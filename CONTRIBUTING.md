# Contributing

The official Lens Registry is curated. Anything in here ships in every yapyap
install and gets the verified badge — so we hold contributions to a higher bar
than the community marketplace.

Lenses are authored in **TypeScript** with `defineLens` from `@yapyap/lens`,
then compiled to the static `lens.json` / `index.json` the registry serves.
You never hand-write `lens.json` — it is generated.

## Adding a new Lens

1. Create `src/<slug>.lens.ts`, declaring the lens via `defineLens`:

   ```ts
   import { defineLens } from "@yapyap/lens";

   const systemPrompt = "…";

   export const decisions = defineLens({
     path: "decisions", // folder under lenses/
     updatedAt: "2026-06-17T00:00:00.000Z", // authored, not file mtime
     listing: {
       name: "Decisions",
       description: "One-line, shown in the marketplace browse list.",
       author: { name: "Acme", url: "https://acme.dev" },
       tags: ["meetings", "decisions"],
       license: "GPL-3.0-or-later",
       minAppVersion: "0.5.0",
     },
     lens: {
       version: "1.0.0",
       shape: { kind: "cited-list" },
       inputs: ["transcript"],
       systemPrompt,
       schema: { fields: [/* declarative tree — see @yapyap/lens */] },
     },
   });
   ```

   There is **no `view`** — per [ADR-0032](https://github.com/yapyap-app/yapyap/blob/main/docs/adr/0032-generated-lens-views-json-render.md)
   the result UI is a json-render Spec generated at runtime from the declared
   output shape + schema, not shipped in the wire format.

2. Add the export to `src/index.ts`'s `officialLenses` array.

3. Run `bun run build` from the repo root. This compiles every `src/*.lens.ts`
   into `lenses/<path>/lens.json` (+ the canonical `sha256` in `index.json`),
   deterministically. `bun run verify` (`--check`) fails on drift in CI.

4. Open a PR. Include screenshots (drop them in `lenses/<slug>/screenshots/`,
   reference them in `listing.screenshots`) and a short writeup of what the
   Lens does, what inputs it reads, and what a typical output looks like.

## Updating an existing Lens

Bump `lens.version` (semver) in the `src/<slug>.lens.ts` source, edit the
fields, and re-run `bun run build`.

Under the [content-addressed identity](https://github.com/yapyap-app/yapyap/blob/main/docs/adr/0021-content-addressed-lens-identity.md)
contract, a published update is a new row on every installed machine — the old
hash still owns existing Results.

## What does NOT go in the wire format

- **`schemaSource`** — raw Zod TypeScript is an authoring artefact. The wire
  carries the declarative `schema` tree only. The consumer compiles it to a
  Zod validator with a pure builder, no `eval`, no `new Function`. See
  [ADR-0020](https://github.com/yapyap-app/yapyap/blob/main/docs/adr/0020-declarative-additive-only-lens-grammars.md).
- **`declaredInputs` / `chainDependencies`** — both are derived from
  `lens.inputRefs`. Don't author them.
- **`manifest.json`** — pre-ADR-0019 format. The new envelope folds those
  fields into `listing`.
- **`view`** — no longer authored. The result UI is generated at runtime
  (ADR-0032); `defineLens` emits no `view` and the build omits it.

## Verification badge

The Official badge is hardcoded into the yapyap app as a `registryId` match
(`yapyap.official`). Any Registry can claim a `registryId` of any name in its
own `index.json` — only this repo's content reaches the Official badge in the
client. The badge is editorial, not technical.
