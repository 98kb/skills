# Open-questions register — Jian-Yang

<!-- PROTOTYPE. Throwaway. See ../README.md -->

Dated, append-only. POMR §2.D: a question the sitting **opened and did not close**
is a numbered, dated entry in its own right, closed later with its own date
pointing at the entry that closed it.

A register entry is **not a weak position** and is never loadable. It is also,
per ADR 0010, an **episode capture channel** — an entry written at decision time
supplies the dated episode a later sitting needs.

| Field | Meaning |
|---|---|
| Opened | Date the question was raised and left open |
| Why open | What is missing — for a seed entry this is almost always the dated episode |
| Disposition on file | What the source material asserts, recorded so the next sitting has an agenda. **Not a position.** Never retrieved. |
| Closed | Date + pointer to the entry that closed it |

---

## R001 — When you cannot cover the whole domain, do you ship narrow and correct, or broad and approximate?

- **Opened**: 2026-08-18 (seed)
- **Why open**: no episode of any kind. The source asserts the disposition as a
  standing rule and cites no incident in which the trade was actually faced.
- **Disposition on file**: takes the narrow slice. A wrong answer inside claimed
  coverage costs more than silence outside it. Source phrasing: *"one food correct
  beat ten thousand food wrong."*
- **Altitude**: passes. Names a trade-off (coverage against correctness under a
  labelling budget); stateable with domain nouns only.
- **Closed**: —

## R002 — What would you give up in order to move faster?

- **Opened**: 2026-08-18 (seed)
- **Why open**: no episode. The source states the *state* (no co-founder, no
  investor, no employee) but never an occasion on which any of the three was
  offered and refused. A standing state is not a decision.
- **Disposition on file**: refuses all three, and refuses them as a class rather
  than on terms. Source phrasing: *"you do not want any of the three"*;
  *"you can be wrong for two year and it cost nothing. Company with money cannot
  be wrong for two year."*
- **Altitude**: passes. Trade-off is capital and hands against the duration of
  tolerable wrongness.
- **Protected-value markers present** (Baron & Spranca): quantity insensitivity
  (*"any of the three"* — no amount named), anger at the thought of the trade-off
  (*"Why you ask this"*), denial that the trade-off need be faced. Three of five.
  Absent: agent relativity, moral obligation.
- **Closed**: —

## R003 — When someone brings you a better-attested way of working, what do you do?

- **Opened**: 2026-08-18 (seed)
- **Why open**: no episode. The source names his own process (issues with labels,
  branch per change, decision written down) and names the rejection, but no
  occasion on which a specific external method was put to him.
- **Disposition on file**: rejects on origin rather than on merit. Source
  phrasing: *"Contempt for process you did not invent"*; *"Anyone else's framework
  is talking instead of building."*
- **Altitude**: passes. Trade-off is borrowed method against self-authored method.
- **⚠ Recorder's note**: the source states this in the second person as an
  instruction to a performer (*"you defend it absolutely"*), not as a first-person
  report. See FINDINGS §3.
- **Closed**: —

## R004 — Whose advice do you act on?

- **Opened**: 2026-08-18 (seed)
- **Why open**: an episode **is** present and is the only one in the source —
  a named counterpart, a specific thing said, and his response. It carries **no
  date**. Under ADR 0009 the bar is a *dated* episode, so this is inadmissible;
  under a relaxed bar it is the one entry that would qualify. Flagged for #86 as
  the single case where the bar's exact wording changes the output.
- **Disposition on file**: discounts advice to zero where the adviser has not
  shipped the counterpart thing. Source phrasing: *"He say stop planning and start
  coding. He does not have app."*
- **Altitude**: passes. Trade-off is claimed expertise against demonstrated output.
- **Closed**: —

## R005 — What makes a plan wrong even when its first step works?

- **Opened**: 2026-08-18 (seed)
- **Why open**: no episode. Stated as a hypothetical falsification condition, in
  the future tense, about work not yet done.
- **Disposition on file**: treats non-extensibility as fatal — a first result that
  cannot be extended without redoing it invalidates the plan that produced it.
- **Altitude**: **passes only after rewriting.** The source sentence is
  *"if after hotdog model work you cannot add second food without retraining from
  zero, the plan is wrong"* — `hotdog model` and `second food` are product
  artifacts. The disposition survives their removal, which is the test ADR 0009
  actually specifies. Recorded here because the rewrite was the recorder's, not
  the founder's, and a founder-facing sitting would have to put the rewritten
  form back to him. See FINDINGS §4.
- **Closed**: —

---

## Register: 5 open, 0 closed.
