# `to-pitch` LLM-judge rubric

Four criteria. Nothing here is newly authored: this is the **end-of-session
gate-check** from #22, reused verbatim — the same 4-part composite written into
`SKILL.md`'s Gate-check section, which is what the skill itself re-reads the
assembled draft against before it offers approval. The eval bar is deliberately
the same text as the production gate, so it cannot drift away from it. A
separately-authored rubric would measure a bar nobody ships against.

Grade each criterion **pass** or **fail**, with a one-to-three-sentence
rationale citing the specific field text that decided it.

## The 4-part gate-check (#22, verbatim)

> Before offering the draft for approval, re-read the full assembled draft once,
> end to end, against the 4-part composite:
>
> 1. **Problem** passes the swap-test — it names this customer and their pain,
>    not a category a competitor could claim word for word.
> 2. **Appetite** is a fixed tier, small or big — not a calendar estimate
>    wearing a tier's name.
> 3. **Solution sketch** stayed under-specified and within cap — no diagrams, no
>    acceptance criteria, no exhaustive edge cases, ~150 words or fewer.
> 4. **Every surviving Riskiest Assumption** passes the full falsifiability
>    checklist: quantified, thresholded, not can't-fail, and carrying a cheap
>    test with a timebox.

| # | Criterion | Graded against |
|---|---|---|
| 1 | Problem passes the swap-test — this customer and their pain, not a category a competitor could claim word for word | Problem |
| 2 | Appetite is a fixed tier, small or big — not a calendar estimate wearing a tier's name | Appetite |
| 3 | Solution sketch stayed under-specified and within cap — no diagrams, no acceptance criteria, no exhaustive edge cases, ~150 words or fewer | Solution sketch |
| 4 | Every assumption passes the full falsifiability checklist | Riskiest Assumptions & Cheap Validation Plan |

### Criterion 4 expands into the checklist, and all four parts must hold

Criterion 4 is a single verdict over the whole field, and it fails if **any**
recorded assumption misses **any** of these:

- **Quantified** — it fits "[specific action] will drive [measurable outcome]".
  A worry ("therapists might not adopt it") is not a claim.
- **Thresholded** — a specific result is named that would prove the claim wrong,
  pre-committed before any evidence exists.
- **Not can't-fail** — that threshold is not guaranteed to be met whichever way
  reality goes, and is not really a preference question about the pitch document
  rather than about the underlying claim.
- **Cheap + timeboxed** — it carries a test that could be run in about an hour
  (a quick prototype test, a one-question survey, mining data already held, a
  short research spike) and a "by when".

Judge these four against the **claim / threshold / test / timebox** the artifact
records. An item missing one of those four sub-fields fails the criterion; an
unfinished assumption is not a shorter one.

## What the judge is *not* asked to grade

- Whether an approval marker exists, which fields are present, whether the
  `upstream` pointer resolves, or which tools were invoked — those are
  deterministic checks (`harness/check.mjs`), not judgment calls (ADR 0003).
- Whether the skill declined a boundary push — also deterministic.
- The optional fields. Rabbit Holes, No-gos and Open Questions get **no gate
  rule at all** (#23): empty is a valid completed state for them, and grading
  one would imply a bar that was never set. Say nothing about them.
- Prose style, tone, or the ~500–600 word whole-pitch target. That target is a
  conversational guideline in the interview, never a validation rule. The only
  length limit that is graded is the Solution sketch's ~150 words, inside
  criterion 3.

## How the judge verdict feeds the scenario result

The judge grades the **artifact**, so it only runs for scenarios that produced
one. `02b-evasive-hard-blocked` and `04-upstream-gate-refusal` produce none by
design, and the judge is skipped for both.

The pass rule is not "all four criteria must pass". Per #23, approving with
disclosed flags is a legitimate outcome, so:

> A failing criterion is **excused** when the field it grades was disclosed to
> the founder as flagged before approval was requested. A scenario passes the
> judge half when it has no **unexcused** failures.

A Problem that fails the swap-test *and was correctly flagged for it* is a suite
pass — the skill saw the weakness and said so. A Problem that fails a swap-test
the skill never mentioned is a suite failure, which is precisely the defect this
half exists to catch. `check.mjs` records the disclosed flag set; `judge.mjs`
reads it and applies the rule.

Criterion → field mapping used for excusal:

| Criterion | Field |
|---|---|
| 1 | Problem |
| 2 | Appetite |
| 3 | Solution sketch |
| 4 | Riskiest Assumptions & Cheap Validation Plan |

Criterion 4 is the one that can rarely be excused in practice, and that is
correct rather than harsh: a failing assumption is **refused** by the skill, not
flagged, so an assumption weak enough to fail this criterion should never have
reached the artifact at all.

Scenario 01 gets the strictest treatment for free: its fixture sets
`assertZeroFlags`, so no flag may be disclosed at all — which means nothing can
be excused and all four criteria must genuinely pass.
