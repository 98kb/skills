#!/usr/bin/env node
//
// LLM-judge grading for one to-vision eval run.
//
//   node judge.mjs <scenario-id>
//
// Grades the produced artifact against rubric.md — #16's composite sharpness
// test plus its three swap-tests, reused verbatim. The judge never sees the
// scenario's expectations, the persona, or the deterministic results; it only
// reads the rubric and the artifact, so it cannot grade to the answer.
//
// Reads  evals/rubric.md, evals/runs/<scenario-id>/artifact.md
// Writes evals/runs/<scenario-id>/judge.json
// Exits  0 if the verdict matches the scenario's expectation, 1 otherwise.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HARNESS = dirname(fileURLToPath(import.meta.url));
const EVALS = dirname(HARNESS);

const scenario = process.argv[2];
if (!scenario) {
  console.error("usage: judge.mjs <scenario-id>");
  process.exit(2);
}

const runDir = process.env.EVAL_OUT_DIR ?? join(EVALS, "runs", scenario);
const expected = JSON.parse(
  readFileSync(join(EVALS, "scenarios", scenario, "expect.json"), "utf8"),
);
const artifactPath = join(runDir, "artifact.md");

// Which vision fields each rubric criterion grades. A criterion that fails is
// excused when one of its fields was disclosed to the founder as flagged before
// approval was requested — #17: approving with visible flags is legitimate, so
// a known-and-declared weakness is not a suite failure. An *undisclosed* one is.
const CRITERION_FIELDS = {
  1: ["Customer & Problem", "Future State"],
  2: ["Grounding Insight"],
  3: ["Vision Pivot Trigger"],
  4: ["Vision Statement"],
  5: ["Future State"],
  6: ["Why Us / Why Now"],
};

// As in check.mjs: an expectation omitted from expect.json is not asserted. A
// diagnostic scenario omits `artifact` because which way it goes is the open
// question — so judge whatever was produced, and stay silent if nothing was.
if (expected.artifact !== undefined && expected.artifact !== "written") {
  const ok = !existsSync(artifactPath);
  const out = {
    scenario,
    judged: false,
    passed: ok,
    reason: ok
      ? "no artifact produced, as expected — the judge does not run for this scenario"
      : "an artifact was produced for a scenario that must not produce one",
  };
  writeFileSync(join(runDir, "judge.json"), JSON.stringify(out, null, 2) + "\n");
  console.log(`\njudge — ${scenario}\n\n  ${ok ? "PASS" : "FAIL"}  ${out.reason}\n`);
  process.exit(ok ? 0 : 1);
}

if (expected.artifact === undefined && !existsSync(artifactPath)) {
  const out = {
    scenario,
    judged: false,
    passed: true,
    reason: "no artifact produced; scenario is diagnostic and asserts neither way",
  };
  writeFileSync(join(runDir, "judge.json"), JSON.stringify(out, null, 2) + "\n");
  console.log(`\njudge — ${scenario}\n\n  SKIP  ${out.reason}\n`);
  process.exit(0);
}

if (!existsSync(artifactPath)) {
  const out = {
    scenario,
    judged: false,
    passed: false,
    reason: "no artifact to judge, but this scenario expects one",
  };
  writeFileSync(join(runDir, "judge.json"), JSON.stringify(out, null, 2) + "\n");
  console.log(`\njudge — ${scenario}\n\n  FAIL  ${out.reason}\n`);
  process.exit(1);
}

const rubric = readFileSync(join(EVALS, "rubric.md"), "utf8");
const artifact = readFileSync(artifactPath, "utf8");

const schema = {
  type: "object",
  properties: {
    criteria: {
      type: "array",
      minItems: 6,
      maxItems: 6,
      items: {
        type: "object",
        properties: {
          id: { type: "integer", minimum: 1, maximum: 6 },
          name: { type: "string" },
          verdict: { type: "string", enum: ["pass", "fail"] },
          rationale: { type: "string" },
        },
        required: ["id", "name", "verdict", "rationale"],
        additionalProperties: false,
      },
    },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
  },
  required: ["criteria", "confidence"],
  additionalProperties: false,
};

const prompt = `You are grading a product vision artifact against a fixed rubric.

Apply the rubric exactly as written. Do not add criteria, do not soften a
criterion because the artifact is otherwise good, and do not reward effort. If a
criterion's text would be satisfied by a competitor's vision equally well, that
criterion fails.

Set confidence to "low" if the artifact is genuinely borderline on two or more
criteria — a low-confidence verdict routes this run to human review.

===== RUBRIC =====

${rubric}

===== ARTIFACT UNDER GRADING =====

${artifact}
`;

const model = process.env.EVAL_JUDGE_MODEL ?? process.env.EVAL_MODEL ?? "opus";

let verdict;
try {
  const raw = execFileSync(
    "claude",
    [
      "-p",
      prompt,
      "--model",
      model,
      "--disable-slash-commands",
      "--disallowed-tools",
      "Bash", "Read", "Write", "Edit", "Glob", "Grep",
      "WebFetch", "WebSearch", "Task", "NotebookEdit", "TodoWrite", "Skill",
      "--json-schema",
      JSON.stringify(schema),
      "--output-format",
      "json",
      "--max-budget-usd",
      process.env.EVAL_MAX_BUDGET_USD ?? "10",
    ],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  );
  const envelope = JSON.parse(raw);
  verdict =
    typeof envelope.result === "string"
      ? JSON.parse(envelope.result)
      : envelope.result;
} catch (err) {
  console.error("judge invocation failed:", err.message);
  process.exit(2);
}

// The deterministic half records which fields the skill actually disclosed as
// flagged; the judge half decides whether the remaining weaknesses were owned.
let disclosedFlags = [];
const detPath = join(runDir, "deterministic.json");
if (existsSync(detPath)) {
  disclosedFlags = JSON.parse(readFileSync(detPath, "utf8")).disclosedFlags ?? [];
} else {
  console.error(
    "warning: deterministic.json not found — run check.mjs first, or every " +
      "criterion failure will be treated as undisclosed",
  );
}

const graded = verdict.criteria.map((c) => {
  const fields = CRITERION_FIELDS[c.id] ?? [];
  const excused =
    c.verdict === "fail" && fields.some((f) => disclosedFlags.includes(f));
  return { ...c, fields, excused };
});

const unexcused = graded.filter((c) => c.verdict === "fail" && !c.excused);
const matched = unexcused.length === 0;

const out = {
  scenario,
  judged: true,
  model,
  passed: matched,
  disclosedFlags,
  failures: graded.filter((c) => c.verdict === "fail").map((c) => c.id),
  excusedFailures: graded.filter((c) => c.excused).map((c) => c.id),
  unexcusedFailures: unexcused.map((c) => c.id),
  confidence: verdict.confidence,
  humanReviewRequired:
    verdict.confidence === "low" || expected.humanSpotCheckRequired === true,
  criteria: graded,
};
writeFileSync(join(runDir, "judge.json"), JSON.stringify(out, null, 2) + "\n");

console.log(`\njudge — ${scenario} (confidence: ${verdict.confidence})\n`);
for (const c of graded) {
  const mark = c.verdict === "pass" ? "PASS" : c.excused ? "FAIL*" : "FAIL";
  console.log(`  ${mark.padEnd(5)} ${String(c.id).padEnd(2)} ${c.name}`);
  console.log(`        ${c.rationale}`);
}
console.log(
  `\n  disclosed flags: [${disclosedFlags.join(", ") || "none"}]\n` +
    `  FAIL* = failed the rubric but the field was disclosed as flagged before approval (#17)\n` +
    `  unexcused failures: [${unexcused.map((c) => c.id).join(", ") || "none"}] — ${
      matched ? "PASS" : "FAIL"
    }\n`,
);
if (out.humanReviewRequired) {
  console.log("  → human review required for this run\n");
}

process.exit(matched ? 0 : 1);
