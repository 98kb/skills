# PROTOTYPE — throwaway. Do not build on this.

Re-cut of [`jian-yang.md`](https://github.com/dsfx3d/shazam-for-food/blob/main/.claude/personas/jian-yang.md)
into the candidate stance-record shape, for
[Re-cut jian-yang.md into the candidate component shape (#85)](https://github.com/98kb/skills/issues/85)
on [Map: to-stance Phase 1 (#81)](https://github.com/98kb/skills/issues/81).

The original stays untouched in its own repo. Nothing here proposes a decided
component list — that is
[Lock the to-stance component list — or call the no-go (#86)](https://github.com/98kb/skills/issues/86).

## The question this answers

Does the candidate component list survive contact with real material?

## Read this first

**[FINDINGS.md](./FINDINGS.md)** — the output. Everything else is the working.

## What is here

| Path | What it is |
|---|---|
| `t0-seed/` | The seed sitting, 2026-08-18. Index, positions, register, one derived entry. |
| `t1-accrual/` | An accrual sitting, 2027-02-15, constructed to test index growth. Index, new positions, updated register. |

`t1-accrual/positions/` holds **only** entries written at T1. T0 position files
are not copied forward and not edited — that is the point of a frozen record.

## Rules applied

- **Altitude** — [ADR 0009](../../docs/adr/0009-position-altitude-is-a-trade-off-not-a-product-artifact.md).
  An entry must name a trade-off and must be stateable without naming an artifact
  of this product. Domain nouns admissible, product artifacts not. Episode bar is
  a **bar, not a cap**: no dated episode → inadmissible → register.
- **Accretion** — [ADR 0010](../../docs/adr/0010-stance-record-accretes-by-queued-sitting.md).
  Seed and accrual share one schema. No agent writes the founder-said layer.
  Derived entries get no index line.
- **Two tiers** — [`stance-as-loadable-context.md`](../../docs/research/stance-as-loadable-context.md).
  Always-loaded index capped 200 lines / 25KB; positions retrieved per question;
  findability lexical, not ranked.
- **Boundary** — [`descriptive-record-boundary-and-falsifiability.md`](../../docs/research/descriptive-record-boundary-and-falsifiability.md).
  Entries keyed to the question elicited about; dated open-questions register;
  per-entry basis / context / defensibility cap; frozen, append-only.

## The one liberty taken, stated plainly

`jian-yang.md` is a file, not a founder. Where the interview would press for a
dated incident (McClelland's BEI, per ADR 0009), the file cannot be pressed. Every
inadmissibility below is therefore recorded as *the file does not carry this*, never
as *the founder could not supply it*. Where that distinction changes a finding,
FINDINGS.md says so.

The T1 accrual is **constructed**, not elicited — invented to exercise the index
under growth, which is the one thing a static re-cut structurally cannot test.
It is labelled as such wherever it appears and is evidence about the *mechanism*,
never about Jian-Yang.
