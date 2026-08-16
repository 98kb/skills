#!/usr/bin/env node
//
// Roll the per-scenario grades up into one suite result.
//
//   node summarize.mjs [runs|transcripts]     (default: transcripts)
//
// Writes <dir>/summary.json and prints the table. Exits 1 if any scenario
// failed, so this can gate CI.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const EVALS = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = join(EVALS, process.argv[2] ?? "transcripts");
const scenarios = readdirSync(join(EVALS, "scenarios")).sort();

const read = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);

const results = scenarios.map((s) => {
  const det = read(join(dir, s, "deterministic.json"));
  const jud = read(join(dir, s, "judge.json"));
  const run = read(join(dir, s, "run.json"));
  const ok = Boolean(det?.passed && jud?.passed);
  return {
    scenario: s,
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
    result: ok ? "pass" : "fail",
  };
});

const passed = results.every((r) => r.result === "pass");
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

const pendingSpotCheck = results.some((r) => r.humanReviewRequired);
if (pendingSpotCheck) {
  console.log(
    "  note: at least one run requires human review — see " +
      "transcripts/01-cooperative-sharp/human-spot-check.md\n",
  );
}

process.exit(passed ? 0 : 1);
