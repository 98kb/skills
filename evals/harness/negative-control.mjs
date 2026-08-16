#!/usr/bin/env node
//
// Negative controls: prove a scenario's checks can fail.
//
//   node negative-control.mjs <evals-dir|eval.config.json> [scenario-id ...]
//
// A scenario says what correct behaviour looks like. Nothing in this suite ever
// asked the other question — *would this scenario fail if the skill
// misbehaved?* — and the answer turned out to be no, repeatedly: an empty
// transcript scored 11 of 12 against a scenario whose whole subject is a
// refusal, and a run where the skill offered approval to a founder it must
// never offer approval to scored 12 of 12. Every check was green because every
// check was an absence, and nothing was absent harder than a session that never
// happened.
//
// So a scenario may carry synthetic runs that are *deliberately wrong*, each
// naming the checks it must trip:
//
//   scenarios/<scenario-id>/negative-controls/<name>.json
//
// This builds each one into a temp run directory, grades it with the real
// check.mjs against the scenario's real expect.json, and asserts that every
// check id under `mustFail` actually reported failure. A control that passes
// where it should have failed, or that names a check id the run never
// registered, exits this non-zero.
//
// Zero model calls, whole suite in seconds. It is the cheap bar that should
// have existed from the start, so run-all.sh runs it before spending anything.
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

const [, , configArg, ...only] = process.argv;
if (!configArg) {
  console.error(
    "usage: negative-control.mjs <evals-dir|eval.config.json> [scenario-id ...]",
  );
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

// What a control does not spell out. The defaults are chosen so the smallest
// useful control — "here is a wrong artifact" — is three keys long: a control
// that has to restate the whole run directory to say one thing is a control
// nobody writes.
function buildRunDir(scenario, control, dir) {
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
        model: "negative-control",
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
// fails this run" — so it goes through the same entry point run-all.sh does,
// and there is no second grading path to drift.
function grade(scenario, dir) {
  try {
    execFileSync("node", [join(HARNESS_DIR, "check.mjs"), config.configPath, scenario], {
      env: { ...process.env, EVAL_OUT_DIR: dir },
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    // 1 is the ordinary "some check failed", which is the point of a control.
    // 2 (unusable run) and 3 (expect.json breaks its contract) are not verdicts
    // and must not be read as one.
    if (err.status !== 1) {
      return { fatal: `check.mjs exited ${err.status}:\n${String(err.stderr).trim()}` };
    }
  }
  const report = join(dir, "deterministic.json");
  if (!existsSync(report)) return { fatal: "check.mjs wrote no deterministic.json" };
  return { report: JSON.parse(readFileSync(report, "utf8")) };
}

const problems = [];
let controlCount = 0;

for (const scenario of scenarios) {
  const controlsDir = join(config.scenariosDir, scenario, "negative-controls");
  if (!existsSync(controlsDir)) continue;

  const files = readdirSync(controlsDir).filter((f) => f.endsWith(".json")).sort();
  if (files.length === 0) continue;

  console.log(`\n  ${scenario}`);

  for (const file of files) {
    const name = file.replace(/\.json$/, "");
    const label = `${scenario}/${name}`;
    controlCount++;

    let control;
    try {
      control = JSON.parse(readFileSync(join(controlsDir, file), "utf8"));
    } catch (err) {
      problems.push(`${label}: not valid JSON — ${err.message}`);
      console.log(`    ERROR ${name}`);
      continue;
    }

    // A control with nothing to prove is worse than no control: it costs a file
    // and a line in the report, and it makes the suite look guarded.
    if (!Array.isArray(control.mustFail) || control.mustFail.length === 0) {
      problems.push(
        `${label}: no "mustFail" — a control that names no check it must trip` +
          " asserts nothing at all",
      );
      console.log(`    ERROR ${name}`);
      continue;
    }

    const dir = mkdtempSync(join(tmpdir(), `negctl-${config.skill}-`));
    let outcome;
    try {
      mkdirSync(dir, { recursive: true });
      buildRunDir(scenario, control, dir);
      outcome = grade(scenario, dir);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }

    if (outcome.fatal) {
      problems.push(`${label}: ${outcome.fatal}`);
      console.log(`    ERROR ${name}`);
      continue;
    }

    const byId = new Map(outcome.report.results.map((r) => [r.id, r]));
    const notRegistered = control.mustFail.filter((id) => !byId.has(id));
    const wronglyPassed = control.mustFail.filter((id) => byId.get(id)?.pass === true);

    for (const id of notRegistered) {
      problems.push(
        `${label}: mustFail names "${id}", which this run never registered.` +
          " Either the check id is wrong, or the expect.json key that would" +
          " register it is missing — an unregistered check cannot fail, so the" +
          " control proves nothing.",
      );
    }
    for (const id of wronglyPassed) {
      problems.push(
        `${label}: "${id}" PASSED against a run built to break it —` +
          ` ${byId.get(id).detail}`,
      );
    }

    const ok = notRegistered.length === 0 && wronglyPassed.length === 0;
    console.log(
      `    ${ok ? "ok   " : "FAIL "} ${name.padEnd(38)} ` +
        `${control.mustFail.length} check(s) must fail` +
        (control.description ? ` — ${control.description}` : ""),
    );
  }
}

console.log();
if (controlCount === 0) {
  console.log(
    `  no negative controls found under ${config.scenariosDir}/*/negative-controls/\n`,
  );
  process.exit(0);
}

if (problems.length) {
  console.error(`  ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`    ✗ ${p}\n`);
  process.exit(1);
}

console.log(`  ${controlCount} negative control(s) all tripped the checks they name\n`);
