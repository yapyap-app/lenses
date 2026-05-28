#!/usr/bin/env node
// Walk lenses/, compute sha256 of each canonical lens.json, rewrite index.json.
// --check: verify index.json matches without writing. Exit 1 on mismatch.
//
// Canonicalisation: JSON.stringify with sorted object keys, recursive. Arrays
// preserve order. Matches the consumer-side hash so installed Lens ids match.

import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LENSES_DIR = join(ROOT, "lenses");
const INDEX_PATH = join(ROOT, "index.json");
const REGISTRY_ID = "yapyap.official";

function canonicalise(value) {
  if (Array.isArray(value)) return value.map(canonicalise);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      out[key] = canonicalise(value[key]);
    }
    return out;
  }
  return value;
}

function sha256Canonical(obj) {
  const bytes = JSON.stringify(canonicalise(obj));
  return "sha256-" + createHash("sha256").update(bytes).digest("hex");
}

async function listLensDirs() {
  const entries = await readdir(LENSES_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

async function loadLens(path) {
  const lensPath = join(LENSES_DIR, path, "lens.json");
  const raw = await readFile(lensPath, "utf8");
  return JSON.parse(raw);
}

async function buildIndex() {
  const paths = await listLensDirs();
  const lenses = [];
  for (const path of paths) {
    const envelope = await loadLens(path);
    if (envelope.formatVersion !== 1) {
      throw new Error(
        `lenses/${path}/lens.json: unsupported formatVersion ${envelope.formatVersion} (expected 1)`,
      );
    }
    const lensFile = await stat(join(LENSES_DIR, path, "lens.json"));
    lenses.push({
      path,
      name: envelope.listing.name,
      description: envelope.listing.description,
      version: envelope.lens.version,
      updatedAt: lensFile.mtime.toISOString(),
      hash: sha256Canonical(envelope),
    });
  }
  lenses.sort((a, b) => a.path.localeCompare(b.path));
  return { registryId: REGISTRY_ID, lenses };
}

function stableStringify(obj) {
  return JSON.stringify(canonicalise(obj), null, 2) + "\n";
}

async function main() {
  const check = process.argv.includes("--check");
  const built = await buildIndex();
  const serialised = stableStringify(built);
  if (check) {
    const existing = await readFile(INDEX_PATH, "utf8");
    if (existing !== serialised) {
      console.error("index.json is stale — run `node scripts/build-index.mjs`");
      process.exit(1);
    }
    console.log("index.json is up to date");
    return;
  }
  await writeFile(INDEX_PATH, serialised);
  console.log(`wrote index.json with ${built.lenses.length} lens(es)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
