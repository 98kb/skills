# A routing line's extent is fixed by evidenced scope; revision is a wording act, and its provenance lives on the index

[ADR 0011](0011-conditional-go-the-stance-record-is-the-delta-between-stated-and-evidenced.md) froze positions and left the index over them revisable, per ISAD(G)/DACS. The [`jian-yang.md` re-cut](https://github.com/98kb/skills/tree/prototype/stance-recut/prototypes/stance-recut) then exercised that split under growth and found it does not compose: at the accrual sitting P101's routing line had to be narrowed before publication, because P102 arrived at the same sitting and the broad wording routed P102's questions to P101. Nothing illegal happened, and yet **the same frozen entry, unedited, now returns for a different set of questions than it did before** — a reader on the day before and the day after gets different behaviour out of an identical record, and nothing in the position file records that anything changed.

The finding was filed as a **collision** problem, and its sharpest edge was that collision bites at two positions rather than at two hundred. That framing does not survive being worked. Collision was never one problem, and the half that matters is not about the other lines at all.

## The extent is fixed by the record; only the wording is authored

ADR 0011 already bounds a routing line from above: a line covers a position's **evidenced scope only**, because a line reaching past it indexes the **residue**, which is unroutable by design. That ceiling was written for the residue quarantine, not for this.

There is a floor too, and it is forced by an invariant already on the map. A line **narrower** than evidenced scope leaves part of a position unretrievable, so a reader whose question sits inside evidenced scope gets a no-match — the record claims silence where it holds an answer. That is a **false silence**, and the computable no-match is the mechanism ADR 0011 leaned on hardest.

Ceiling and floor land in the same place. **A routing line is co-extensive with its position's evidenced scope. Its extent is therefore fixed by the record, and only its wording is authored.** Neither half is a new rule; both are existing invariants noticing they have a second subject.

Read against the prototype, this reframes what happened at T1. P101's rejected draft — *"outside help, money, or people — investors, co-founders, contractors, hires"* — reaches well past the equity-and-debt its episode closed. **It was already illegal before P102 arrived.** The prototype's own fix, arrived at by hand, reads "narrowed to the instruments P101's episode actually reaches" — co-extensive with evidenced scope. The invariant explains the observed repair exactly, without having been consulted.

## Collision splits into two failure modes with different fixes, and only one is a defect

- **An over-broad line** is a compliance bug against the ceiling. It is caught by a **per-line** check — is this line co-extensive with its own position's evidenced scope? — which needs **no other line**, is O(1) rather than O(n), and **does not decay with age**. This kills the ticket's worry about a line written two years earlier colliding with a position added today: the check never needed the other lines, so there is no moment to miss. This is the prototype's case.
- **Genuinely adjacent evidenced scopes** — two legal lines that both match — is **not a defect**. A reader with an equity question *should* see both positions; the record is correctly reporting that two positions bear on the question. Suppressing one would manufacture a false silence to fix something that was never broken.

A pairwise overlap check across lines survives only as a weak prompt to sharpen wording. **The load-bearing check is per-line**, and it is deterministic — which makes it a fourth record-level falsifiability check alongside ADR 0011's residue coverage.

## An agent may author and revise routing lines; `described-by` is the only marker

[ADR 0010](0010-stance-record-accretes-by-queued-sitting.md) enumerates what an agent may write — register appends and derived entries — and the index is not on that list. This ADR **extends that enumeration explicitly rather than smuggling the index in under it**: an agent may author and revise routing lines.

Handing an agent the artifact's entire discoverability surface would be a strong power, and the reason it is acceptable is the section above: **a revising agent cannot change what a line reaches, only the words used to reach it.** Changing the reach violates the ceiling or the floor. The line is authored over three already-frozen founder-said fields — question key, evidenced scope, conflict class — so it introduces no content of its own.

[ADR 0012](0012-to-stance-mechanisms-computed-over-declared-and-approval-is-authorship.md) left one clause of the [approval & completion gate pattern (#9)](https://github.com/98kb/skills/issues/9) alive for this ticket: an approval marker clearing back to "drafted" on in-place revision, the index being its only revisable subject in the design. **It resolves the way the rest of #9 did — no marker; `described-by` is the marker.** Approval already collapsed into authorship in ADR 0012, and a revision necessarily writes a fresh `described-by` and revision number, so clear-on-revision is a consequence rather than a state to flip. #9 is now fully disposed of against `to-stance`, by one mechanism, reached twice independently.

## Nothing lands in the position file — on the quarantine, not the freeze

The obvious objection to noting a routing revision inside the position is that a mutable field on a frozen record breaks the freeze. **That objection is wrong, and it matters that it is.** The map's own rule is *frozen ≠ static: superseded only by dated append*, and a dated append reading "routing revised 2027-02-15" breaks nothing.

The real objection is the **ISAD(G)/DACS quarantine**: description facts recorded inside the record contaminate the layer the split exists to keep clean, and the next thing offered for that slot will be less inert. Refused on the quarantine, the answer survives even if the freeze rule is later loosened.

## What is owed to a reader is reconstruction, not notification

ADR 0012 has already answered a structurally identical question: **nothing in this design persists a retrieval**, which is why it refused #84's claim that a deliberate lookup is visible and attributable. The design therefore cannot identify who retrieved under the old wording, and a notice addressed to an audience it cannot name is a disclaimer wearing a hat — the **third** this map has refused, after "no disclaimers anywhere" and the lookup-visibility claim.

What is owed is that the old behaviour be **reconstructible from the record**: a dated revision log carrying `described-by`, the superseded wording, the reason, and the revision's **kind** — *wording-only*, where the extent is unchanged and nothing material happened, versus *corrective*, where the extent was wrong and the record did mislead. That is the most a design with no retrieval persistence can honestly offer, and it is enough.

## Description control splits by growth curve

The prototype's description-control block is adopted, **split across tiers by how it grows**:

- **Always-loaded, constant size**: `described-by`, description date, revision number. A reader deciding whether to trust the index needs its age and how often it has moved. The description date was already adopted in ADR 0012.
- **Off-tier, retrieved on request**: the dated revision log. It accretes one entry per revision forever, and the always-loaded tier is under ADR 0012's byte tripwire. Only someone auditing a specific change needs the superseded wording.

This is a precedent for [the register's relation to the always-loaded tier (#112)](https://github.com/98kb/skills/issues/112), **not a pre-emption of it** — that ticket owns the tripwire's trip action and the general question of what sheds.

## ADR 0012's computed-over-declared shape does not extend to the index

The revision `kind` above is *declared* — judging whether a rewording changed extent is a judgement, not a computation — which reads as a violation of the shape ADR 0012 called forced.

It is not, and the reason is worth stating out loud. **Computed-over-declared was forced by the freeze**: a declared field on a frozen record either mutates and breaks it or goes stale. The index is description — not frozen, revisable by design, carrying its own revision number — so the premise does not hold and the shape does not extend. This is recorded explicitly because this map has already caught itself nearly reading one closed decision ([ADR 0003](0003-eval-grading-is-deterministic-plus-llm-judge-split.md)'s eval bar) as repo-wide when its own first sentence scoped it narrowly. Same failure mode, one ADR later.

Decided on [Index lines are revisable description over a frozen record — where does that revision live? (#111)](https://github.com/98kb/skills/issues/111), a ticket of [Map: to-stance Phase 1 (#81)](https://github.com/98kb/skills/issues/81). Does not reopen [ADR 0008](0008-stance-record-replaces-persona-as-the-artifact-category.md), [ADR 0009](0009-position-altitude-is-a-trade-off-not-a-product-artifact.md), [ADR 0011](0011-conditional-go-the-stance-record-is-the-delta-between-stated-and-evidenced.md) or [ADR 0012](0012-to-stance-mechanisms-computed-over-declared-and-approval-is-authorship.md). **Extends** ADR 0010's agent-write enumeration to routing lines, and **completes** the `to-stance` divergence from #9 begun in ADR 0012 — proposing, as that ADR did, no change to #9 itself.
