#!/usr/bin/env node
//
// Which file in the SUT workspace is the graded artifact.
//
//   import { artifactMatches, isPattern, pathMatcher } from "./artifact.mjs"
//                                               check.mjs — stray-write
//                                               exemptions, and the "exactly one
//                                               artifact" check
//   node artifact.mjs <evals-dir> <workspace>   run-scenario.sh — one
//                                               workspace-relative path per
//                                               matching file, ready to `cp`
//
// ── why this is not just a string compare ───────────────────────────────────
//
// `to-vision` writes to one fixed path, `docs/product/vision.md`, and every
// artifact in the pipeline used to look like that. `to-pitch` is the first that
// doesn't: a pitch lives at `docs/product/pitches/<slug>/pitch.md` where the
// slug is derived at runtime from the founder's own Problem and Solution
// sketch, and confirmed by them. The harness cannot know it in advance — which
// is the point of the design, since one vision fans out into several pitches
// and a fixed path would collapse them.
//
// So `artifact.path` is read as a **glob**, not a literal. A pattern with no
// wildcard in it compiles to a regex matching exactly itself, which is why
// to-vision's config keeps working untouched: `docs/product/vision.md` matches
// `docs/product/vision.md` and nothing else. There is deliberately no second
// `pathGlob` key to keep in sync with the first — one key answering one
// question ("where does the graded artifact live?") is fewer things to get
// wrong than two that must be mutually exclusive.
//
// Supported wildcards are `*` and `?`, and **neither crosses a `/`**. That is
// enough for every path shape in the pipeline (`pitches/*/pitch.md`,
// `pitches/*/milestones/*.md`) and it has no sharp edges. `**` is deliberately
// absent rather than half-implemented: the usual `**/` collapse rule — where
// `a/**/b` must also match `a/b` — is exactly the kind of thing that silently
// mis-matches once and is never noticed again.
//
// ── more than one match is a finding, not a choice ──────────────────────────
//
// A single session that produced two pitches has broken the one-run-one-bet
// rule, and picking one of them to grade would hide that. So nothing in this
// module chooses: it returns every match and lets the caller react.
// `run-scenario.sh` records the ambiguity in run.json and copies nothing;
// `check.mjs` fails `floor/artifact-unique`, which is where a finding belongs,
// because check.mjs is what produces the verdict.

import { readdirSync } from "node:fs";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.mjs";

// Workspace file lists arrive from `find .` with a leading "./" and from the
// filesystem walk below without one. Normalising both ends means a pattern is
// written the way a human would write the path, once.
const normalize = (p) => p.split(sep).join("/").replace(/^\.\//, "");

export const isPattern = (p) => /[*?]/.test(p);

function globToRegExp(pattern) {
  const source = [...normalize(pattern)]
    .map((c) => {
      if (c === "*") return "[^/]*";
      if (c === "?") return "[^/]";
      return c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
    })
    .join("");
  return new RegExp(`^${source}$`);
}

// A predicate over workspace-relative paths. Used for the graded artifact, for
// `additionalPaths`, and for seeded fixture destinations alike — a literal path
// is just a pattern with nothing to expand, so one code path covers all three.
export function pathMatcher(pattern) {
  const re = globToRegExp(pattern);
  return (candidate) => re.test(normalize(candidate));
}

// Every path in `paths` that is the graded artifact. Order is the caller's.
export function artifactMatches(config, paths) {
  return paths.filter(pathMatcher(config.artifact.path));
}

// The SUT's own skill install is not part of what it produced, so it is skipped
// here for the same reason run-scenario.sh's `find` skips it.
function walk(root, rel = "") {
  const out = [];
  for (const entry of readdirSync(join(root, rel), { withFileTypes: true })) {
    if (rel === "" && entry.name === ".claude") continue;
    const next = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walk(root, next));
    else if (entry.isFile()) out.push(next);
  }
  return out;
}

export function resolveArtifact(config, workspace) {
  return artifactMatches(config, walk(workspace));
}

// CLI half — run-scenario.sh is bash and would otherwise have to reimplement the
// glob rule in `shopt -s globstar` or `find -path`, which is exactly how the
// driver's idea of where the artifact is drifts from the checker's.
//
// Prints nothing and exits 0 when the session wrote no artifact, which is the
// correct outcome for the gate-refusal and hard-blocked scenarios. Exits 0 with
// several lines when several matched; counting them and reacting is the
// caller's job, not this module's.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [, , configArg, workspace] = process.argv;
  if (!configArg || !workspace) {
    console.error("usage: artifact.mjs <evals-dir|eval.config.json> <workspace-dir>");
    process.exit(2);
  }
  const config = loadConfig(configArg);
  for (const p of resolveArtifact(config, workspace)) console.log(p);
}
