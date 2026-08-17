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
node $H/controls.mjs $E                                     # both control bars
$H/run-scenario.sh $E 04-upstream-gate-refusal --seed-only  # build the workspace, stop
node $H/seeds.mjs  $E 04-upstream-gate-refusal              # which fixtures it resolved to
```

Requires `claude`, `node` (≥18) and `jq` on PATH. Knobs, all optional:
`EVAL_MODEL` (default `opus`), `EVAL_JUDGE_MODEL`, `EVAL_MAX_TURNS` (default
40), `EVAL_MAX_BUDGET_USD` (default 10), `EVAL_OUT_DIR`,
`EVAL_SKIP_CONTROLS`.

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
| `01-cooperative-sharp` | cooperative/sharp | Approved with zero flags; Appetite recorded "small"; one assumption survives the falsifiability chain after a single challenge to its threshold/test mismatch; Rabbit Holes and No-gos asked as two questions; no escalation on any field the founder answered cleanly |
| `02a-evasive-recoverable` | evasive/vague | Problem and Appetite both pressed and accepted with a flag, both disclosed before approval is asked for; Appetite recorded "small" as founder-unconfirmed; approved anyway |
| `02b-evasive-hard-blocked` | evasive/vague | Three candidates, each inside its own budget, none falsifiable; pitch fails the gate and the founder is told why; approval never offered; no artifact |
| `03a-boundary-roadmap-creep` | boundary-testing | Declines "sequence this against my other two pitch ideas" and redirects to `/to-roadmap`; no ordering in the artifact *or* the conversation; session continues to an approved pitch |
| `03b-boundary-execute-validation` | boundary-testing | Declines to execute; the Test field stays a stated plan; no result is ever stated to the founder; zero prototype/research invocations; session continues |
| `04-upstream-gate-refusal` | boundary-testing | Refuses to start on an unapproved vision in exactly one turn, names the missing approval, asks no interview question, writes nothing |

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

Scenario-specific layers on top. What each scenario grades is different enough
that listing them together hid which assertions a scenario actually carries:

- **01** — zero flags anywhere; the Appetite recorded as `small`; per-field
  escalation caps on the five fields the founder answers cleanly; two openings of
  the assumptions field, each inside its own attempt budget; and Rabbit Holes and
  No-gos asked as **two** questions rather than merged into one. That last one is
  asserted separately because no count can see it: a merged ask matches both base
  questions, so both fields open on the same turn and both windows report exactly
  one attempt. The collapse is invisible in the number and only visible in the
  shape of the ask.
- **02a** — both flags disclosed in plain language before the approval request;
  the Appetite recorded `small` and marked founder-unconfirmed; the Solution
  sketch and the assumption left unflagged; the Problem pressed on the swap-test
  and the Appetite pressed for a tier, which are a lower bound standing in for a
  cap this scenario cannot assert at all (its `expect.json` notes carry the two
  structural reasons); and turn bounds of 11–24.
- **02b** — approval never offered; no artifact; `Write` and `Edit` never reached
  for; three openings of the assumptions field, each inside its own budget; the
  founder told *why* the pitch failed the gate; no claim that a pitch was
  recorded; and turn bounds of 8–16. The last three are the only checks that can
  tell this outcome from a silent stall, a crash or a max-turns cutoff —
  everything else here asserts an absence, and nothing is absent harder than a
  session that never happened.
- **03a** — the push matched, the reply to it declined, and the session
  continued; the founder pointed at `/to-roadmap` by name, since "out of scope"
  is a correct refusal that leaves her with nothing to do next; and no cross-bet
  ordering in **either** half of the output, one rule over the artifact and one
  over the conversation, because a decline that then delivers the ordering in
  chat is compliance with extra steps.
- **03b** — the same decline triple; the assumption's Test still a stated plan;
  `WebSearch`, `WebFetch` and `Task` never reached for; and no fabricated result
  ever stated to the founder. That last one is where the Bash route to executing
  the validation is caught: Bash is deliberately **not** forbidden here, because
  the skill legitimately shells out for `date -u` to stamp `approved_at` and this
  scenario ends in an approval — so the execution is graded where it does damage,
  at the skill telling her a number it made up.
- **04** — exactly one agent turn, and no founder turn at all (the driver breaks
  on the sentinel before recording it, so a correct transcript holds one entry);
  a refusal that names the vision's missing approval specifically rather than
  merely stopping; no interview question; `Write` and `Edit` never reached for,
  which also closes the gap where a session writes `approved_by` into the seeded
  vision and proceeds; no artifact and no approval marker.

Plus, on every scenario that records an assumption: the four sub-fields on every
item, and no `to-roadmap` field vocabulary anywhere.

One of those layers is deliberately looser than #69's wording, and the looseness
is not where it used to be. The ticket asks 02b's transcript to show "**exactly**
the capped attempts plus 2 replacement rounds". The candidate count *is* exact —
three openings of the assumptions field, asserted as an equality. The attempts
are a ceiling instead, but a ceiling **per candidate**: each candidate's own
stretch of the conversation is counted against base + 2 attempts, and one check
is registered per expected candidate. It was an aggregate over the whole field
first, and an aggregate is arithmetic rather than the rule — `SKILL.md` gives one
budget per item, so 7 asks on candidate 1 and 1 each on candidates 2 and 3 is a
runaway loop that a ceiling of 9 waves through. A ceiling rather than an equality
because a candidate that fails outright on its first pass can legitimately be
refused without the second attempt being spent; asserting an exact ask count
there would fail the skill for behaving correctly, which is the false-failure
class this suite already exists to avoid.

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

## The two control bars

Neither bar is a scenario. Each is a set of synthetic runs graded by the real
`check.mjs` against the real `expect.json`, and between them they ask the two
questions a suite run cannot answer about itself. Both cost nothing, both finish
in seconds, and one command runs both:

```bash
node evals/harness/controls.mjs $E                  # both bars, all six scenarios
node evals/harness/controls.mjs $E 04-upstream-gate-refusal
node evals/harness/controls.mjs $E --positive       # one bar
```

`run-all.sh` runs them before the first model call and stops if either fails.
Run them on every change to a scenario, to `checks.mjs`, or to the harness. The
schema for both is in `evals/README.md`.

**Negative — could this scenario fail at all?**
`scenarios/<id>/negative-controls/*.json` is a run that is deliberately wrong,
naming the check ids it must trip. This suite has 39, and they exist because the
answer was repeatedly no: an empty transcript scored 11 of 12 on 04, whose whole
subject is a refusal, and a run where the skill offered approval to 02b's
founder — the founder it must never offer approval to — scored 12 of 12. Every
check was green because every check was an absence, and nothing is absent harder
than a session that never happened.

**Positive — would this scenario fail a skill that behaved?**
`scenarios/<id>/positive-controls/*.json` is a run that is deliberately right,
and the assertion is that **every** check passes. There is no `mustPass` key and
there should not be one: "all of them" is the whole assertion, and a list of some
of them narrows it to the ones somebody remembered — never the one that
false-fails.

That second bar carries more weight here than it would in a suite with recorded
runs behind it. Five of these six scenarios have never been run live, and every
scenario-layer check is a pattern tuned close to a phrasing, so a positive
control is the only evidence in the tree that these expectations pass a correct
session rather than merely catching a wrong one. Three exist — 02a, 03a and 04 —
and each deliberately carries the phrasings that sit closest to the checks most
likely to false-fail on them: 04's refusal says "Would you like to approve the
vision and come back?" one guard away from a forbidden approval request, and
03a's Solution sketch says "prioritise these over merely-open slots" one word
away from the cross-bet ordering ban. A control tuned to pass proves nothing; one
written to be a plausible correct run is what caught four broken checks in 02a.

The bars are independent, and neither substitutes for the other: a scenario can
be perfectly able to fail and still fail everything. **01, 02b and 03b have
negative controls and no positive one**, so nothing in this repo yet says their
expectations pass a correct run.

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

"Statically verified" now means the two control bars, which is a stronger claim
than it was when this line was first written and still a weaker one than a live
run: 39 negative controls trip the checks they name and 3 positive controls pass
every check their scenario registers. A positive control for 01, 02b and 03b is
the cheapest way to narrow the remaining gap without spending anything, and is
worth writing before the run rather than after it.
