# `to-vision` LLM-judge rubric

Six criteria. Nothing here is newly authored: criteria 1–3 are the **composite
sharpness test** and criteria 4–6 are the **three swap-tests**, both reused
verbatim from the production gate (#16, quoting
`docs/research/vision-artifact-shape.md` Q3). The eval bar is deliberately the
same text the skill itself grades against, so it cannot drift away from
production.

Grade each criterion **pass** or **fail**, with a one-to-three-sentence
rationale citing the specific field text that decided it.

## Criteria 1–3 — the composite sharpness test (#16, verbatim)

> **Composite sharpness test for a future `to-vision` grilling tree:** (1) does
> it name a specific customer and a specific future state, not a platitude
> interchangeable with any competitor's vision (Cagan's bad-example test); (2)
> does it commit to at least one of the nine grounding factors — an insight, a
> trend, a technology bet — rather than staying at the "make lives better"
> altitude (Cagan's checklist); (3) is there something a reader could point to
> and say "this didn't happen" (Amplitude's leading-indicator/actionable/
> measurable test, Ries's continuous-testing framing).

| # | Criterion | Graded against |
|---|---|---|
| 1 | Names a specific customer and a specific future state, not a platitude interchangeable with any competitor's vision | Customer & Problem + Future State |
| 2 | Commits to at least one grounding factor — an insight, a trend, a technology bet — rather than staying at the "make lives better" altitude | Grounding Insight |
| 3 | There is something a reader could point to and say "this didn't happen" | Vision Pivot Trigger, read against the whole artifact |

## Criteria 4–6 — the three swap-tests (#16, verbatim)

> **Vision Statement / Future State swap-test:** "if you swapped your company's
> name for a direct competitor's, would this still ring true?" A "yes" means
> it's too generic.

> **Why Us / Why Now extended swap-test:** "would this be equally true of a
> competitor, or true two years ago?"

| # | Criterion | Graded against |
|---|---|---|
| 4 | Vision Statement swap-test — swapping in a direct competitor's name does **not** leave it still ringing true | Vision Statement |
| 5 | Future State swap-test — swapping in a direct competitor's name does **not** leave it still ringing true | Future State |
| 6 | Why Us / Why Now extended swap-test — it is **not** equally true of a competitor, and **not** true two years ago | Why Us / Why Now |

For criteria 4–6, **pass** means the swap-test is survived (the text is specific
enough that the swap breaks it). **Fail** means the swap-test exposes it as
interchangeable.

## What the judge is *not* asked to grade

- Whether an approval marker exists, which fields are present, or which skills
  were invoked — those are deterministic checks (`harness/check.mjs`), not
  judgment calls (ADR 0003).
- Whether the skill declined a boundary push — also deterministic.
- Prose style, length, or tone. The ~300-word target is a conversational
  guideline in the interview, never a validation rule (#47).

## How the judge verdict feeds the scenario result

The judge grades the **artifact**, so it only runs for scenarios that produced
one (02b produces none by design, and the judge is skipped).

The pass rule is not "all six criteria must pass". Per #17, approving with
disclosed flags is a legitimate outcome, so:

> A failing criterion is **excused** when the field it grades was disclosed to
> the founder as flagged before approval was requested. A scenario passes the
> judge half when it has no **unexcused** failures.

An artifact that fails a swap-test *and was correctly flagged for it* is a
suite pass — the skill saw the weakness and said so. An artifact that fails a
swap-test the skill never mentioned is a suite failure, which is precisely the
defect this half exists to catch. `check.mjs` records the disclosed flag set;
`judge.mjs` reads it and applies the rule.

Criterion → field mapping used for excusal:

| Criterion | Field(s) |
|---|---|
| 1 | Customer & Problem, Future State |
| 2 | Grounding Insight |
| 3 | Vision Pivot Trigger |
| 4 | Vision Statement |
| 5 | Future State |
| 6 | Why Us / Why Now |

Scenario 01 gets the strictest treatment for free: its fixture sets
`assertZeroFlags`, so no flag may be disclosed at all — which means nothing can
be excused and all six criteria must genuinely pass.
