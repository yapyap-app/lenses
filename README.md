# The official yapyap Lens Registry

The lenses that ship with [yapyap](https://yap-yap.app) — Actions,
Decisions, Summary — and the registry the app's marketplace reads them
from, over plain HTTP from
`https://raw.githubusercontent.com/yapyap-app/lenses/main/`. No auth, no
token, no API — just static files.

Every lens is a `lenses/<name>/lens.json` file; `index.json` is the
catalogue, rebuilt automatically by CI whenever a lens changes. This
repository is a fork of
[registry-template](https://github.com/yapyap-app/registry-template) and
works exactly like any registry made from it — the official registry gets
no special treatment beyond its verified badge in the app.

## Propose a lens

Open a pull request adding your lens at `lenses/<your-lens-name>/lens.json`
(export it from yapyap via **Publish → Download**). CI validates it against
the same rules the app enforces on install; nothing invalid can merge. See
the [publishing guide](https://docs.yap-yap.app/docs/lenses/publishing) —
or run your own registry from the
[template](https://github.com/yapyap-app/registry-template) instead, and
users can subscribe to it directly.

## Identity

```
registryId:  yapyap.official
base URL:    https://raw.githubusercontent.com/yapyap-app/lenses/main/
```

The `registryId` is the stable namespace — it survives if this repo ever
moves hosts. Installed lenses thread their identity through
`<registryId>/<listing-path>`, content-hashed per version. The Official
badge in the app is bound to the base URL the app fetches from — a copy of
this repo cannot claim it.

## License

GPL-3.0-or-later for the lenses in this repository — see
[`LICENSE`](./LICENSE). Each lens also declares its own license in
`listing.license`.
