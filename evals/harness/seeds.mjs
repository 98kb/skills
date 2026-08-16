#!/usr/bin/env node
//
// Which upstream artifacts a scenario's SUT workspace must already contain
// before the session's first turn.
//
//   import { seedsFor } from "./seeds.mjs"      check.mjs — the destinations to
//                                               exempt from stray-write detection
//   node seeds.mjs <evals-dir> <scenario-id>    run-scenario.sh — one
//                                               "<absolute-from>\t<to>" line per
//                                               seed, ready to `cp`
//
// `to-vision` is the pipeline root and seeds nothing; every skill after it opens
// its session by reading the artifact upstream of it, so without a seeded
// workspace a cross-artifact skill cannot be evaluated at all (#61).
//
// ── where a seed is declared ────────────────────────────────────────────────
//
// Two levels, and they compose:
//
//   eval.config.json   "workspace": { "seed": [ {from, to}, ... ] }
//                      the skill's default — what *most* of its scenarios need
//                      in place (for to-pitch, an approved vision).
//
//   scenarios/<id>/    "workspace": { "seed": [ {from, to}, ... ] }
//   expect.json        this scenario's departure from that default.
//
// The two lists are merged **by destination**, and the scenario wins. So the
// upstream-gate refusal scenario names the same `to` as the config default and
// points it at the unapproved variant, and every other scenario inherits the
// approved one by saying nothing. Merging rather than replacing is what keeps a
// scenario from having to restate seeds it doesn't care about — a scenario that
// declares no seed at all behaves exactly as it did before this existed.
//
// There is deliberately no way to *remove* a config-level seed from a scenario.
// A suite that needs some scenarios to start with an empty workspace should
// leave the config default out and declare the seed per scenario instead;
// inventing a subtraction syntax would buy one line of config at the cost of a
// merge rule nobody can hold in their head.
//
// ── where a fixture lives ───────────────────────────────────────────────────
//
// `from` resolves against the **repo root**, not the skill's evals directory,
// because an upstream artifact belongs to neither end of the hop. The vision
// that `to-pitch`, `to-roadmap` and `to-milestone` all interview against is one
// file at `evals/fixtures/`, not three divergent copies of a vision written by
// whoever needed one first. A fixture that genuinely is one skill's own is
// still nameable — `skills/product/<skill>/evals/fixtures/...` — just spelled
// in full.

import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig, requireArgs } from "./config.mjs";

// The harness is <repo>/evals/harness, so the repo root is two levels up.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

function scenarioSeed(config, scenario) {
  const expectPath = join(config.scenariosDir, scenario, "expect.json");
  if (!existsSync(expectPath)) return [];
  return JSON.parse(readFileSync(expectPath, "utf8")).workspace?.seed ?? [];
}

// Merged config-then-scenario, keyed on `to` so the later one wins. A Map keeps
// the config default's position for destinations the scenario only overrides,
// which makes the seeded-file log read the same across a suite.
export function seedsFor(config, scenario) {
  const merged = new Map();
  for (const seed of [
    ...(config.workspace?.seed ?? []),
    ...scenarioSeed(config, scenario),
  ]) {
    merged.set(seed.to, { ...seed, source: seedSource(seed) });
  }
  return [...merged.values()];
}

export function seedSource(seed) {
  return isAbsolute(seed.from) ? seed.from : join(REPO_ROOT, seed.from);
}

// CLI half — run-scenario.sh is bash and would otherwise have to reimplement the
// merge rule in jq, which is exactly how two copies of one rule drift apart.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [, , configArg, scenario] = process.argv;
  requireArgs("seeds.mjs", configArg, scenario);
  const config = loadConfig(configArg);

  const seeds = seedsFor(config, scenario);
  // Checked here rather than left to `cp`, so a typo'd fixture path fails with
  // the path it was resolved from instead of a bare "No such file".
  const missing = seeds.filter((s) => !existsSync(s.source));
  if (missing.length) {
    for (const s of missing) {
      console.error(`seed fixture not found: ${s.from} (resolved to ${s.source})`);
    }
    process.exit(2);
  }

  for (const s of seeds) console.log(`${s.source}\t${s.to}`);
}
