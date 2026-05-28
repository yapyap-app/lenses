# yapyap official lenses

The official Lens Registry for [yapyap](https://github.com/yapyap-app/yapyap) — the
trusted source of Lenses every install starts with, and the canonical reference
implementation of the [Lens Registry Contract](https://github.com/yapyap-app/yapyap/blob/main/docs/architecture/lens-registry-contract.md).

This registry is read by the yapyap app over plain HTTP from
`https://raw.githubusercontent.com/yapyap-app/lenses/main/`. No auth, no token,
no API — just static files behind a CDN.

## What's in here

```
.
├── index.json            # the catalogue — name + description per Lens
└── lenses/
    ├── actions/lens.json    # extract action items from a meeting Transcript
    ├── decisions/lens.json  # extract Decisions committed to in a Transcript
    └── summary/lens.json    # structured headline + framing + body summary
```

Each `lens.json` follows `formatVersion: 1` of the registry envelope:

```jsonc
{
  "formatVersion": 1,
  "listing": { "name", "description", "author", "tags", "license", "minAppVersion" },
  "lens":    { "version", "kind", "systemPrompt", "schema", "shape", "view", "inputRefs" }
}
```

`listing` is distribution metadata. `lens` is the runnable definition. The
canonical version is `lens.version`; `index.json` carries a copy alongside the
sha256 of the canonical (sorted-keys) `lens.json` bytes.

## Contributing

Open a PR. The Official badge on the yapyap Marketplace is `registryId`-match
only — Lenses live here because they pass review, not because the repo claims
the badge.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full process.

## Identity

```
registryId:  yapyap.official
base URL:    https://raw.githubusercontent.com/yapyap-app/lenses/main/
```

The `registryId` is the stable namespace — it survives if this repo ever moves
hosts. Installed Lenses thread their identity through
`<registryId>/<listing-path>`, content-hashed per version.

## License

GPL-3.0-or-later — see [`LICENSE`](./LICENSE). Each Lens may declare its own
license in `listing.license`; the default for everything in this repo is
GPL-3.0-or-later.
