#!/usr/bin/env node
//
// Controls: the two cheap bars that ask whether a suite's checks work at all.
//
//   node controls.mjs <evals-dir|eval.config.json> [scenario-id ...]
//   node controls.mjs <evals-dir> --negative     # one bar only
//   node controls.mjs <evals-dir> --positive
//
// A scenario says what correct behaviour looks like. Two questions sit either
// side of that, and running the scenario answers neither.
//
// *Would this scenario fail if the skill misbehaved?* The answer turned out to
// be no, repeatedly: an empty transcript scored 11 of 12 against a scenario
// whose whole subject is a refusal, and a run where the skill offered approval
// to a founder it must never offer approval to scored 12 of 12. Every check was
// green because every check was an absence, and nothing was absent harder than
// a session that never happened. A **negative control** is a synthetic run that
// is deliberately wrong, together with the check ids it must trip.
//
// *Would this scenario fail a skill that behaved?* Every check here is tuned
// close to a phrasing, and a phrasing check false-fails the first correct run
// that words it differently. Five of to-pitch's six scenarios have never been
// run live, so nothing else in the tree says these expectations pass a correct
// session. A **positive control** is a synthetic run that is deliberately
// right, and the assertion is that every check passes — all of them, which is
// why it names none of them.
//
//   scenarios/<scenario-id>/negative-controls/<name>.json
//   scenarios/<scenario-id>/positive-controls/<name>.json
//
// Both kinds are the same fixture schema and both take the same path: build the
// run into a temp directory, grade it with the real check.mjs against the
// scenario's real expect.json, then assert on the verdict. Only the assertion
// differs. They are one command on purpose — three positive controls already
// existed, in three different shapes, and nothing ran any of them, because the
// runner could only express "must fail". A suite where only half the bar is
// wired is how this whole class of bug started.
//
// Zero model calls, whole suite in seconds. That is why run-all.sh runs both
// before spending anything.
//
// The schema is documented in evals/README.md — that is the file the scenario
// authors read, and it is deliberately the only thing they need in order to add
// a control without touching this code.

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.mjs";
import { seedsFor } from "./seeds.mjs";

const HARNESS_DIR = dirname(fileURLToPath(import.meta.url));
const USAGE =
  "usage: controls.mjs <evals-dir|eval.config.json> [scenario-id ...]" +
  " [--negative|--positive]";

const [, , configArg, ...rest] = process.argv;
if (!configArg || configArg.startsWith("-")) {
  console.error(USAGE);
  process.exit(2);
}

const flags = rest.filter((a) => a.startsWith("--"));
const only = rest.filter((a) => !a.startsWith("--"));
const unknown = flags.filter((f) => f !== "--negative" && f !== "--positive");
if (unknown.length) {
  console.error(`unknown flag(s): ${unknown.join(", ")}\n${USAGE}`);
  process.exit(2);
}

const config = loadConfig(configArg);
const scenarios = readdirSync(config.scenariosDir)
  .filter((s) => existsSync(join(config.scenariosDir, s, "expect.json")))
  .filter((s) => only.length === 0 || only.includes(s))
  .sort();

// A glob artifact path has no literal spelling until a session picks its slug,
// and a control has no session. Substituting a fixed placeholder gives the
// control's workspace listing something the same matcher will accept, so
// `floor/artifact-unique` and the stray-write exemption behave as they would on
// a real run.
const placeholderArtifactPath = config.artifact.path
  .replace(/\*/g, "control")
  .replace(/\?/g, "x");

// The two bars differ in exactly two places: which key a control may declare,
// and what the verdict has to look like. Everything below this is shared,
// because a control built or graded differently from the other kind would be
// proving something about the runner rather than about the scenario.
const BARS = {
  negative: {
    dir: "negative-controls",
    noun: "negative control",
    tally: "all tripped the checks they name",

    // A control with nothing to prove is worse than no control: it costs a file
    // and a line in the report, and it makes the suite look guarded.
    reject(control) {
      if (!Array.isArray(control.mustFail) || control.mustFail.length === 0) {
        return (
          'no "mustFail" — a control that names no check it must trip asserts' +
          " nothing at all"
        );
      }
      return null;
    },

    summary: (control) => `${control.mustFail.length} check(s) must fail`,

    judge(control, report) {
      const byId = new Map(report.results.map((r) => [r.id, r]));
      const problems = [];
      for (const id of control.mustFail.filter((i) => !byId.has(i))) {
        problems.push(
          `mustFail names "${id}", which this run never registered. Either the` +
            " check id is wrong, or the expect.json key that would register it" +
            " is missing — an unregistered check cannot fail, so the control" +
            " proves nothing.",
        );
      }
      for (const id of control.mustFail.filter((i) => byId.get(i)?.pass === true)) {
        problems.push(
          `"${id}" PASSED against a run built to break it — ${byId.get(id).detail}`,
        );
      }
      return problems;
    },
  },

  positive: {
    dir: "positive-controls",
    noun: "positive control",
    tally: "passed every check their scenario registered",

    // There is no `mustPass`, and adding one would weaken the bar rather than
    // sharpen it: a partial list reads as the whole assertion, and the check it
    // omits is the one that false-fails. `mustFail` here is a control filed
    // under the wrong directory, which is worth saying out loud rather than
    // ignoring — a negative control that silently graded as a positive one
    // would assert the opposite of what it was written to assert.
    reject(control) {
      if (control.mustFail !== undefined) {
        return (
          'a positive control must not declare "mustFail" — it asserts that' +
          " *every* check passes. A run that must break a named check is a" +
          " negative control and belongs under negative-controls/."
        );
      }
      if (control.mustPass !== undefined) {
        return (
          'there is no "mustPass" key: a positive control asserts every check' +
          " passes, and a list of some of them would quietly narrow that to the" +
          " ones somebody remembered."
        );
      }
      return null;
    },

    summary: (control, report) => `${report.counts.total} check(s) must pass`,

    judge(control, report) {
      // A scenario whose expectations register nothing would pass this bar
      // trivially — 0 failures out of 0 checks — which is the same shape of
      // silent no-op the expect.json contract exists to remove.
      if (report.results.length === 0) {
        return [
          "the run graded zero checks, so passing them all asserts nothing" +
            " about this scenario",
        ];
      }
      return report.results
        .filter((r) => !r.pass)
        .map(
          (r) =>
            `"${r.id}" FAILED against a run built to be correct — ${r.detail}`,
        );
    },
  },
};

const selected = flags.length
  ? Object.keys(BARS).filter((b) => flags.includes(`--${b}`))
  : Object.keys(BARS);

// What a control does not spell out. The defaults are chosen so the smallest
// useful control — "here is a wrong artifact" — is three keys long: a control
// that has to restate the whole run directory to say one thing is a control
// nobody writes.
function buildRunDir(bar, scenario, control, dir) {
  const transcript = control.transcript ?? [];
  const hasArtifact = typeof control.artifact === "string";

  const workspaceFiles =
    control.workspaceFiles ??
    [
      ...seedsFor(config, scenario).map((s) => s.to),
      ...(hasArtifact ? [placeholderArtifactPath] : []),
    ].map((p) => (p.startsWith("./") ? p : `./${p}`));

  writeFileSync(join(dir, "transcript.json"), JSON.stringify(transcript, null, 2));
  writeFileSync(
    join(dir, "toolcalls.json"),
    JSON.stringify(control.toolcalls ?? [], null, 2),
  );
  writeFileSync(join(dir, "workspace-files.txt"), workspaceFiles.join("\n") + "\n");
  if (hasArtifact) writeFileSync(join(dir, "artifact.md"), control.artifact);

  writeFileSync(
    join(dir, "run.json"),
    JSON.stringify(
      {
        scenario,
        model: `${bar}-control`,
        turns: transcript.filter((t) => t.speaker === "agent").length,
        endedBecause: "founder-sentinel",
        artifact: hasArtifact ? "written" : "none",
        ...(control.run ?? {}),
      },
      null,
      2,
    ),
  );
}

// Grades through the CLI rather than by importing check.mjs, on purpose. The
// whole claim a control makes is "the real checker, given the real expect.json,
// grades this run *this* way" — so it goes through the same entry point
// run-all.sh does, and there is no second grading path to drift.
function grade(scenario, dir) {
  try {
    execFileSync("node", [join(HARNESS_DIR, "check.mjs"), config.configPath, scenario], {
      env: { ...process.env, EVAL_OUT_DIR: dir },
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    // 1 is the ordinary "some check failed" — the point of a negative control,
    // and the whole finding of a failing positive one, so the report is read
    // either way. 2 (unusable run) and 3 (expect.json breaks its contract) are
    // not verdicts and must not be read as one.
    if (err.status !== 1) {
      return { fatal: `check.mjs exited ${err.status}:\n${String(err.stderr).trim()}` };
    }
  }
  const report = join(dir, "deterministic.json");
  if (!existsSync(report)) return { fatal: "check.mjs wrote no deterministic.json" };
  return { report: JSON.parse(readFileSync(report, "utf8")) };
}

// One bar over every selected scenario. Both bars always run to completion
// before anything exits: "the controls failed" is a report to fix, and finding
// out about the second half of it on the next run is a second round trip for no
// reason.
function runBar(name) {
  const bar = BARS[name];
  const problems = [];
  let count = 0;

  console.log(`\n${bar.noun}s\n${"─".repeat(58)}`);

  for (const scenario of scenarios) {
    const controlsDir = join(config.scenariosDir, scenario, bar.dir);
    if (!existsSync(controlsDir)) continue;

    const files = readdirSync(controlsDir).filter((f) => f.endsWith(".json")).sort();
    if (files.length === 0) continue;

    console.log(`\n  ${scenario}`);

    for (const file of files) {
      const label = `${scenario}/${file.replace(/\.json$/, "")}`;
      const shortName = file.replace(/\.json$/, "");
      count++;

      const fail = (message) => {
        problems.push(`${label}: ${message}`);
        console.log(`    ERROR ${shortName}`);
      };

      let control;
      try {
        control = JSON.parse(readFileSync(join(controlsDir, file), "utf8"));
      } catch (err) {
        fail(`not valid JSON — ${err.message}`);
        continue;
      }

      const rejected = bar.reject(control);
      if (rejected) {
        fail(rejected);
        continue;
      }

      const dir = mkdtempSync(join(tmpdir(), `${name}ctl-${config.skill}-`));
      let outcome;
      try {
        mkdirSync(dir, { recursive: true });
        buildRunDir(name, scenario, control, dir);
        outcome = grade(scenario, dir);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }

      if (outcome.fatal) {
        fail(outcome.fatal);
        continue;
      }

      const found = bar.judge(control, outcome.report);
      for (const p of found) problems.push(`${label}: ${p}`);

      console.log(
        `    ${found.length === 0 ? "ok   " : "FAIL "} ${shortName.padEnd(38)} ` +
          `${bar.summary(control, outcome.report)}` +
          (control.description ? ` — ${control.description}` : ""),
      );
    }
  }

  console.log();
  if (count === 0) {
    console.log(`  no ${bar.noun}s found under ${config.scenariosDir}/*/${bar.dir}/`);
    return { count, problems };
  }
  if (problems.length === 0) {
    console.log(`  ${count} ${bar.noun}(s) ${bar.tally}`);
  }
  return { count, problems };
}

const outcomes = selected.map((name) => [name, runBar(name)]);
const problems = outcomes.flatMap(([, o]) => o.problems);
const total = outcomes.reduce((n, [, o]) => n + o.count, 0);

if (problems.length) {
  console.error(`\n  ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`    ✗ ${p}\n`);
  process.exit(1);
}

// No controls at all is not a pass, but it is not this runner's failure either:
// a suite that has written none has nothing here to be wrong about, and saying
// so is more useful than an exit code that reads as a broken control.
console.log(
  total === 0
    ? "\n  no controls found — this suite has not written any\n"
    : `\n  ${total} control(s) across ${selected.join(" and ")}: all good\n`,
);
