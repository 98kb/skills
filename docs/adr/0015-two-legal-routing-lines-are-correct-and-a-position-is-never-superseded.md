# Two legal routing lines matching one question is correct behaviour, and a position is never superseded

[ADR 0013](0013-routing-line-extent-is-fixed-revision-is-a-wording-act.md) split the prototype's "collision" in two, answered the over-broad half with a per-line check, and deferred the other half: **two legal lines over genuinely adjacent evidenced scopes**, and the paradigm case of a superseded position and its successor. It flagged that the design specified neither, and that dropping a superseded position's line manufactures the false silence its own floor exists to prevent while retaining it routes readers to replaced material — neither free.

[#118](https://github.com/98kb/skills/issues/118) then researched the retrieval half against first-party agent documentation only. This ADR takes the deferred decision on what it returned.

## The matcher is out of scope, and that is a finding rather than a dodge

**No first-party source, on any surface, by any vendor, specifies what happens when two always-loaded natural-language discovery lines both match.** The omission is structural: the Agent Skills implementer's guide tells clients not to build the layer that would specify it — *"most implementations rely on the model's own judgment as the activation mechanism"* — its five steps contain no arbitration step, MCP puts selection outside the protocol, and Anthropic's own `skill-creator` reports triggering as a sampled **rate** because *"model behavior is nondeterministic."* Behaviour varies by model, by harness and by run, all stated first-party.

So the question is **measurable, not specifiable**, and it is ruled out of scope as a design question. It is recorded on [Map: to-stance Phase 1 (#81)](https://github.com/98kb/skills/issues/81) as a fact about the reading agent.

**On the substance, ADR 0013's withdrawn claim was right and its retraction over-corrected.** The nearest first-party statement of this exact case is Claude Code's memory doc, for always-loaded natural-language guidance: *"all discovered files are concatenated into context rather than overriding each other,"* and *"if two rules contradict each other, Claude may pick one arbitrarily."* Union on load, arbitrary on conflict. Skills corroborate — multiple skills load for one task, and the priced cost is *conflicting instructions*, which presupposes both arrived. **One-wins is documented nowhere.** The claim is restored **as the better-supported reading and not as a guarantee**: a reader may get both, may get one, and the record cannot make it either. The prototype's contrary line — *"the broader line wins by covering more of them"* — was verified as a pre-publication authoring rationale on a constructed accrual against which no query was ever run, and has no standing; see that ADR's appended correction.

## Conduct is not superseded, so a routing line is retained at full extent forever

The ticket's framing does not survive, and the reason is one step below it.

A routing line is co-extensive with its position's **evidenced scope**, and evidenced scope is what the cited **episodes** support. An episode is a dated fact about conduct. **Conduct is never superseded** — what the founder did on a given day remains what he did on that day, however he later decides. A later position on the same conflict class therefore does not shrink, invalidate or replace its predecessor's evidenced scope; it adds a second, later-dated one over the same axis.

Under ADR 0013 there is consequently no legal way to drop or narrow the earlier line, and no reason to want one: **a routing line is retained, unchanged, at full extent, for the life of the record.**

**A reader routed to both is the mechanism working.** [ADR 0011](0011-conditional-go-the-stance-record-is-the-delta-between-stated-and-evidenced.md) holds that the artifact's subject is the delta between stated disposition and evidenced conduct; two dated positions on one conflict class are that same delta running over time rather than within one entry. And the time series is the artifact's **only** secured mitigation of Fagerlin & Schneider's preference instability — [ADR 0010](0010-stance-record-accretes-by-queued-sitting.md) rests it on a dated series, and ADR 0011 upheld the freeze on the ground that revisable entries cannot be one. Dropping the earlier line deletes the earlier point of that series.

The cost is stated rather than smuggled: **a reader can retrieve a disposition the founder has since moved off.** That is accepted. The alternative buys the reader a convenience the never-an-authority constraint says they should not have — a record that quietly presents its current view as the answer is the thing this design has refused at every turn.

## "Superseded" has no subject on the position layer

Following that through kills the word. If a successor never replaces a predecessor, there is nothing for supersession to name: what exists is two dated positions sharing a conflict class, and the delta between them is the reader's to see. **The prototype's `Superseded by` row asserts something the design cannot support, and is dropped.**

Removing it removes three problems at once. There is no append to a frozen entry to justify. There is no second extension of ADR 0010's agent-write enumeration — ADR 0013's extension to routing lines stays the only one. And there is no declared field where [ADR 0012](0012-to-stance-mechanisms-computed-over-declared-and-approval-is-authorship.md) says compute.

The honest consequence: **a reader cannot distinguish *the founder changed his mind* from *the founder elaborated*.** Under this design they are not meant to. They get two dated positions on one axis and read the delta themselves, which is what reference-material-never-an-authority requires.

The knock-on reaches ADR 0011's wording. `Frozen ≠ static: superseded only by dated append`, inherited from [#83](https://github.com/98kb/skills/issues/83)'s ISAD(G)/DACS pass, turns out to be **vacuous for positions** — a position is frozen, full stop. The clause stays live where it does real work: the register's dated closure append, and the index's revision log. This is a **sharpening, not a reversal**: nothing ADR 0011 decided changes, but one clause is found to have had no subject on the layer it was stated for. It is recorded explicitly because this map has now had four claims need correcting after the fact, and a clause doing nothing is how the fifth would start.

## Conflict class already tells a reader there is a neighbour

The dangerous case is concrete: a reader retrieves the earlier position alone, because the later one's line did not match.

A marker inside the position file does not answer it. ADR 0010 found that a weaker marker inside an entry does not reach a reader who has already decided to use it on the strength of the index match, and a "this may be outdated" note is a disclaimer in the sense ADR 0011 refused — it asks the reader to hold something in mind rather than changing what the reader can reach.

**The mechanism already exists, built for another reason.** ADR 0012 moved **conflict class** onto the routing line so that record competence would be *derived* — the set of classes present — rather than declared. A conflict class is the trade-off axis, and two positions in this relation share one axis by definition, since that is now what the relation *is*. A reader holding the always-loaded index can therefore see, without retrieving anything, that another line carries the same conflict class as the one they matched. That is a fact about what they can **reach**, delivered in the tier that is always resident.

One field, second job — the same shape as [ADR 0014](0014-the-register-is-adjacent-to-the-always-loaded-tier-not-in-it.md)'s "one invariant with two locations," and the derivation is unaffected because it was already defined over routing lines only.

**Its limit is stated.** This tells a reader that a neighbour *exists* on the axis, not which of the two is later; ordering requires opening both position files, which is cheap once the reader knows to look. And it is **unexercised** — the prototype's T1 routing lines carry no conflict class, predating ADR 0012.

## Three refusals, recorded as refusals

**No cross-line check.** ADR 0013's per-line check does not see an adjacent pair, which reads as an invitation to add one that does. A check needs a remedy: narrowing is closed by ADR 0013's floor and ADR 0014's *wording length is reach*, dropping is closed by the same floor, and per the first section there is no specified behaviour to check against. A check whose every remedy is illegal and whose target is unspecified is a ritual. **The per-line check stays the only check**, and the invariant to hold instead is that two legal lines matching one question is correct behaviour rather than a collision.

**No negative trigger on a routing line.** #118 surfaced the one floor-compatible disambiguator anyone has found — the vendor's *"Do NOT use for simple data exploration (use data-viz skill instead)"* — which adds words while subtracting reach, the case ADR 0014's uncompressibility finding does not cover. It is refused on three grounds: its effect is measured per description rather than specified, so it is a remedy aimed at the matcher just ruled out of scope; it makes one position's line name another, a cross-line dependency the per-line check cannot see, re-introducing precisely the coupling ADR 0013's fixed referent removed; and it is a narrowing device dressed as an addition. **The content already has a legal home in the record** — the prototype put it in P101's scope and defensibility cap, *"does not cover paid labour with no continuing claim — see P102, which was written because this entry was being retrieved for questions it does not answer"* — where a reader who has already retrieved sees it, and where the existing per-position check covers it.

**No new term.** Naming the relation (`succession`, `position series`) would re-reify what this decision dissolved and hand a future reader a noun to hang replacement semantics back onto. `CONTEXT.md` is amended instead: **Conflict class** gains the second job, **Routing line** gains lifetime retention, and **Position** gains `_Avoid_: superseded, supersedes`.

## Handed to Phase 2 as a checkpoint, not a finding

Conflict-class-as-adjacency-signal is adopted on reasoning and has never been observed. Testing it needs a founder who has actually changed his mind on an axis he already holds a position on — a second sitting separated by real elapsed time. A constructed prototype pair would be built to pass, which is the exact defect #118 found in the T1 rationale it demolished, so building one would manufacture the appearance of a measurement rather than one.

**The falsifiable condition**: if a reader holding a matched routing line and its same-class neighbour cannot tell that two positions bear on the question, this decision's answer to that half fails and the in-entry marker question reopens. Same shape as ADR 0011's conditional go and ADR 0014's escalation — a checkpoint Phase 2 inherits, not a mandate.

Decided on [Two routing lines bear on one question — and one of them may be superseded (#116)](https://github.com/98kb/skills/issues/116), a ticket of [Map: to-stance Phase 1 (#81)](https://github.com/98kb/skills/issues/81). Does not reopen [ADR 0008](0008-stance-record-replaces-persona-as-the-artifact-category.md), [ADR 0009](0009-position-altitude-is-a-trade-off-not-a-product-artifact.md), [ADR 0010](0010-stance-record-accretes-by-queued-sitting.md) or [ADR 0012](0012-to-stance-mechanisms-computed-over-declared-and-approval-is-authorship.md). **Sharpens** [ADR 0011](0011-conditional-go-the-stance-record-is-the-delta-between-stated-and-evidenced.md) on one clause — `superseded only by dated append` has no subject on the position layer. **Completes and corrects** [ADR 0013](0013-routing-line-extent-is-fixed-revision-is-a-wording-act.md), taking the half it deferred and withdrawing the observation it deferred on; see that ADR's appended correction. **Extends** [ADR 0014](0014-the-register-is-adjacent-to-the-always-loaded-tier-not-in-it.md) by consuming the negative-trigger lead its footer handed to this ticket, and refusing it.
