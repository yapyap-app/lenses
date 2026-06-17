/**
 * Compile the TypeScript-authored lenses in `src/` into the static
 * registry artifacts:
 *
 *   - `lenses/<path>/lens.json` — the `{formatVersion, listing, lens}`
 *     envelope, carrying the author's optional precomputed `view`
 *     (ADR-0032 generates one at runtime only when none is shipped).
 *   - `index.json` — the catalogue with a `sha256(canonical lens.json)`
 *     per entry.
 *
 * `--check` re-renders in memory and diffs against the committed files,
 * exiting non-zero on drift (CI gate) without writing.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildLensRegistryIndex,
  serialiseLensEnvelope,
  serialiseLensRegistryIndex,
} from "@yapyap/lens";

import { OFFICIAL_REGISTRY_ID, officialLenses } from "../src/index";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

async function render(): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  for (const source of officialLenses) {
    files.set(
      join(ROOT, "lenses", source.path, "lens.json"),
      serialiseLensEnvelope(source.envelope),
    );
  }
  const index = await buildLensRegistryIndex(OFFICIAL_REGISTRY_ID, officialLenses);
  files.set(join(ROOT, "index.json"), serialiseLensRegistryIndex(index));
  return files;
}

function rel(path: string): string {
  return path.slice(ROOT.length + 1);
}

async function main(): Promise<void> {
  const files = await render();
  const check = process.argv.includes("--check");

  if (check) {
    let stale = false;
    for (const [path, content] of files) {
      let existing = "";
      try {
        existing = readFileSync(path, "utf8");
      } catch {
        existing = "";
      }
      if (existing !== content) {
        stale = true;
        console.error(`stale: ${rel(path)}`);
      }
    }
    if (stale) {
      console.error("registry artifacts are stale — run `bun run build`");
      process.exit(1);
    }
    console.log(`registry artifacts up to date (${files.size} file(s))`);
    return;
  }

  for (const [path, content] of files) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  console.log(`wrote ${files.size} registry file(s)`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
