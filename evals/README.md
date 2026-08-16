# Shared eval harness

One driver, graded per skill. `harness/` holds the session driver, the
deterministic checker, the LLM-judge runner, the summarizer, and the
`run-all`/`promote` wrappers; each skill keeps only its own scenarios, rubric,
config, and pattern block under `skills/<area>/<skill>/evals/`.

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
  "workspace": { "seed": [{ "from": "fixtures/vision.md", "to": "docs/product/vision.md" }] },
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
```

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
