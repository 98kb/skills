# A phase number is a forward reference to a map that does not exist, so phase numbering is retired going forward and corrected backward

The `to-stance` effort was organised as "Phase 1" — the map at [#81](https://github.com/98kb/skills/issues/81), whose eight ADRs are 0008–0015 — and "Phase 2", the map at [#119](https://github.com/98kb/skills/issues/119). The ordinal was then written into those ADRs and into `CONTEXT.md` as the **addressee of every deferred question**: who wires the record, who inherits the checkpoint, who pays the cost this decision declined to pay. That addressing scheme is defective by construction, and the defect is not that the numbering reads as bureaucratic. **A phase number names a map that has not been chartered, written into an artifact that is only ever appended to.** The instant the map is chartered with a scope narrower than the deferral assumed, the sentence is false — and it sits in a file this repo does not rewrite. The reasoning underneath does not go stale. Only the address does.

The rate is measured rather than asserted. #119 was chartered on 2026-08-19, one day after the last of these ADRs was written. Of the **fifteen substantive phase claims** in merged ADRs, **five were false or weakened inside that day** — and every one of the five is false **only in its addressee**. Each would still be true written as *the implementing map*, *the map that runs the first sitting*, or *whichever map first has positions in the always-loaded tier*. That is the whole finding in one line: the ordinal never carried an argument, only an address, and the address is the only part that broke. "Phase 3" already has five forward references in #119 and #130 and no map at all, so the count grows on its own.

## The inventory, so that no reader has to re-derive it

Fifteen substantive claims across fourteen locations (`0011:63` carries two).

| Location | The claim | Status today |
|---|---|---|
| `0009:17` | "who loads the record and when, and whether `to-vision` consults it automatically, remain **Phase 2** composition questions" | **Weakened** — #119 is seed-only and does not own the `to-vision` question |
| `0010:11` | "The trigger's design … is **Phase 2** composition" | Intact — owned by #125 |
| `0011:3` | "**Phase 1** was gated on a real go/no-go" | Intact, and backward-looking |
| `0011:19` | "the strongest counter-evidence **Phase 1** produced" | Intact, and backward-looking |
| `0011:55` | "should be paid deliberately rather than discovered in **Phase 2**" | **False** — the conventions named are explicitly out of scope on #119 |
| `0011:57` | "must not be carried into **Phase 2** as settled" | Intact |
| `0011:61` | "The **Phase 1** question is whether the mechanism does something nothing else does" | Intact |
| `0011:61` | "yield is a **Phase 2** risk" | Intact — owned by #129/#130 |
| `0011:63` | "so **Phase 2** inherits a checkpoint rather than a mandate … the no-go stands and **Phase 2** stops" | **Weakened, and not repairable by renaming** — see below |
| `0012:9` | "*Who* wires it remains **Phase 2** composition" | Intact — owned by #126 |
| `0014:33` | "because **Phase 2** has to wire it" | Intact — owned by #126 |
| `0014:63` | "a falsifiable condition on the design, handed to **Phase 2** as a checkpoint" | **False** — the byte tripwire is out of scope on #119 and unreachable at a seed record holding zero positions |
| `0015:57` | heading: "Handed to **Phase 2** as a checkpoint, not a finding" | **False** — #119 records this one as not reachable at seed either |
| `0015:61` | "a checkpoint **Phase 2** inherits, not a mandate" | **False** — same |

Nine further ADR occurrences are not claims at all: they are citations of #81's title in a `Decided on` line (`0008:15`, `0009:19`, `0010:19`, `0011:65`, `0012:47`, `0013:61`, `0014:73`, `0015:11`, `0015:63`). A link's text naming an issue's actual title is true for as long as that is the title, and it is left verbatim. The one occurrence in `CONTEXT.md` — the **No-match read** entry's *"Named because Phase 2 has to wire it"* — is intact on the substance (#126 owns the wiring) and is nonetheless the highest-value occurrence in the repo, because `CONTEXT.md` is the always-loaded tier of this repo's own domain docs and is read every session.

## The replacement vocabulary: name the act or the map, never an ordinal

A deferral states its addressee in terms of **the work**, not in terms of a position in a sequence that has not been laid out — *the implementing map*, *the map that runs the first sitting*, *whichever map first has positions in the always-loaded tier*. Where no map is identifiable yet, name the **condition** that will identify it; that is what items `0014:63` and `0015:61` needed and did not have, and it is why their replacements are strictly better than the originals rather than merely equivalent. Nothing is chartered as "Phase 3", or numbered at all. A map is chartered by what it does.

The test, stated so it can be applied without this ADR in view: **could this sentence become false without any claim inside it becoming false?** If yes, the addressee is doing work the record cannot back.

`CONTEXT.md` is amended in place to match, which needs no exception — [ADR 0015](0015-two-legal-routing-lines-are-correct-and-a-position-is-never-superseded.md) already states the regime in its own words ("**`CONTEXT.md` is amended instead**"), and of the seventeen commits touching that file, nine delete lines. It carries no history and no footers: it states the current model, and it is rewritten to keep doing so.

## The counter-argument, which is real and is not fully answered

**An ordinal is legible and a description is not.** "Phase 2" tells a newcomer instantly, without following a link, that this work comes after Phase 1 and before Phase 3. "The seed-half spec" does not tell them it comes after the component list. "The implementing map" does not tell them what has already been decided or how much of it. Sequence is the one thing the ordinal encodes for free, and every replacement above either pays for it in words or loses it. Readability in a year is a stated goal of this effort ([#128](https://github.com/98kb/skills/issues/128)), so this is a cost against a value the effort holds, not a quibble.

**It is answered by where the sequence actually lives, and only mostly answered.** The ordering is fully recoverable from the link graph, and recoverable more reliably than the ordinal states it: #80 is the parent, #81's Destination cites #80, #81's closing comment charters #119, and #119 links back to #81 and to ADRs 0008–0015. A reader who follows one link gets the true graph; a reader who trusts the ordinal gets an unchecked claim about a scope nobody had fixed. The ordinal's legibility is precisely what makes a stale one expensive — it reads as authoritative and it is not followable. What is genuinely lost is the *at-a-glance* cue, and it is conceded rather than argued away: a newcomer now reads a clause where a digit used to do it.

## Existing ADRs are corrected by appended footer, never rewritten

This is not a new rule. It is the rule this repo has already followed without exception, and the practice is recorded here because it has never been written down.

Seven times an ADR file has been modified after it was created. **Six of the seven are appends, `+N −0` in every case** — `0cceabd` on ADR 0009, `8cda5a5` on ADR 0011, `1a87fab` on ADRs 0012 and 0013, `73318ed` on ADR 0013, `d5ed519` on ADR 0014 — and five of those six touched an ADR that was already on `main`. The seventh, and the only in-place rewrite in this repo's history, is `8cda5a5`'s treatment of ADR 0013: **−59 / +61 plus a file rename**, wholesale, because ADR 0013 was still on a trunk branch. That is the same commit, by the same author, on the same day, that gave ADR 0011 a two-line appended footer — because ADR 0011 was on `main`. The bright line is not habit; it is a two-regime discipline applied twice in one commit:

> Before an ADR reaches `main` it is rewritten freely — prose, structure, even its filename. After it reaches `main` it is only ever appended to.

So ADRs **0009, 0011, 0014 and 0015** — the four carrying a now-false or weakened forward claim — receive a footer in the existing idiom pointing here. The ten intact claims get nothing: a footer on a true sentence is noise, and the correction machinery only works if a footer means something is wrong.

## Wholesale erasure was considered and refused

Rewriting the twelve forward references in place would leave prose that is simply correct, reads cleanly in a year, and loses nothing a reader of ADR 0011 would ever want. It was refused on three grounds, in descending strength.

**It cannot be done where it would matter most.** The concept lives across five surfaces, and the repo is the smallest of them — roughly 34 tracked occurrences against ~92 in issue bodies, 35 in comments, 13 in PR bodies, 3 in issue titles and 2 in merged commit messages. GitHub stores every prior revision of an issue or comment body in a publicly queryable edit log; **#81 alone already holds 31 stored revisions**, the first of which contains, verbatim, *"Phase 1 of #80; Phase 2 (the SKILL.md) begins where this map ends."* Editing it adds a thirty-second revision and removes nothing. Retitling is worse than useless: a rename writes a permanent, undeletable `renamed` timeline event containing the old title, so **erasing "Phase 1" from #81's title manufactures a fresh, indelible occurrence of "Phase 1" inside #81 itself.** Six issues already carry such an event from the `to-persona` → `to-stance` rename. Erasure from the tracker is not expensive; it is impossible. A perfect repo erasure would therefore leave every ADR footer linking to an issue still titled "Map: to-stance Phase 1", which is a repo/tracker divergence worse to read than one consistent stale term.

**The precedent predicts a partial rename.** The `to-persona` → `to-stance` rename was executed on 2026-08-18 by this same process, at roughly one-eighteenth the scale, with its cost forecast in writing as "an issue edit." It landed as pure additions — one ADR, one glossary block, six retitles, **zero deletions, not one existing file touched** — and it missed about 40% of its own inbound citations. The residue is on `main` right now: three research-file headers still read "Map: to-**persona** Phase 1 (#81)", as do four issue bodies and one comment. That is not a speculative risk; it is the observed outcome of the same operation, one day ago, smaller.

**It would treat this class of error differently from every other class, for no stated reason.** ADR 0013 carries three appended corrections, one of which quotes the wrong claim verbatim before withdrawing it; ADR 0014 carries two; #81's Notes are dense with markers reading *"this is the third of this map's imported or inherited claims to need correcting after the fact."* That machinery exists so the wrong thing stays visible underneath the correction. The strongest reply is that a phase number is an *address* and not *reasoning*, so fixing it is closer to repairing a broken link than to retracting a claim — and that reply holds for the ten intact claims, which is exactly why they are left alone. It fails for the five that are false: `0014:63`'s replacement adds a reachability condition the ordinal was silently wrong about. Substituting it in place would be a silent repair of a substantive claim, made to look as though it had always been there. That is the one thing this repo has never done.

Two of the fifteen claims (`0011:3`, `0011:19`) are backward-looking historical facts besides. This effort **was** organised in phases and its go/no-go **was** gated as one. Erasing those deletes a fact rather than fixing a defect.

## ADR 0011's conditional go is not repaired by renaming, and is not repaired here

One item resists the whole approach and must not be read as covered by it. ADR 0011's conditional go (`0011:63`) reads:

> **If the first seed sitting with a founder who does not know the bar yields zero admissible positions *and* a register he does not return for, the no-go stands and Phase 2 stops.**

Substituting "the implementing map" for "Phase 2" produces a sentence that is still wrong. The two conjuncts have since acquired **two different owners** — #119 owns the first, and the second is inherited live and dated by a later map — so any single addressee, ordinal or descriptive, collapses a two-clock condition back into one. The information the ordinal was carrying here is not *which number* but *this is one condition with one owner*, and that turned out to be wrong on its own terms, independently of phase numbering. **This is not fixable by word substitution and is not fixed by this ADR.** It is owned by [Restate ADR 0011's conditional go: one condition on two clocks, and can its first conjunct be failed at all? (#120)](https://github.com/98kb/skills/issues/120), and ADR 0011's footer says so rather than pretending a rename would have done.

## What this decision does not do

The tracker is left entirely alone — no title, body or comment is edited, on the reasoning above. #81's title is genuinely historical and stays. The `docs/research/` headers are dated first-party findings under the ticket they were run for and are not touched here; their pre-existing `to-persona` residue is a separate defect with a separate cause. Git history is not rewritten. The unmerged `prototype/stance-recut` branch carries two further occurrences and will re-inject them if it is ever merged; that is recorded, not pre-emptied.

Decided on the phase-numbering audit run against `main`@`5850189` on 2026-08-19, which inventoried ~179 occurrences across five surfaces. It was decided without a chartered ticket, which departs from this map's practice of deciding on one and is recorded rather than hidden. **Corrects** [ADR 0009](0009-position-altitude-is-a-trade-off-not-a-product-artifact.md), [ADR 0011](0011-conditional-go-the-stance-record-is-the-delta-between-stated-and-evidenced.md), [ADR 0014](0014-the-register-is-adjacent-to-the-always-loaded-tier-not-in-it.md) and [ADR 0015](0015-two-legal-routing-lines-are-correct-and-a-position-is-never-superseded.md) by appended footer only, on their addressees and on nothing else. Does not reopen [ADR 0008](0008-stance-record-replaces-persona-as-the-artifact-category.md), [ADR 0010](0010-stance-record-accretes-by-queued-sitting.md), [ADR 0012](0012-to-stance-mechanisms-computed-over-declared-and-approval-is-authorship.md) or [ADR 0013](0013-routing-line-extent-is-fixed-revision-is-a-wording-act.md), and takes no position on ADR 0011's conditional go beyond declining to rename it — that is [#120](https://github.com/98kb/skills/issues/120)'s. **Reopens if** a replacement phrase is found doing the same job the ordinal did — naming a map that does not exist yet — in which case the defect survived the vocabulary change and this fix was cosmetic.
