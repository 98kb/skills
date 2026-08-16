#!/usr/bin/env node
//
// Roll the per-scenario grades up into one suite result.
//
//   node summarize.mjs <evals-dir|eval.config.json> [runs|transcripts]
//                                                    (default: transcripts)
//
// Writes <evals>/<dir>/summary.json and prints the table. Exits 1 if any
// scenario failed, so this can gate CI.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { loadConfig } from "./config.mjs";

const [, , configArg, which] = process.argv;
if (!configArg) {
  console.error("usage: summarize.mjs <evals-dir|eval.config.json> [runs|transcripts]");
  process.exit(2);
}

const config = loadConfig(configArg);
const dir = join(config.evalsDir, which ?? "transcripts");
const scenarios = readdirSync(config.scenariosDir).sort();

const read = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);

const results = scenarios.map((s) => {
  const det = read(join(dir, s, "deterministic.json"));
  const jud = read(join(dir, s, "judge.json"));
  const run = read(join(dir, s, "run.json"));
  const exp = read(join(config.scenariosDir, s, "expect.json"));
  const ok = Boolean(det?.passed && jud?.passed);
  // A diagnostic scenario has no agreed correct outcome yet — it exists to
  // produce a transcript for an open design question, so it reports but never
  // gates. Graduate it to an ordinary scenario once that question is settled.
  const diagnostic = Boolean(exp?.diagnostic);
  return {
    scenario: s,
    diagnostic,
    turns: run?.turns ?? null,
    artifact: run?.artifact ?? null,
    deterministic: det
      ? { passed: det.passed, ...det.counts }
      : { passed: false, note: "not run" },
    disclosedFlags: det?.disclosedFlags ?? [],
    judge: jud
      ? {
          passed: jud.passed,
          judged: jud.judged,
          failures: jud.failures ?? [],
          excusedFailures: jud.excusedFailures ?? [],
          unexcusedFailures: jud.unexcusedFailures ?? [],
          confidence: jud.confidence ?? null,
        }
      : { passed: false, note: "not run" },
    humanReviewRequired: jud?.humanReviewRequired ?? false,
    result: diagnostic ? "diag" : ok ? "pass" : "fail",
  };
});

const passed = results.every((r) => r.result !== "fail");
const model = read(join(dir, scenarios[0], "run.json"))?.model ?? null;

writeFileSync(
  join(dir, "summary.json"),
  JSON.stringify({ model, passed, results }, null, 2) + "\n",
);

for (const r of results) {
  console.log(
    `  ${r.result.toUpperCase().padEnd(4)} ${r.scenario.padEnd(34)} ` +
      `turns=${String(r.turns ?? "-").padEnd(3)} ` +
      `deterministic=${r.deterministic.passed} (${r.deterministic.total ?? 0}) ` +
      `judge=${r.judge.passed}` +
      (r.disclosedFlags.length ? `  flags: ${r.disclosedFlags.join(", ")}` : ""),
  );
}
console.log(`\n  suite ${passed ? "PASSED" : "FAILED"} — ${join(dir, "summary.json")}`);

const diagnostics = results.filter((r) => r.diagnostic);
if (diagnostics.length) {
  console.log(
    `  note: ${diagnostics.map((r) => r.scenario).join(", ")} ` +
      "reported but not gated — diagnostic, no agreed correct outcome yet. " +
      "Read the transcript.",
  );
}

// Which scenarios need a human is a property of the runs, not of any one
// skill's suite — name them rather than pointing at a hardcoded path.
const pendingSpotCheck = results.filter((r) => r.humanReviewRequired);
if (pendingSpotCheck.length) {
  console.log(
    "  note: human review required — see " +
      pendingSpotCheck
        .map((r) => join(dir, r.scenario, "human-spot-check.md"))
        .join(", ") +
      "\n",
  );
}

process.exit(passed ? 0 : 1);
