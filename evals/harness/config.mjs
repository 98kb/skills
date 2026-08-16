//
// Locate and load a skill's eval config.
//
// Every harness entry point is handed the skill's evals directory (or the
// config file inside it) as its first argument — the harness itself is shared,
// so it can never infer which skill it is grading from its own location the way
// the to-vision-only version did.
//
// ── eval.config.json ────────────────────────────────────────────────────────
//
// {
//   "skill":        "to-vision",              directory name the SKILL.md is
//                                             installed under in the SUT
//                                             workspace, and the temp-dir prefix
//   "slashCommand": "/to-vision",             the literal opener; these skills
//                                             are disable-model-invocation, so
//                                             it is the only way into a session
//   "artifact": {
//     "path":            "docs/product/vision.md",   graded artifact, relative
//                                                    to the SUT workspace
//     "additionalPaths": [],                  other files the skill may
//                                             legitimately write; anything else
//                                             in the workspace is a stray write
//     "storedFieldOrder": ["Vision Statement", ...],  the schema: which `##`
//                                             sections may appear, in the order
//                                             they must be stored in
//     "optionalFields":   ["Additional Grounding"],   subset of the above that
//                                             may be absent; the rest are
//                                             mandatory
//     "allowedFrontmatter": ["approved_by", "approved_at", ...]
//   },
//   "workspace": {
//     "seed": [ { "from": "fixtures/vision-approved.md",
//                 "to":   "docs/product/vision.md" } ]
//                                             upstream artifacts the SUT must
//                                             find already present. `from` is
//                                             relative to the evals dir, `to` to
//                                             the workspace. Seeded paths are
//                                             exempt from stray-write detection
//                                             — they were there before the
//                                             session started.
//   },
//   "sut":      { "allowedTools": ["Read", "Write", "Edit", "Glob", "Grep"] },
//   "founder":  { "finishedWhen": "..." },    the one skill-specific clause of
//                                             the founder's stop rule
//   "checksModule": "checks.mjs",             per-skill pattern block, resolved
//                                             relative to the evals dir
//   "judge": {
//     "artifactLabel":   "product vision artifact",   names the thing in the
//                                                     judge prompt
//     "swapTestSubject": "vision",              what a *competitor's* version of
//                                               it is called, in the prompt's
//                                               swap-test sentence
//     "criterionFields": { "1": ["Customer & Problem", "Future State"], ... }
//                                             rubric criterion → the artifact
//                                             fields it grades. Its size also
//                                             fixes how many criteria the
//                                             judge's output schema demands.
//   }
// }
//
// Everything here is plain data. Regexes and vocabulary lists — the parts that
// genuinely differ per skill and cannot survive a round trip through JSON —
// live in the checks module instead.

import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";

const REQUIRED = ["skill", "slashCommand", "artifact"];

// Accepts either the evals directory or the config file itself, because both
// read naturally at a call site and there is no ambiguity between them.
export function loadConfig(arg) {
  if (!arg) return null;
  const target = resolve(process.cwd(), arg);
  if (!existsSync(target)) {
    console.error(`no such path: ${target}`);
    process.exit(2);
  }
  const isDir = statSync(target).isDirectory();
  const configPath = isDir ? join(target, "eval.config.json") : target;
  const evalsDir = isDir ? target : dirname(target);

  if (!existsSync(configPath)) {
    console.error(`no eval.config.json at ${configPath}`);
    process.exit(2);
  }

  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const missing = REQUIRED.filter((k) => config[k] === undefined);
  if (missing.length) {
    console.error(`${configPath} is missing: ${missing.join(", ")}`);
    process.exit(2);
  }

  const artifact = config.artifact;
  const storedFieldOrder = artifact.storedFieldOrder ?? [];
  const optionalFields = artifact.optionalFields ?? [];

  return {
    ...config,
    evalsDir,
    configPath,
    // The skill's own directory — SKILL.md sits beside evals/.
    skillDir: dirname(evalsDir),
    scenariosDir: join(evalsDir, "scenarios"),
    rubricPath: join(evalsDir, "rubric.md"),
    artifact: {
      additionalPaths: [],
      allowedFrontmatter: [],
      ...artifact,
      storedFieldOrder,
      optionalFields,
      mandatoryFields: storedFieldOrder.filter(
        (f) => !optionalFields.includes(f),
      ),
    },
    workspace: { seed: [], ...(config.workspace ?? {}) },
    sut: { allowedTools: ["Read", "Write", "Edit", "Glob", "Grep"], ...(config.sut ?? {}) },
    judge: {
      artifactLabel: "artifact",
      swapTestSubject: config.judge?.artifactLabel ?? "artifact",
      criterionFields: {},
      ...(config.judge ?? {}),
    },
  };
}

// The per-skill pattern block. Absent is legal — a skill can be graded on the
// shared floor alone — so this resolves to an empty module rather than failing.
export async function loadChecks(config) {
  const rel = config.checksModule;
  if (!rel) return {};
  const path = isAbsolute(rel) ? rel : join(config.evalsDir, rel);
  if (!existsSync(path)) {
    console.error(`checksModule ${path} not found`);
    process.exit(2);
  }
  return await import(`file://${path}`);
}

// `usage:` line shared by every .mjs entry point, so the argument contract is
// stated the same way everywhere.
export function requireArgs(name, arg, scenario) {
  if (!arg || !scenario) {
    console.error(`usage: ${name} <evals-dir|eval.config.json> <scenario-id>`);
    process.exit(2);
  }
}

// Where a scenario's run outputs live. EVAL_OUT_DIR overrides it wholesale,
// which is how a *committed transcript* gets re-checked: point it at
// transcripts/<scenario> and the checker grades the recorded run instead of a
// fresh one. That is the regression bar for any change to this harness.
export function runDirFor(config, scenario) {
  return process.env.EVAL_OUT_DIR ?? join(config.evalsDir, "runs", scenario);
}
