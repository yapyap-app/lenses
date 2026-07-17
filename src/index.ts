/**
 * The official yapyap Lens Registry, authored in TypeScript.
 *
 * Each `*.lens.ts` declares a lens via `defineLens` from `@yapyap/lens`.
 * `scripts/build.ts` compiles these sources into the static
 * `lenses/<path>/lens.json` + `index.json` artifacts a Registry serves
 * over HTTP (and that the app bundles for offline preinstall). The
 * generated artifacts are the wire contract; these sources are their
 * single source of truth.
 */

import type { OfficialLensSource } from "@yapyap/lens";

import { actions } from "./actions.lens";
import { decisions } from "./decisions.lens";
import { summary } from "./summary.lens";

/** Stable namespace this registry publishes under (see `index.json`). */
export const OFFICIAL_REGISTRY_ID = "yapyap.official";

/** Every lens in the official registry. */
export const officialLenses: readonly OfficialLensSource[] = [
  actions,
  decisions,
  summary,
];

export { actions, decisions, summary };
