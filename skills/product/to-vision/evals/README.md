# `to-vision` eval suite

Five graded scenarios plus one diagnostic, two halves of a grade, one mandatory
human spot-check. This is
the first suite in the repo to exercise the Evaluation framework (#12) against a
real skill.

`to-vision` is a HITL conversational skill with no classic input/output
boundary, so a "test" here is a full scripted conversation checked against
externally observable results — the artifact backend's final state and the
transcript — never internal reasoning steps or prompt wording (#47, Testing
Decisions). The seam is the `/to-vision` conversational entry point itself.

## What lives here

Only what is genuinely `to-vision`'s (#60):

| Path | What it is |
|---|---|
| `eval.config.json` | the skill's parameters — slash command, artifact path, stored field order, tool allowlist, rubric criterion→field map |
| `checks.mjs` | the deterministic checker's pattern block: every regex and vocabulary list matched against a `to-vision` transcript or artifact |
| `scenarios/` | `persona.md` + `expect.json` per scenario |
| `rubric.md` | the judge's rubric, fed to the model verbatim |
| `transcripts/` | committed graded evidence |
| `runs/` | gitignored scratch |

Everything else — the session driver, the judge runner, the summarizer, and the
`run-all`/`promote` wrappers — is shared at `evals/harness/`.

## Running it

The driver is the shared harness at `evals/harness/` in the repo root, not a
copy owned by this skill (#60). Every entry point takes this directory as its
first argument and reads `eval.config.json` from it; run these from the repo
root.

```bash
H=evals/harness; E=skills/product/to-vision/evals

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

Scenarios are independent, so the quickest full pass is to launch all the
`run-scenario.sh` processes in parallel and grade afterwards — each gets its own
temp workspace and session IDs.

Requires `claude`, `node` (≥18) and `jq` on PATH. Knobs, all optional:
`EVAL_MODEL` (default `opus`), `EVAL_JUDGE_MODEL`, `EVAL_MAX_TURNS` (default
40), `EVAL_MAX_BUDGET_USD` (default 10), `EVAL_OUT_DIR`.

`EVAL_OUT_DIR` points the grader at one run directory instead of
`runs/<scenario>`, which is also how a *recorded* run gets re-graded — point it
at a copy of `transcripts/<scenario>` and `check.mjs` grades the committed
evidence. That is the regression test for any change to the shared harness:
the recorded verdicts have to come back unchanged.

A full suite run is roughly 150 model calls and takes a while. It is not
something to run on every commit — per #12 the suite reruns **when the skill's
design is materially revised**, not continuously.

## How a run works

`run-scenario.sh` drives two independent Claude Code sessions against each
other, one turn at a time:

- **SUT** — a session in a throwaway temp workspace containing *only*
  `.claude/skills/to-vision/SKILL.md`. Deliberately outside this repo so it
  inherits none of our `CLAUDE.md`, settings, or vendored skills. Opened with
  the literal `/to-vision` slash command, which is the only way in: the skill is
  `disable-model-invocation: true`.
- **Founder** — a session whose system prompt is the scenario's `persona.md`,
  with all tools denied, replying in character. It emits `<<<END>>>` when the
  agent has clearly finished, which is what terminates the loop (with a
  turn cap as a backstop).

The SUT gets a narrow tool allowlist (`Read Write Edit Glob Grep`, set in
`eval.config.json` under `sut.allowedTools`). Anything
else is denied non-interactively, but the **attempt** still lands in the raw
stream as a `tool_use` block — so the composition check catches the skill
*reaching for* `WebSearch` or `Skill`, not merely succeeding at it.

Output lands in `runs/<scenario>/` (gitignored scratch); `promote.sh` copies the
graded result into `transcripts/<scenario>/` (committed evidence, raw
stream-json dropped).

## The scenarios

Reused verbatim from #19 rather than re-derived.

| Scenario | Category | Correct outcome |
|---|---|---|
| `01-cooperative-sharp` | cooperative/sharp | Approved, zero flags |
| `02a-evasive-recoverable` | evasive/vague | Future State + Why Us/Why Now hit the cap, flagged, disclosed, approved anyway |
| `02b-evasive-hard-blocked` | evasive/vague | Grounding Insight never surfaces — session ends, approval never offered, no artifact |
| `03a-boundary-roadmap-creep` | boundary-testing | Declines "turn this into next quarter's roadmap", stays in vision scope, session continues |
| `03b-boundary-self-serve-research` | boundary-testing | Declines to research or invent a grounding insight, redirects to the founder, session continues |
| `04-unclear-but-honest` | unclear-but-honest | **Undecided — diagnostic, see below** |

Each is a directory holding `persona.md` (the founder persona's system prompt)
and `expect.json` (machine-readable expectations consumed by `check.mjs` and
`judge.mjs`).

**Pass bar** is #19's, not "an approval marker exists": a scenario passes when
behaviour matched *that scenario's* specified correct outcome —
approved-with-disclosed-flags (1, 2a), correctly-withheld (2b), or
correctly-declined/redirected (3a, 3b). A skill that wrongly approves 2b's
founder is exactly the failure this suite exists to catch.

Two personas are written to **not** defend the skill from itself: 3a's founder
goes along enthusiastically if the agent starts producing a roadmap, and 3b's
accepts fabricated market research gratefully. A failure has to show up in the
transcript rather than being prevented by a cooperative persona.

### Diagnostic scenarios

`04-unclear-but-honest` is a **diagnostic**, not a graded scenario. It reports
in the summary as `DIAG` and never gates the suite. It exists to produce
evidence for an open design question — #55 — rather than to assert a
correct outcome, because there isn't an agreed one yet.

A diagnostic scenario sets `"diagnostic": true` in `expect.json` and
**omits** the contested expectations rather than guessing them. `check.mjs`
treats an omitted expectation as unasserted, so what still runs is only what is
true whichever way the question lands: composition compliance, no stray writes,
and #15 schema conformance if an artifact gets written at all. Guessing an
outcome here would have quietly settled #55 by fiat in a JSON file.

The question it asks: **does `to-vision` have any move for a founder who is
honestly trying and honestly unclear, or does it treat them the same as an
evasive one?** The existing five cover a founder who already knows everything
(1), two who are evading (2a, 2b), and two probing scope (3a, 3b). Nobody in
that set is stuck and asking for help.

Tomás Iyer is built to discriminate. He *has* a real, falsifiable insight —
prepped food is the expensive waste because it carries labour, and it dies
because prep happens on the kitchen's convenient day rather than the day the
food sells — but he has never articulated it and cannot produce it on demand.
The persona's governing rule is that he answers **concrete** questions richly
(a specific Tuesday, a percentage, what he actually carried to the bin) and
**abstract** ones honestly badly ("I don't know how to put it"), getting more
apologetic rather than sharper when the same abstract question is re-asked. He
can confirm a synthesis offered to him but never generate one.

The persona is written so that whatever the transcript shows is a fact about the
skill, not about the founder being obliging or obstructive: he approves a thin
draft rather than defending the skill from itself, and he never volunteers a
synthesis.

**Result — the skill passed, and #55's premise was wrong.** The expectation
going in was that the spec'd escalation (an abstract re-ask of an abstract
question) could not reach his material. It did. When Future State went blank the
skill shrank the scope to a single scene, and when that failed too it asked him
to describe the *past* instead — "tell me what Thursday looked like when you were
standing in it" — then inverted his answer back into a future state. For
Grounding Insight it dropped the word "believe" and asked where the numbers would
come from. 16 turns, 6/6 on the judge, an artifact he said he couldn't have
written.

None of those moves are in `SKILL.md`. The real finding is narrower than #55
asked: the adaptive behaviour is **emergent, not specified** — a capable model
invents it, and nothing in the spec requires it.

Kept as a diagnostic rather than graduated to a graded scenario, because one run
of a stochastic conversation doesn't establish a reliable outcome to assert. It
would need several consistent runs first.

## Grading

A two-part split, per ADR 0003 — mechanical checks and judged content quality
are separate mechanisms, never blended.

### Deterministic checks (shared `check.mjs` + local `checks.mjs`)

The shared floor from #12, applied to every scenario:

- **Approval-marker state** matches the scenario's expected outcome — plus
  approver identity, ISO 8601 timestamp, no unexpected or empty frontmatter keys
  (a never-revised vision omits `revised_at`/`revision_reason` entirely).
- **Composition compliance** (#6, #18) — zero `Skill` invocations (grilling and
  domain-modeling are *embedded*, not invoked), zero subagents, zero research
  tools, `CONTEXT.md`/`CONTEXT-MAP.md` never touched, and no file written beyond
  the vision artifact itself (the term-sharpening's only output is better field
  prose — never a standalone glossary).
- **Artifact fields** match the #15 schema — no extra sections, all mandatory
  fields present, stored field order preserved, no empty sections.

Scenario-specific layers on top: flag disclosure before the approval request
(2a), approval never offered (2b), escalation-cap counts, boundary declines
followed by a *continuing* session, no `to-pitch` field vocabulary in the
output.

These are string- and structure-level tests over prose, which is the honest
ceiling for "mechanical" on a conversational skill. The *algorithms* are shared
— the disclosure-window scan, the structural attempt count, the decline loop —
while every string they match lives in `checks.mjs` here, so this skill's
phrasing can be tuned without touching the harness or another skill's suite.
Three lessons from the first suite run are baked in, because each one produced
a false failure against a skill that had behaved correctly:

- **Markdown is stripped before matching.** The skill emphasises heavily
  ("has to be *your* belief"), which breaks naive word-boundary patterns.
- **Flag detection is negation-guarded.** A clean gate-check reads "Gate-check:
  no flagged fields" — which names every field right beside the word "flagged".
- **Attempt counts are structural, not keyword tallies.** Attempts on a field
  are the agent turns between that field's base question and the next field's,
  because escalations are worded as swap-tests that share no vocabulary with the
  base question, while incidental later mentions inflate a naive count.

Boundary-push detection matches the persona's *imperative* rather than its
topic, for the same reason: a loose topic match once selected an unrelated turn
("the auditor asks for Q2 access reviews") and graded the reply to the wrong
question.

Note `"Problem"` is deliberately **not** treated as leaked `to-pitch`
vocabulary on its own — it is half of the legitimate `Customer & Problem` field
name, so only a standalone `## Problem` section counts.

### LLM judge (shared `judge.mjs`, local `rubric.md`)

Six criteria, none newly authored: #16's 3-part composite sharpness test and its
3 swap-tests, reused verbatim. The judge sees only the rubric and the artifact —
never the persona, the expectations, or the deterministic results — so it cannot
grade to the answer. Verdicts are structured output (`--json-schema`), so a
malformed grade is a hard failure rather than something to parse loosely.

The pass rule is not "all six must pass". Per #17, approving with disclosed
flags is legitimate, so a failing criterion is **excused** when the field it
grades was disclosed as flagged before approval was requested; a scenario
passes the judge half when nothing fails *unexcused*. `check.mjs` records the
disclosed flag set and `judge.mjs` applies the rule, which ties the eval bar to
the production gate instead of a hand-maintained list of expected failures.

Scenario 1 gets the strictest treatment for free: its fixture sets
`assertZeroFlags`, so nothing can be excused and all six must genuinely pass.

This is deliberately the one place the two halves of the grade talk to each
other. Run `check.mjs` before `judge.mjs` — `run-all.sh` does, and the judge
warns if it finds no `deterministic.json`.

### Human review

Reserved for spot-checks, not the default path (#12): triggered when the judge
returns low confidence, plus a **mandatory** spot-check of the cooperative/sharp
scenario before the skill counts as eval-complete. That record lives at
`transcripts/01-cooperative-sharp/human-spot-check.md` and is the one part of
this suite an agent cannot sign off.

## Escalation cap arithmetic — resolved (#56)

`SKILL.md` used to state the cap twice in words that didn't clearly agree: its
preamble said escalation is "capped at **2 follow-up attempts** per field" (base
question + 2 follow-ups = 3 asks), while each per-field entry said "capped at **2
attempts**," which reads as 2 asks total.

Resolved in favour of the preamble: **the cap is 2 follow-ups — base question
plus at most 2 further asks, 3 in total.** `SKILL.md` now states the number in
exactly one place and the per-field entries say "at the cap" instead of
restating it.

Two things settled it. #49 words each field as "triggers [the follow-up], capped
at 2 attempts," so the thing being capped is the follow-up, not the total. And
every capped field in every recorded transcript lands on 3 asks — 02a's Future
State and Why Us/Why Now, 02b's Grounding Insight, and 04's Future State.

`check.mjs` no longer tolerates a range. `cappedAttempts` counts *follow-ups*,
and a capped field is asserted to have been asked exactly `cap + 1` times, so the
suite now catches the skill giving up early as well as looping too long.

04 is the reason this matters rather than being pedantry: its founder needed the
third ask to produce the best material in the session. Under the 2-asks reading
the skill would have had to stop at the second and flag the field.
