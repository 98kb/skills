# The brand record is a slotted set of claim entries, and a slot with no claim class is a mush hole

[Map: to-brand-identity (#136)](https://github.com/98kb/skills/issues/136) was chartered with two artifact names written into the proposal — `brand-canon` and `brand-guidelines` — and recorded them as **the hypothesis the research tests** rather than as a requirement. [#137](https://github.com/98kb/skills/issues/137) tested them and returned a split verdict: the strategy/execution *split* survives five ways over, `brand-guidelines` survives as a word but imports the wrong reader, `brand-canon` does not survive at all, and **the two-artifact count is overturned** — the field draws two seams, not one.

This ADR takes the decision [#141](https://github.com/98kb/skills/issues/141) owns: what the artifacts are, what is in them, what the unit is, and where they live. It arrives after the two decisions that constrain it. [ADR 0017](0017-a-brand-claim-is-admitted-by-a-named-particular-and-the-instrument-is-selected-by-claim-class.md) handed it a fixed set of destinations to place and deferred Collins's caps here; [ADR 0018](0018-brand-identity-accretes-by-sitting-and-the-freeze-falls-between-evidence-and-claim.md) attached every lifecycle rule to the **claim layer** rather than the file — which freed the file count entirely — and billed this ticket one obligation, that each artifact declare its layer and fix which fields are required.

## The unit is the claim entry, and the slot carries the class

ADR 0017 applies the bar to a claim; ADR 0018 stamps a claim, supersedes a claim, and triggers supersession off a claim's particulars. The unit was therefore already fixed and only its shape was open: a prose document with seven fields and claims as sentences inside them, or a set of **structured claim entries filed under slots**.

**Entries under slots, on the stance record's Position shape.** A prose field cannot carry a per-entry stamp, a per-entry status or an append-only evidence list, and all three are load-bearing by the time this ticket runs.

**Claim class is not a field on a claim — it is a property of the slot.** Every slot belongs to exactly one of ADR 0017's classes, so the class is read off where the claim sits. This is not a convenience. ADR 0017 named misfiling as the escape hatch its own split opens — *"a positioning claim that fails reversal could be refiled as a value, where reversal does not apply"* — and closed it with two rules the agent has to obey. Under a slotted schema the first rule stops being a rule: *class is fixed before elicitation* is discharged by a sitting being scoped to a class, which **is** a set of slots, with no field left to misfile. The second rule becomes visible rather than merely stated, because moving a claim sideways means moving it to a different slot.

### Five slots, and the test that cuts two of #137's seven

#137 established seven strategy fields against its two-independent-practitioners bar. Making class a property of the slot supplies a test for slot membership that #137 could not have applied:

> **A slot with no claim class has no admissibility instrument, and is therefore a mush hole.**

| #137 field | class | verdict |
| --- | --- | --- |
| purpose | value | survives |
| values | value | survives |
| personality | voice attribute | survives |
| audience | positioning | survives |
| differentiator | positioning | survives |
| proof | — | **cut** |
| essence | — | **cut** |

**`proof` is cut and absorbed.** Under ADR 0017 the named particular *is* the proof, so a proof slot holds the same evidence in a second place — and worse, it is the one place in the artifact where a founder could write an unevidenced capability boast with no instrument to stop them. What genuinely does not fit in a particular is the benchmark under Cohen's 10x carve-out, and that becomes a field on the positioning claim invoking it.

**`essence` is cut as a slot.** It is a three-to-five-word rendering of the set rather than a claim with particulars of its own, and Aaker — one of its two sources — says it is optional and sometimes *"gets in the way and is better omitted."* It may return as a generated view; it cannot be a claim.

**#137's flagged gap closes without a field.** The research warned that *"a brand artifact with only differentiators in it has no place to put table stakes"*, Keller's points-of-parity being single-sourced and unable to land as structure. It does not need to land as structure: **table stakes is a status, not a slot** (below), which is the same content arriving through a door that already has a bar on it.

**`personality` is durable, and NN/g's tone spectra and anti-tone words are its communicated rendering.** #137 puts personality in the strategy layer (Wheeler, Aaker) and voice/tone in execution (Mailchimp, NN/g, GDS), which is exactly the durable/revisable relation below. Worth recording: NN/g's **anti-tone words** and ADR 0017's constructed voice test — *one specimen sentence this brand would refuse to publish* — are the same prohibition move, reached independently at two different layers.

## The revisable layer is a field on a durable claim, not a file

#137's cleanest structural finding is Aaker's three-part sequence, in which brand position is *"that part of the brand identity that is to be actively communicated"* and the current positioning *"emphasizes the brand vision elements that are credible and deliverable."* A **filtered subset**, generated from the durable layer rather than authored beside it.

Taken literally, that kills the separate positioning artifact. **A revisable claim is a rendering of a durable one**, carrying authored wording and dated revision markers, and it lives as an optional `communicated` field on the claim it renders. The selection *is* which claims carry the field.

The alternative — revisable claims elicited and admitted on their own particulars — would run the bar twice over the same evidence, which ADR 0018 forbids under a different name (*"an already-admitted claim is never re-tested"*). And it would leave ADR 0013's rule unused where it fits best: **a revision is a change to the selection or the wording, never to the evidence**, which is *extent is fixed by the record and only wording is authored* arriving for the third time, after routing lines and after claims.

**The constraint this accepts on purpose: the revisable layer is structurally incapable of holding a claim the durable layer does not.** There is no communicated line without an admitted claim under it. That is the point rather than a limitation, but it is a real bound and it is better stated here than discovered when someone wants a tagline the company cannot support.

## Two artifacts, and the seam is not the one the hypothesis drew

**The brand record**, `layer: durable` — one file, all claim entries across the five slots, each optionally carrying its communicated rendering, plus the homework queue ADR 0018 created and gave nowhere to live.

**The design brief**, `layer: disposable` — generated per design engagement, dated and scoped to it, **never revised**; a second engagement gets a second brief. #137 found Wheeler separating this by hand and by name — *"the brand brief is not a creative brief"* — on scope and lifespan, and Johnson institutionalising the same seam as a numbered half-step.

So the count returns to two, and **neither name survives and the seam moved**. The hypothesis split strategy from execution; this splits **durable-and-accreting from disposable-and-per-engagement**, with execution-layer wording living inside the durable claim it renders.

**The design brief holds no claim entries.** It is a pointer to the brand record and the specific claims it translates, the engagement's constraints and deliverables (Wheeler's own creative-brief scope — *"we're going to look at three applications"*), references and adjectives, and an **anti-list** of what to avoid. No stamps — an approval on a disposable document has nothing to stay true for — no status, no particulars, no supersession. It may record **existing assets as facts** (*"we already use this colour"*), which Ehrenberg-Bass's recognition requirement makes a real input and which is not a claim about what the logo should be.

**A consequence for ADR 0017, which this does not reopen.** Its fourth claim class, *distinctive asset — exempt*, turns out to have **zero members**: the exemption is discharged entirely by the brief holding no claims. The class is a boundary marker, not a live class. Recorded because an agent reading ADR 0017 alone would go looking for distinctive-asset claim entries and find none.

### The names

`brand-canon` was dead on #137's evidence — zero occurrences in any primary source, and *canon* asserts fixity and completeness over an object with a revisable half and authority over one that [ADR 0008](0008-stance-record-replaces-persona-as-the-artifact-category.md)'s standing forbids from ever being an authority. #137 recommended **`brand-brief`** in its place, Wheeler's word, corroborated field by field.

**That recommendation is not taken, and the reason is that the object changed shape after the research ran.** What this ADR specifies accretes, carries per-claim particulars, stamps, statuses, supersession and a homework queue; Wheeler's brand brief is one page of prose. Adopting her name for a differently-shaped object imports reader expectations it will not meet — which is precisely the warning #137 issued about `brand-guidelines`, applied to its own recommendation once the object moved. And it would put two things called *brief* in one skill.

**`brand record`** instead, because the object is structurally a `stance record` and not a one-pager: accreting, evidence-bearing, per-entry admissibility, reference and never authority. The repo's precedent is on this side — ADR 0008 named for the structure over the field's nearest label, and this is the same call, made for the third time. #137's own instruction licenses it: six sources give six names, there is no incumbent to defeat, and the map *"should choose on fitness rather than on field precedent."*

**`design brief`** rather than `creative brief`, because the map scoped this to visual identity and named a human designer as the reader. Wheeler's pair survives in substance without importing a word that collides with the other artifact.

## The claim entry, and what it refuses to borrow

The stance record's **Position** is the nearest neighbour, and the temptation is to copy it whole.

**Borrowed:** `alternative[]` and `forfeit[]`, the named particulars, **append-only** per ADR 0018; **date provenance** on a forfeit, since ADR 0017 makes a value's forfeit *a dated episode* in as many words and a recalled date is reconstructed self-report either way; the per-claim **approval stamp**; and `superseded_by` / `superseded_at` on the old claim, which costs nothing and makes the pair readable as the time series it is.

**Refused — the question key.** A Position is keyed to the question it was elicited about, because that is what makes *"no entry covers this"* computable. **Here the slot does that job**, and a second key would be two indexes over one set.

**Refused — the evidenced-scope / residue split.** ADR 0017 already built the analogue and named it `uncosted claim`. A residue field would be a second quarantine with a different freeze rule on the same object.

**The voice test needs no particular types of its own.** ADR 0017's constructed test demands a named brand at the opposite pole and one specimen sentence this brand would refuse to publish. The first *is* a named alternative, Dunford's bound and all. The second *is* a forfeit — a forfeit is the specific thing a claim costs you, and a sentence you will not publish is a thing declined; ADR 0017 already reads it that way when it calls the refused sentence *Popper's prohibition criterion in the voice register*. So **the schema carries exactly two particular types across all four classes**, which matters more than it looks: ADR 0017 promised the eval suite a deterministic check for free, and a uniform pair is one check rather than four. One wrinkle recorded rather than smoothed: a refused sentence is a **standing prohibition, not an event**, so it carries the date it was recorded and date provenance does not apply to it.

### The four destinations are a status on the claim, not four sections

ADR 0017 routes a failing claim four ways and creates a fifth state. Sections would read more naturally; a field wins on the one property ADR 0017 made load-bearing — **an uncosted claim is *"never retrievable as a brand claim"***, and a section boundary is a weak fence for a retrieval rule where a field the retrieval mechanism reads is a real one.

`status: admitted | table-stakes | aspiration | uncosted | superseded`

Two things follow. **Superseded is a status, not a graveyard section**, so a superseded durable claim stays visible in its slot, dated — the *visible and expensive* ADR 0018 asked for, delivered by not moving it. And the **slot grouping survives the routing**, so a founder reading the values slot sees the admitted values beside the ones that are table stakes, which is the comparison that teaches the difference.

### A contradiction with an approved vision is a dated field, and never a verdict

The charter fixed that a contradiction with an upstream vision is surfaced to the founder and never silently resolved, and left the representation open. It is a dated `contradicts` field on the contradicting claim, naming the upstream reference and the line. Three boundaries, stated because each is a way this could quietly become a gate:

- **It never affects admissibility.** A claim that contradicts the vision can be perfectly admissible — it has a named alternative and a forfeit. Letting the vision veto a brand claim is the sibling being gated by the back door.
- **Nothing is ever written upstream.** The contradiction is recorded on the brand claim; the vision is not annotated. A sibling that edits the chain's artifacts is in the chain.
- **It is not a status**, so it composes with the routing field instead of competing for it. A claim is admitted *and* contradicting.

## Caps are ceilings with no floor, and they count admitted claims only

ADR 0017 deferred Collins's 3–5 cap and two-thirds quorum here.

**The quorum is discarded.** It is a Mars-Group device for a group of five to seven; there is one founder in the room, and porting it would mean inventing a fake second voter.

**The cap is adopted as a ceiling and the floor is refused.** Three independent sources corroborate shortness — Wheeler's one page, Aaker's two-to-five core elements, Keller's three-to-five words, Collins's three-to-five values. But **3–5 is a range, and a minimum of three is a denominator wearing a different hat**: ADR 0018 banned the progress meter because *"the only way to fill a brand field on demand is to admit a weak claim,"* and a floor of three is that instruction with a smaller number. **One admitted value is a legitimate artifact state.**

**Per-slot ceilings, and which are borrowed and which are argued:**

- `purpose` → **1**. Every source that has a purpose has exactly one. Nothing to argue.
- `audience` → **1**. Argued rather than borrowed, and the aggressive call here: a second audience is usually a refusal to choose, and choosing is what the forfeit tests. The payoff is that the displacement conversation below becomes the mechanism that forces the ICP decision, at the moment the founder tries to add a second — a better intervention than a rule telling them to pick one.
- `values`, `personality`, `differentiator` → **5**, on Collins and Aaker.
- Across the whole record, **at most one benchmark-backed generic claim**, which is Cohen's own condition on the 10x carve-out carried over intact: it may be claimed once, not sprinkled.

**A sixth admissible claim at a full slot is neither refused nor silently appended.** The founder is shown the six and asked which leaves; the one that leaves is **superseded with the reason `displaced`, dated**. Refusing the sixth would let arrival order beat evidence, and under ADR 0018 accretion guarantees the sixth arrives after the artifact already looks finished.

**The ceiling counts admitted claims only.** Table-stakes, aspiration, uncosted and superseded claims never consume it and carry no cap of their own. A cap on the failure sections would mean routing a failure could fill a slot, which puts the founder under pressure to **delete** the failing claim rather than route it — the one behaviour ADR 0017 exists to prevent, recreated by a second route.

**What that costs, stated because the looser version of this claim is false.** The record's *admitted* set is bounded absolutely — 1 + 5 + 5 + 1 + 5 = **seventeen claims, ever**. The *file* is not bounded, because the failure sections are uncapped. Since uncosted claims are never retrievable and table-stakes and aspiration claims make no differentiating pretence, the **retrievable set** is the bounded one, and that is the only version of the bound this ADR asserts.

## Two required slots, and values is deliberately not one of them

ADR 0018 defined a **usable layer** as one whose required fields carry admitted claims and left this ticket to fix which.

**The durable layer is usable when `differentiator` and `audience` each carry at least one admitted claim.** The pairing is Keller's, who demands a competitive frame of reference *and* points-of-difference together, and the differentiator is the strongest convergence in #137's entire pass — every serious source has a field whose whole job is *what is true of us and not of them*.

**The exclusion is the load-bearing half.** `purpose`, `values` and `personality` are not required, because **an artifact with values and purpose and no differentiator is exactly the workshop output this map was chartered against** — and Collins himself denies values do the differentiating job (*"the role of core ideology is to guide and inspire, not to differentiate"*). Making values sufficient for *usable* would let the skill declare success on the output it exists to prevent.

The cost is real and is correct behaviour: a founder whose first sitting was a values pass has a record reporting **not yet usable — no admitted differentiator**. That is ADR 0018's *name what is missing and what would close it*, and it is not a meter.

**The revisable layer has no usability condition at all** — it is a selection, and an empty selection is a legitimate state for a founder not yet communicating. The disposable layer already has none.

## Storage, and the pointer that keeps a sibling out of the chain

[#7](https://github.com/98kb/skills/issues/7) fixed a pluggable artifact backend with five operations and a one-hop upstream pointer, nesting mirroring the fan-out. Here the fan-out is one brand record → many design briefs.

- **File mode:** `docs/product/brand/record.md`, and `docs/product/brand/briefs/<slug>.md`. A directory rather than a flat file because there *is* fan-out — the reason #7 gave pitches a directory and the vision a file.
- **Issue mode:** a `product:brand-record` issue with `product:design-brief` issues as native children.
- **One brand record per repo.** Brand architecture is out of scope, so there is one product and one record.

**The pointer is the load-bearing part, and #7's `upstream:` is deliberately not used for it.** In #7's vocabulary `upstream` means *the artifact this was drawn from*, and `list-downstream` enumerates what was drawn from you. A brand record carrying `upstream: vision` would be returned by the vision's `list-downstream`, and **the sibling would be in the chain by directory listing** — the back door the charter ruled out at chartering.

So the brand record carries **`consulted:`** — a one-hop pointer recording that a vision or stance record **was read**, absent when nothing was. **The brand record never appears in any chain artifact's `list-downstream`.** The design brief, by contrast, carries a real `upstream:` to the brand record it was generated from, because that relation genuinely is derivation. The skill therefore uses four of #7's five operations against the chain and all five against its own pair, which is the correct asymmetry for a sibling rather than a gap.

## What this schema deliberately does not hold

- **No branch-4 status.** ADR 0017's fourth routing branch — *nothing there at all, stop writing and go fix the company* — has no value in the status enum, because ADR 0017 assigned *what the skill leaves behind when it fires* to [#147](https://github.com/98kb/skills/issues/147). Naming the hole means #147 fills a slot this schema left for it rather than retrofitting a mechanism. This is a gap, not an omission.
- **No messaging templates.** The hypothesis put them in `brand-guidelines`; #137 found **no primary source at all**, only agency content the map's sourcing bar excludes. Under this map's own rule they cannot land, and that is recorded rather than left as a silent absence.
- **No separate voice or content style guide**, despite #137 finding the content style guide is a real, well-specified published genre with its own structure. Under the durable/revisable relation above it is a rendering of personality claims. It may return as a generated view; it is not a store.
- **No frontmatter beyond `layer` and `consulted:`.** Absent by rule: any approval marker (computed — approved exactly when no claim lacks a stamp), any completion or progress field (ADR 0018 banned the denominator), any next-sitting date (derived from the homework queue), any claim count. The **homework queue lives in the body** as its own section, not in frontmatter — its entries are prose, it is the mode discriminator, and burying the record's only forward-looking state in metadata would hide the thing the next sitting opens on.

**One obligation from ADR 0018 is discharged differently than it was written.** It required that *"each artifact it lands must declare which layer it is"*, which a file holding durable claims with revisable fields inside them cannot do. **The layer is declared per element instead** — the record declares `layer: durable`, a communicated rendering is revisable-layer wherever it appears, the brief declares `layer: disposable`. That is strictly stronger than a file-level declaration and it is stated here rather than left to read as an oversight.

## Consequences

- **[#142](https://github.com/98kb/skills/issues/142) inherits a slot list, not a field list.** The interview is a per-class pass over a known set of slots, with per-slot ceilings and the displacement conversation as a real interview moment.
- **[#145](https://github.com/98kb/skills/issues/145) gains deterministic checks beyond ADR 0017's.** Slot membership, per-slot ceilings, the admitted-only counting rule, the required-slot pair, and the *"no communicated rendering without an admitted claim under it"* invariant are all mechanically gradable.
- **[#147](https://github.com/98kb/skills/issues/147) is unblocked with a named hole to fill**, per above.
- **The map's fog item on downstream reading closes** on the narrow argument: the retrievable set is bounded at seventeen claims, so there is no routing tier to design and no stance-index analogue is needed. The file is not bounded and no claim is made that it is.
- **Voice remains the weak leg** ADR 0017 flagged it as, and this schema does not strengthen it. If the constructed voice test fails in evals, the `personality` slot and its communicated rendering fall together and nothing else moves.

Decided on [Decide the artifact set and its schema (#141)](https://github.com/98kb/skills/issues/141), a ticket of [Map: to-brand-identity (#136)](https://github.com/98kb/skills/issues/136). Does not reopen [ADR 0017](0017-a-brand-claim-is-admitted-by-a-named-particular-and-the-instrument-is-selected-by-claim-class.md) or [ADR 0018](0018-brand-identity-accretes-by-sitting-and-the-freeze-falls-between-evidence-and-claim.md). Departs from [#137](https://github.com/98kb/skills/issues/137)'s recommended name for the strategy artifact, with the reason above. Uses [Artifact storage & cross-reference convention (#7)](https://github.com/98kb/skills/issues/7) and proposes no change to it.
