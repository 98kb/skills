# Shared eval harness

One driver, graded per skill. `harness/` holds the session driver, the
deterministic checker, the LLM-judge runner, the summarizer, and the
`run-all`/`promote` wrappers; `fixtures/` holds the upstream artifacts a
mid-pipeline skill's session starts from. Each skill keeps only its own
scenarios, rubric, config, and pattern block under
`skills/<area>/<skill>/evals/`.

Extracted from `to-vision`'s suite in #60. It lives at the repo root rather than
under `skills/product/` because it is not `product`'s to own — nothing in it
knows what a vision or a pitch is.

Grading semantics are ADR 0003's, unchanged by the extraction: mechanical checks
and judged content quality are separate mechanisms and are never blended.

## Wiring a skill in

Add `skills/<area>/<skill>/evals/eval.config.json`. The schema is documented in
full, with the reasoning for each key, at the top of `harness/config.mjs`. The
short version:

```json
{
  "skill": "to-vision",
  "slashCommand": "/to-vision",
  "artifact": {
    "path": "docs/product/vision.md",
    "additionalPaths": [],
    "storedFieldOrder": ["Vision Statement", "..."],
    "optionalFields": ["Additional Grounding"],
    "allowedFrontmatter": ["approved_by", "approved_at", "..."]
  },
  "workspace": { "seed": [{ "from": "evals/fixtures/vision-approved.md", "to": "docs/product/vision.md" }] },
  "sut": { "allowedTools": ["Read", "Write", "Edit", "Glob", "Grep"] },
  "founder": { "finishedWhen": "it has told you the vision is written or recorded, ..." },
  "checksModule": "checks.mjs",
  "judge": {
    "artifactLabel": "product vision artifact",
    "swapTestSubject": "vision",
    "criterionFields": { "1": ["Customer & Problem"], "...": [] }
  }
}
```

Then add `checks.mjs` beside it exporting the skill's pattern block —
`flags`, `baseQuestions`, `declinePatterns`, `forbiddenVocabulary`,
`fieldPresence`. All are optional; a check whose patterns are absent simply
does not run. See `skills/product/to-vision/evals/checks.mjs` for a worked
example with the false-failure lessons annotated.

The division is deliberate: `eval.config.json` holds plain data, `checks.mjs`
holds the regexes and vocabulary lists that cannot survive a round trip through
JSON. Anything structural — how a disclosure window is scanned, how attempts
are counted, how a decline is graded — is shared and must not be copied into a
skill's module.

## Finding the artifact when the skill picks the path

`artifact.path` is read as a **glob**, not a literal. `to-vision` writes to one
fixed path and every artifact used to look like that; `to-pitch` is the first
that doesn't. A pitch lives at `docs/product/pitches/<slug>/pitch.md` where the
slug is derived at runtime from the founder's own Problem and Solution sketch,
proposed by the skill and confirmed by them — so the harness cannot know it in
advance, and shouldn't: one vision fanning out into several pitches is the point,
and a fixed path would collapse them.

```json
"artifact": { "path": "docs/product/pitches/*/pitch.md" }
```

A path with no wildcard compiles to a pattern matching exactly itself, which is
why `"docs/product/vision.md"` keeps behaving as it always did and no existing
config needed touching. There is deliberately no second `pathGlob` key: one key
answering one question is fewer things to keep in sync than two that must be
mutually exclusive.

Supported wildcards are `*` and `?`, and **neither crosses a `/`**. `**` is
absent rather than half-implemented — the `a/**/b` must also match `a/b` rule is
exactly the kind of thing that silently mis-matches once and is never noticed.
`additionalPaths` and seeded destinations go through the same matcher, so a
stray-write exemption can be a pattern too.

**More than one match is a finding, not a choice.** A session that produced two
pitches has broken the one-run-one-bet rule, and picking one to grade would hide
it. So nothing chooses: `run-scenario.sh` records `artifact: "ambiguous"` in
`run.json` and copies nothing, and `check.mjs` fails `floor/artifact-unique`,
which is where a finding belongs because `check.mjs` is what produces the
verdict. That check is registered only when the configured path actually
contains a wildcard — with a literal path it could never fire, and an assertion
that cannot fail is noise in a report rather than reassurance.

The matching rule lives in one place, `harness/artifact.mjs`, which the bash
driver reaches as a CLI and the checker as an import — the same arrangement as
`seeds.mjs`, for the same reason. Resolving it in `find -path` on one side and JS
on the other is how the driver's idea of where the artifact is drifts from the
checker's stray-write exemption.

A mid-pipeline artifact also carries a one-hop `upstream` pointer. Name the
frontmatter key in `artifact.upstreamKey` (default `"upstream"`) and a scenario
asserts where it must land with `"upstreamResolvesTo": "docs/product/vision.md"`;
the checker resolves the stored relative path from the artifact's own directory.
A root artifact like a vision has nothing above it, omits the assertion, and the
check does not run.

## Seeding the workspace with upstream artifacts

`to-vision` is the pipeline root and starts from an empty workspace. Every skill
after it opens its session by reading the artifact upstream of it, so its
scenarios need that artifact already on disk before the first turn (#61).

**Where a seed is declared — two levels that compose.** `eval.config.json`'s
`workspace.seed` is the skill's default: what most of its scenarios need in
place. A scenario departs from that default in its own `expect.json`, using the
same shape:

```json
{
  "id": "04-upstream-gate-refusal",
  "workspace": {
    "seed": [{ "from": "evals/fixtures/vision-unapproved.md", "to": "docs/product/vision.md" }]
  }
}
```

The two lists are merged **by destination, and the scenario wins**. So the
refusal scenario above names the same `to` as the config default and swaps the
fixture under it; every other scenario inherits the approved vision by saying
nothing, and a scenario that declares no seed at all behaves exactly as it did
before any of this existed.

There is deliberately no syntax for *removing* a config-level seed. A suite that
needs some scenarios to start empty should leave the config default out and
declare the seed per scenario.

**Where fixtures live.** `from` resolves against the **repo root**, not the
skill's evals directory, so shared pipeline material can be named directly:
`evals/fixtures/vision-approved.md` and `evals/fixtures/vision-unapproved.md`.
An upstream artifact belongs to neither end of the hop — the vision `to-pitch`,
`to-roadmap` and `to-milestone` all interview against is one file, not three
divergent copies written by whoever needed one first. The two variants differ in
exactly one thing, the `approved_by`/`approved_at` frontmatter pair, because
that is the only thing an upstream-gate scenario discriminates on; any other
difference would confound it. Both are Dana Okafor's PT-clinic vision, taken
verbatim from `to-vision`'s recorded `01-cooperative-sharp` artifact, so the
fixture and that founder's persona agree.

A fixture that genuinely is one skill's own is still nameable — just spell it in
full: `skills/product/<skill>/evals/fixtures/...`.

**Seeded files are not stray writes.** They land in `workspace-files.txt` like
anything else, and `check.mjs` exempts exactly the destinations that were
seeded, resolved by the same merge — so seeding a fixture never reads as the
skill having written it, and a stray write beside a seeded fixture is still
caught.

The merge rule lives in one place, `harness/seeds.mjs`, which both the bash
driver (as a CLI) and the checker (as an import) go through. It was tempting to
let `run-scenario.sh` do it in `jq`; two copies of one rule is exactly how the
driver's idea of what was seeded drifts from the checker's.

## Running

Every entry point takes the skill's evals directory (or its `eval.config.json`)
as its first argument.

```bash
H=evals/harness; E=skills/product/to-vision/evals

$H/run-all.sh         $E                      # whole suite, both grades
$H/run-scenario.sh    $E 01-cooperative-sharp # one conversation
node $H/check.mjs     $E 01-cooperative-sharp # deterministic half
node $H/judge.mjs     $E 01-cooperative-sharp # LLM-judge half
node $H/summarize.mjs $E transcripts          # roll up, exit 1 on any failure
$H/promote.sh         $E --all                # scratch run → committed evidence

$H/run-scenario.sh    $E 01-cooperative-sharp --seed-only
node $H/seeds.mjs     $E 01-cooperative-sharp
node $H/artifact.mjs  $E /path/to/a/workspace  # which files are the artifact
```

`--seed-only` builds the SUT workspace — the skill plus this scenario's seeded
fixtures — prints where it is, and stops before the first model call, leaving the
workspace behind instead of cleaning it up. It touches no run directory. That is
how you inspect what a session would have started from without paying for a
session; `seeds.mjs` on its own answers the narrower question of which fixtures
a scenario resolved to, and `artifact.mjs` the question of which file in a
workspace the grader would treat as the artifact.

Requires `claude`, `node` (≥18) and `jq`. Knobs: `EVAL_MODEL` (default `opus`),
`EVAL_JUDGE_MODEL`, `EVAL_MAX_TURNS` (40), `EVAL_MAX_BUDGET_USD` (10),
`EVAL_OUT_DIR`.

## Regression-testing the harness itself

A full suite run costs real money and hours of model calls, so the cheap bar for
any change to this code is the committed transcripts: they are recorded real
runs, and re-grading them must reproduce their recorded verdicts exactly.

```bash
E=$PWD/skills/product/to-vision/evals
T=$(mktemp -d) && cp -r "$E/transcripts/." "$T/"
for s in $(ls "$E/scenarios"); do
  EVAL_OUT_DIR="$T/$s" node evals/harness/check.mjs "$E" "$s" >/dev/null
  diff "$E/transcripts/$s/deterministic.json" "$T/$s/deterministic.json"
done
```

Copy first — `check.mjs` writes `deterministic.json` into the run directory it
is pointed at, and the committed evidence is not something to overwrite. If a
verdict changes, that is the finding; do not edit the transcript to match.
