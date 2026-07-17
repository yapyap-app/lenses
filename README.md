# Your yapyap Lens Registry

This repository is a lens registry for [yapyap](https://yap-yap.app):
a place to publish lenses you made so others can install them. No server
needed — GitHub hosts the files, and a built-in workflow keeps the
catalogue up to date for you.

Full guide — including sending a lens as a single file and how updates
reach your subscribers — in the official docs:
[docs.yap-yap.app/docs/lenses/publishing](https://docs.yap-yap.app/docs/lenses/publishing).

## Set it up (once, ~2 minutes)

1. Click **Use this template → Create a new repository** (top right on
   GitHub). Give it any name, keep it **public**.
2. In your new repository, open `registry.config.json`, click the pencil
   to edit, and change the `registryId` to something that is yours, e.g.
   `"jane.lenses"`. Commit the change.
3. Done. Your registry lives at `https://github.com/<you>/<repo>`.

## Publish a lens

1. In yapyap, open your lens and choose **Publish** — it gives you a
   `lens.json` file.
2. In this repository, use **Add file → Upload files** (or **Create new
   file** and paste) to put it at `lenses/<your-lens-name>/lens.json` —
   for example `lenses/standup-summary/lens.json`.
3. Commit. Within a minute the **Build registry index** workflow checks
   your lens and updates the catalogue (`index.json`) automatically. If
   the file has a problem, the workflow fails with a message telling you
   what to fix — nothing broken is ever published.

To update a lens later, upload the new `lens.json` over the old one and
bump the `version` inside it — yapyap shows your subscribers what changed
before they accept the update.

The example lens in `lenses/example-highlights/` is safe to delete
whenever you like.

## Let people install your lenses

Tell them to open yapyap → **Lenses → Add registry** and paste your
repository URL — or just `<you>/<repo>`. They'll see your whole
catalogue and get notified when you ship updates.

## How it works (for the curious)

A registry is only static files: `index.json` (the catalogue, with a
content hash per lens) and `lenses/<name>/lens.json` (the lens itself).
The workflow in `.github/workflows/build-index.yml` runs
`scripts/build-index.mjs`, which validates every lens against the same
rules yapyap enforces on install, then rewrites the catalogue. Nothing in
a lens is executable — a lens is a prompt, a schema, and a layout — and
yapyap re-verifies everything again on every install.
