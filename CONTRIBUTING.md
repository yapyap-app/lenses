# Contributing

The official Lens Registry is curated. Anything in here ships in every yapyap
install and gets the verified badge — so we hold contributions to a higher bar
than the community marketplace.

## Adding a new Lens

1. Create `lenses/<slug>/lens.json` following `formatVersion: 1`:

   ```jsonc
   {
     "formatVersion": 1,
     "listing": {
       "name": "Decisions",
       "description": "One-line, shown in the marketplace browse list.",
       "author": { "name": "Acme", "url": "https://acme.dev" },
       "tags": ["meetings", "decisions"],
       "screenshots": ["screenshots/1.png"],
       "license": "MIT",
       "minAppVersion": "0.5.0"
     },
     "lens": {
       "version": "1.0.0",
       "kind": "llm",
       "systemPrompt": "…",
       "schema": { "fields": [/* declarative tree — see view-grammar.ts */] },
       "shape": "cited-list",
       "view":  { "blocks": [/* Block grammar */] },
       "inputRefs": [{ "kind": "pipeline", "pipeline": "transcript" }]
     }
   }
   ```

2. Run `node scripts/build-index.mjs` from the repo root. This walks
   `lenses/`, recomputes the canonical `sha256` of every `lens.json`, and
   rewrites `index.json` deterministically.

3. Open a PR. Include screenshots (drop them in `lenses/<slug>/screenshots/`)
   and a short writeup of what the Lens does, what inputs it reads, and what a
   typical output looks like.

## Updating an existing Lens

Bump `lens.version` (semver), edit the fields, re-run the index script.

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

## Verification badge

The Official badge is hardcoded into the yapyap app as a `registryId` match
(`yapyap.official`). Any Registry can claim a `registryId` of any name in its
own `index.json` — only this repo's content reaches the Official badge in the
client. The badge is editorial, not technical.
