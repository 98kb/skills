# `to-pitch` eval suite

Six graded scenarios, two halves of a grade, one mandatory human spot-check.
Sibling of `skills/product/to-vision/evals/`, driven by the same shared harness
at `evals/harness/`.

`to-pitch` is a HITL conversational skill with no classic input/output boundary,
so a "test" here is a full scripted conversation checked against externally
observable results — the artifact's final state and the transcript/toolcall
stream — never internal reasoning steps or prompt wording (#59, Testing
Decisions). The seam is the `/to-pitch` conversational entry point itself.

> **`to-pitch` is not yet eval-complete.** The suite is written and statically
> verified; it has never been run. Running it costs real money and hours of
> model calls, and scenario 1's human spot-check
> (`transcripts/01-cooperative-sharp/human-spot-check.md`) is still `PENDING`
> and unsigned. See **Status** at the bottom for exactly what remains.

## What lives here

Only what is genuinely `to-pitch`'s (#60):

| Path | What it is |
|---|---|
| `eval.config.json` | the skill's parameters — slash command, artifact path pattern, seeded upstream fixture, stored field order, tool allowlist, rubric criterion→field map |
| `checks.mjs` | the deterministic checker's pattern block: every regex and vocabulary list matched against a `to-pitch` transcript or artifact |
| `scenarios/` | `persona.md` + `expect.json` per scenario |
| `rubric.md` | the judge's rubric, fed to the model verbatim |
| `transcripts/` | committed graded evidence |
| `runs/` | gitignored scratch |

Everything else — the session driver, the deterministic floor, the judge runner,
the summarizer, and the `run-all`/`promote` wrappers — is shared at
`evals/harness/`, along with the vision fixtures at `evals/fixtures/`.

## Running it

Every entry point takes this directory as its first argument and reads
`eval.config.json` from it; run these from the repo root.

```bash
H=evals/harness; E=skills/product/to-pitch/evals

$H/run-all.sh  $E                        # every scenario, both grades
$H/run-all.sh  $E 01-cooperative-sharp   # one scenario
$H/promote.sh  $E --all                  # commit the graded results
```

Per-stage, if you want to iterate on one piece:

```bash
$H/run-scenario.sh    $E 02a-evasive-recoverable   # drive the conversation
node $H/check.mjs     $E 02a-evasive-recoverable   # deterministic half
node $H/judge.mjs     $E 02a-evasive-recoverable   # LLM-judge half
node $H/summarize.mjs $E transcripts               # roll up, exit 1 on any failure
```

And without paying for a session at all:

```bash
$H/run-scenario.sh $E 04-upstream-gate-refusal --seed-only  # build the workspace, stop
node $H/seeds.mjs  $E 04-upstream-gate-refusal              # which fixtures it resolved to
```

Requires `claude`, `node` (≥18) and `jq` on PATH. Knobs, all optional:
`EVAL_MODEL` (default `opus`), `EVAL_JUDGE_MODEL`, `EVAL_MAX_TURNS` (default
40), `EVAL_MAX_BUDGET_USD` (default 10), `EVAL_OUT_DIR`.

A full suite run is well over a hundred model calls and takes a while. It is not
something to run on every commit — per #12 the suite reruns **when the skill's
design is materially revised**, not continuously.

## How a run works

`run-scenario.sh` drives two independent Claude Code sessions against each
other, one turn at a time: a **SUT** session in a throwaway temp workspace
containing only `.claude/skills/to-pitch/SKILL.md`, opened with the literal
`/to-pitch` slash command; and a **founder** session whose system prompt is the
scenario's `persona.md`, with all tools denied. The founder emits `<<<END>>>`
when the agent has clearly finished, which terminates the loop.

Two things differ from `to-vision`'s runs, and both are `to-pitch` being the
first mid-pipeline skill:

**The workspace is seeded.** `to-pitch` opens its session by reading the vision
upstream of it, so the workspace has `docs/product/vision.md` in place before the
first turn. `eval.config.json` seeds the **approved** fixture as the suite
default; scenario 04's `expect.json` names the same destination and swaps the
**unapproved** variant under it. The two fixtures differ in exactly one thing,
the `approved_by`/`approved_at` pair, so nothing else can confound the gate.
Seeded files are exempt from stray-write detection by the same merge the driver
copied them with — see `evals/README.md`.

**The artifact path is a pattern, not a path.** A pitch lands at
`docs/product/pitches/<slug>/pitch.md` where the slug is derived at runtime from
the founder's own Problem and Solution sketch and confirmed by them, so no config
can know it in advance. `eval.config.json` therefore carries
`"path": "docs/product/pitches/*/pitch.md"`, read as a glob by
`evals/harness/artifact.mjs`. Two files matching it is a graded failure
(`floor/artifact-unique`), not something the harness picks between: a session
that produced two pitches has broken the one-run-one-bet rule, and choosing one
to grade would hide that.

## The scenarios

Five from #25, plus the upstream-gate refusal added at spec time (#59).

| Scenario | Category | Correct outcome |
|---|---|---|
| `01-cooperative-sharp` | cooperative/sharp | Approved, zero flags, one assumption passing all four checks first try, no escalation anywhere |
| `02a-evasive-recoverable` | evasive/vague | Problem and Appetite both hit the cap, flagged and disclosed; Appetite recorded "small" as founder-unconfirmed; approved anyway |
| `02b-evasive-hard-blocked` | evasive/vague | Budget plus 2 replacement rounds exhausted; pitch fails the gate; approval never offered; no artifact |
| `03a-boundary-roadmap-creep` | boundary-testing | Declines "sequence this against my other two pitch ideas" and redirects to `to-roadmap`; no ordering content anywhere; session continues |
| `03b-boundary-execute-validation` | boundary-testing | Declines to execute; the test field stays a stated plan; zero prototype/research invocations; session continues |
| `04-upstream-gate-refusal` | boundary-testing | Refuses to start on an unapproved vision, names the missing approval, asks no interview question, writes nothing |

Each is a directory holding `persona.md` (the founder persona's system prompt)
and `expect.json` (machine-readable expectations consumed by `check.mjs` and
`judge.mjs`).

**Every persona is Dana Okafor**, because the seeded vision is hers. A repo holds
exactly one vision, that vision is written in her first person and approved under
her name, and the pitches shaped from it are therefore hers too. Giving each
scenario a different founder name would have made the approver of a pitch a
stranger to the vision it points one hop back at. The scenarios are told apart by
their id and their behaviour, not by a name.

**Pass bar** is #59's, not "an approval marker exists": a scenario passes when
behaviour matched *that scenario's* specified correct outcome —
approved-with-disclosed-flags (01, 02a), correctly gate-failed with no approval
and no artifact (02b), correctly declined-and-redirected with the session
continuing (03a, 03b), or correctly refused at the upstream gate (04). A skill
that wrongly approves 02b's founder, or that interviews 04's, is exactly the
failure this suite exists to catch.

Two personas are written to **not** defend the skill from itself: 03a's founder
goes along enthusiastically if the agent starts sequencing her three ideas, and
03b's accepts an "executed" survey result gratefully. 04's is written the same
way for the same reason — she answers normally if the agent interviews her
anyway, and never mentions the missing approval. A failure has to show up in the
transcript rather than being prevented by a cooperative persona. That is the
lesson `to-vision`'s first run banked.

## Grading

A two-part split, per ADR 0003 — mechanical checks and judged content quality
are separate mechanisms, never blended.

### Deterministic checks (shared `check.mjs` + local `checks.mjs`)

The shared floor from #12, applied to every scenario:

- **Approval-marker state** matches the scenario's expected outcome — plus
  approver identity, ISO 8601 timestamp, and no unexpected or empty frontmatter
  keys (a never-revised pitch omits `revised_at`/`revision_reason` entirely).
- **The artifact is unique**, and its `upstream` pointer resolves. `upstream:
  ../../vision.md`, resolved from the pitch's own directory, has to land on the
  seeded `docs/product/vision.md` — the pitch is the first artifact in the
  pipeline to carry a pointer at all, and a pointer that doesn't resolve is a
  broken chain rather than a cosmetic defect.
- **Composition compliance** (#6, #24) — zero `Skill` invocations (grilling and
  domain-modeling are *embedded*, not invoked), zero subagents, zero research
  tools, `CONTEXT.md`/`CONTEXT-MAP.md` never touched, and no file written beyond
  the pitch itself. The seeded vision is exempt; a stray write beside it is not.
- **Artifact fields** match the #21 schema — no extra sections, four mandatory
  fields present, stored field order preserved, no empty sections (an optional
  field the founder had nothing for is omitted, never written empty).

Scenario-specific layers on top: flag disclosure before the approval request and
the founder-unconfirmed Appetite (02a); approval never offered, plus the exact
candidate-round count (02b); escalation-cap counts (02a); boundary declines
followed by a *continuing* session (03a, 03b); no cross-bet sequencing content
(03a); the assumption's test still a stated plan and no tool that runs anything
(03b); no interview question and a refusal that names the missing approval (04);
the four assumption sub-fields on every recorded item; and no `to-roadmap` field
vocabulary anywhere.

These are string- and structure-level tests over prose, which is the honest
ceiling for "mechanical" on a conversational skill. The *algorithms* are shared —
the disclosure-window scan, the structural attempt count, the candidate-round
count, the decline loop — while every string they match lives in `checks.mjs`
here, so this skill's phrasing can be tuned without touching the harness or
another skill's suite.

**All four of `to-vision`'s banked false-failure lessons carry over**, each
against a pattern in `checks.mjs`:

- **Markdown is stripped before matching.** The skill emphasises heavily
  (`**Threshold:**`, "*before* we shape the solution"), which breaks naive
  word-boundary patterns.
- **Flag detection is negation-guarded.** A clean gate-check reads "No flagged
  fields — Problem, Appetite, Solution sketch and the assumption all pass",
  naming every field right beside the word "flagged".
- **Attempt counts are structural, not keyword tallies.** This matters more here
  than it did for `to-vision`: the falsifiability chain's three checks share no
  vocabulary with the base question *or with each other*, and they spend one
  shared 2-attempt budget that is a different counter from the per-field
  escalation cap. A keyword tally would read them as three unrelated topics.
- **Boundary pushes match the persona's imperative, not its topic.** A loose
  topic match once selected an unrelated turn in `to-vision`'s suite and graded
  the reply to the wrong question.

And one trap specific to this skill's mirror-image vocabulary check. `to-pitch`
must keep **`to-roadmap`'s** vocabulary out of a pitch — Strategic Frame, Moves,
Evidence Thresholds, Target Check-ins — and two of those four have innocent
everyday uses:

- **"threshold"** is elicited by the falsifiability chain for *every* assumption,
  and `**Threshold:**` is a literal line in `SKILL.md`'s artifact template. A
  naive `/\bthreshold\b/i` would fail every correct run. Only the full phrase
  **Evidence Threshold** is `to-roadmap`'s.
- **"moves"** is an ordinary English verb. Scoped to a `## Moves` section, the
  same way `to-vision` scopes the bare word "Problem" to `## Problem`.

For the same reason, 03a's no-sequencing check matches orderings *of bets against
each other* and deliberately not bare quarters or dates: an assumption's timebox
is legitimately "by the end of Q3", and a pattern that failed on that would fail
correct runs of every other scenario too.

### LLM judge (shared `judge.mjs`, local `rubric.md`)

Four criteria, none newly authored: #22's end-of-session 4-part gate-check,
reused verbatim, with criterion 4 expanding into the falsifiability checklist
(quantified / thresholded / not can't-fail / cheap + timeboxed). Tying the eval
bar to the production gate is deliberate — a separately-authored rubric would
drift from the bar it is supposed to measure.

The judge sees only the rubric and the artifact — never the persona, the
expectations, or the deterministic results — so it cannot grade to the answer.
Verdicts are structured output (`--json-schema`), so a malformed grade is a hard
failure rather than something to parse loosely.

The pass rule is not "all four must pass". Per #23, approving with disclosed
flags is legitimate, so a failing criterion is **excused** when the field it
grades was disclosed as flagged before approval was requested; a scenario passes
the judge half when nothing fails *unexcused*. `check.mjs` records the disclosed
flag set and `judge.mjs` applies the rule, which ties the eval bar to the
production gate instead of a hand-maintained list of expected failures.

Scenario 01 gets the strictest treatment for free: its fixture sets
`assertZeroFlags`, so nothing can be excused and all four must genuinely pass.

The judge runs only where an artifact exists. **02b and 04 produce none by
design** and skip it — for those two, "no artifact" *is* the graded outcome.

Run `check.mjs` before `judge.mjs` — `run-all.sh` does, and the judge warns if it
finds no `deterministic.json`.

### Human review

Reserved for spot-checks, not the default path (#12): triggered when the judge
returns low confidence, plus a **mandatory** spot-check of
`01-cooperative-sharp`'s full transcript before the skill counts as
eval-complete. That record lives at
`transcripts/01-cooperative-sharp/human-spot-check.md` and is the one part of
this suite an agent cannot sign off.

## Status

Written and statically verified under #69; **not yet run**. What remains before
`to-pitch` counts as eval-complete:

1. **Run the suite** — `evals/harness/run-all.sh skills/product/to-pitch/evals`,
   roughly `$10`/scenario of budget. Authorising that spend is the maintainer's
   call.
2. **Promote the results** into `transcripts/` and commit them as evidence.
3. **Sign the spot-check.** A human reads
   `transcripts/01-cooperative-sharp/transcript.md` end to end and fills in
   `human-spot-check.md`, which is currently `PENDING` and unsigned.

Until all three are done this directory is a specification of how `to-pitch`
will be graded, not evidence that it passed. Expect the first real run to
surface pattern tuning in `checks.mjs`, the way `to-vision`'s first run did —
that is what the annotated lessons in that file are for.
