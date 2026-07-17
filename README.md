# yapyap Lens Registry

Your own [yapyap](https://yap-yap.app) lens registry — a place to publish lenses you made so
others can install them. No server needed: GitHub hosts the files, and a
built-in workflow keeps the catalogue up to date for you.

> This is the **base registry template**. The
> [official yapyap registry](https://github.com/yapyap-app/lenses) is built
> on it too — improvements land here first and flow downstream.

## Set up your registry (once, ~2 minutes)

1. Click **Use this template → Create a new repository** (top right on GitHub).
   Give it any name, keep it **public**.
2. Open `registry.config.json` in your new repository, click the pencil to
   edit, and change the `registryId` to something that is yours, e.g.
   `"jane.lenses"`. Commit the change.
3. That's it. Your registry lives at `https://github.com/<you>/<repo>`.

## Publish a lens

1. In yapyap, open your lens and choose **Publish** — it gives you a
   `lens.json` file.
2. In your registry repository, open the `lenses/` folder and use
   **Add file → Upload files** (or **Create new file** and paste). Put the
   file at `lenses/<your-lens-name>/lens.json` — for example
   `lenses/standup-summary/lens.json`.
3. Commit. Within a minute the **Build registry index** workflow updates
   `index.json` automatically. If your file has a problem, the workflow
   fails with a message telling you what to fix — nothing broken is
   published.

To update a lens later, upload the new `lens.json` over the old one (bump
the `version` inside — yapyap shows your users what changed before they
accept the update).

You can delete the example lens in `lenses/example-highlights/` whenever
you like.

## Let people install from your registry

Tell them to open yapyap → **Lenses → Add registry** and paste either your
repository URL or just `<you>/<repo>`. They'll see everything in your
catalogue and get notified when you ship updates.

## How it works (for the curious)

A registry is just two kinds of static files: `index.json` (the catalogue,
with a content hash per lens) and `lenses/<name>/lens.json` (the lens
itself). The workflow in `.github/workflows/build-index.yml` runs
`scripts/build-index.mjs` — a self-contained build of yapyap's
[`@yapyap/lens`](https://github.com/yapyap-app/yapyap) SDK — which
validates every lens against the same rules the app enforces on install,
then rewrites the catalogue. Nothing in a lens.json is executable: lenses
are declarative (a prompt, a schema, a layout), and the app re-verifies
everything before install.
