# Agent Skills

This repo hosts a library of Agent Skills (SKILL.md packages) and the conventions — issue tracker, triage labels, domain docs, Wayfinder — that these skills share.

## Language

### Wayfinder two-level extension

**Milestone map (L1)**:
A Wayfinder map whose children include one or more child maps, not just tickets. Carries the `wayfinder:map` label, same as any top-level map; nothing distinguishes it from an ordinary single-level map except that at least one of its children is itself a map.
_Avoid_: parent map, root map, top-level map

**Child map (L2)**:
A Wayfinder map nested one level under a milestone map, resolving one facet of the milestone's destination on its own Destination/Notes/Decisions-so-far/Fog body. Created as a direct sub-issue of the milestone map (never of an intermediate ticket) and carries the `wayfinder:map:child` label — distinct from `wayfinder:map` — so it reads apart from both ordinary tickets and the milestone map itself in a sub-issue list.
_Avoid_: sub-map, nested map

**Milestone-map state**:
The stage a milestone map is in, always derived by querying the map and its children — never stored as a label or field, since GitHub gives the issue only native open/closed. Stages: `chartered` (created, no children yet) → `active` (≥1 child open) → `children-complete` (all children closed, map still open) → optionally `evidence-gate-pending` (children-complete, but the milestone's completion criterion needs more than that) → `complete` (map closed).

**Child-map state**:
The stage a child map is in. Uses the same two states as an ordinary single-level Wayfinder map: open (tickets remain or destination not yet reached) and closed (destination reached, decisions recorded) — no additional gate at this level.

### Skill composition

**Invoke**:
Calling another skill directly through the `Skill` tool at runtime. Only possible for a skill without `disable-model-invocation` in its frontmatter — the tool itself refuses to call flagged skills.
_Avoid_: call, run, use (as a stand-in for a live Skill-tool call)

**Defer**:
Stopping and telling the human to run a skill's slash command themselves, because the skill carries `disable-model-invocation` and cannot be invoked programmatically or have its workflow replicated inline. The composing skill does not attempt the referenced skill's job itself.
_Avoid_: handoff (ambiguous with the pipeline's document handoffs between vision/pitch/roadmap/milestone artifacts), hand off to the skill

**Embed**:
Folding a short, specific discipline borrowed from an invokable skill directly into a composing skill's own text, with no runtime dependency on the source skill at all. Reserved for cases too small to warrant a full Skill-tool round-trip — not a general substitute for invoke.
_Avoid_: adapt, inline (as a distinct fourth mode — collapsed into embed; see ADR 0002)

### Evaluation framework

**Founder persona**:
A scripted LLM persona that plays the founder's side of a HITL skill's conversation during an eval run, drawn from one of three categories: cooperative/sharp, evasive/vague, or boundary-testing.
_Avoid_: test user, mock founder

**Eval scenario**:
One run of a skill against a single founder persona, graded against that skill's rubric and the shared deterministic checks to a pass/fail result.
_Avoid_: test case (implies a classic input/output assertion, which a HITL skill's conversational output can't be checked with)

**Deterministic check**:
A mechanical, judgment-free half of an eval scenario's grade — approval-marker presence (see Approval & completion gate pattern, #9), composition-rule compliance (see Invoke/Defer/Embed above), or required artifact-backend fields (see Artifact storage & cross-reference convention, #7) — as opposed to the rubric-graded, judgment-based half.
_Avoid_: assertion (too generic; doesn't convey it's one half of a specific two-part grading split)

**Eval-complete**:
The state a skill reaches once its scenario suite — at least one eval scenario per founder-persona category — passes grading. The gate before that skill is considered ready for `/to-spec` / `/to-tickets` / `/implement`.
_Avoid_: tested, passing (too vague — doesn't convey the specific gate)

### to-vision artifact

**Vision Statement**:
The vision artifact's one-sentence headline field — the single citable line downstream artifacts (a pitch, roadmap, or milestone) quote when referencing "the vision," distinct from the fuller Future State field beneath it.
_Avoid_: vision (ambiguous with the artifact as a whole), mission (see Cagan's vision-vs-mission distinction — a mission is a durable org-wide slogan, a vision is product-specific and falsifiable)

**Vision Pivot Trigger**:
The vision artifact's mandatory field stating the falsifiable condition under which the vision itself — not a discovery-level detail — would be wrong, per Cagan's vision-pivot vs. discovery-pivot split. The mechanism a downstream skill checks against when flagging a possible vision-level revision (see Revision propagation policy, #8).
_Avoid_: pivot (too generic — a discovery pivot is a different, lower-stakes thing this term deliberately excludes)

### to-pitch artifact

**Appetite**:
The pitch artifact's fixed-budget field: small (≤2 weeks) or big (≤6 weeks), inherited from Shape Up's own two-tier timebox. Fixes a scope constraint on the Solution sketch rather than estimating one — a pitch is written to fit the appetite, never the other way around. Kept as a comparable unit for a future cross-pitch portfolio-sequencing mechanism, which does not exist yet.
_Avoid_: estimate, budget (implies cost/time is measured after the fact, not fixed before writing)

**Riskiest Assumption**:
One structured item (of up to three, ranked) in the pitch artifact's Riskiest Assumptions & Cheap Validation Plan field, with four sub-fields: claim, threshold, test, timebox. The structural home for a falsifiable claim and its cheap test — the falsifiability-check mechanism that populates and validates it belongs to `to-pitch`'s grilling question tree (#22), not to the schema itself.
_Avoid_: risk, assumption (both too generic — this term specifically means a ranked, structurally falsifiable item, not any stated belief)

### to-roadmap artifact

**Strategic Frame**:
The roadmap artifact's single structured field folding in the problem space this roadmap claims, its constraints, and its differentiation — the narrow, single-pitch-scoped replacement for "Wedge." Deliberately renamed away from "Wedge" because every primary source's own worked wedge/beachhead example describes expansion into a *different* product or market than the starting point, a claim a `to-roadmap` session (one pitch in, no vision re-fetch, no cross-roadmap view) has no evidence to back. Later Moves stay within this one pitch's own Problem/Solution bounds — the "expand" is Move 2/3/4 addressing adjacent parts of the *same* approved problem space, not a cross-market trajectory. Capped ~150 words. See [ADR 0006](docs/adr/0006-to-roadmap-artifact-schema-strategic-frame-replaces-wedge.md).
_Avoid_: Wedge (the term this replaces — carries a cross-market connotation from its primary sources that this field's narrow scope can't support), strategy (too generic — the artifact's strategic layer is more than just this one field), positioning (a different, narrower marketing-specific term not confirmed as the right primary source)

**Move**:
One item in the roadmap artifact's ordered sequence — a Shape-Up-scale bet, sized and sequenced under the Strategic Frame, carrying its own Appetite, Evidence Threshold, Status, and Target Check-in. The unit `to-milestone` later picks off as "the next unfinished roadmap move." Four Status states: pending → active (Shape Up's one-bet-at-a-time cadence — only one Move active at a time) → proven or invalidated. Moves list capped at 6 open (non-invalidated) Moves at a time; Description capped ~50 words.
_Avoid_: bet (Shape Up's own term, kept as a description of a Move's scale, not adopted as this pipeline's field name), feature (implies a single deliverable rather than a scoped, thresholded unit of the sequence)

**Target Check-in**:
A Move's stored expected check-in date — computed once as activation date plus an Appetite-derived interval (small Appetite → ~2 week interval, big → ~6 week, mirroring to-pitch's own tiered Appetite/Shape Up cycle-length pairing) when the Move's Status flips to active, and recomputed the same way on every persevere Verdict, so a persevere doesn't leave the Move reading as instantly overdue. Read by the passive-surfacing check in `to-roadmap`'s Re-entry session, `to-milestone`, and `/wayfinder` — each surfaces the active Move if its Target Check-in has passed, before doing anything else, since no notification/platform layer exists to push this proactively. Scoped to whatever roadmap the invoking skill can already see via the artifact backend (#7), not a cross-project sweep. A founder can still gate-check earlier than the Target Check-in on a decisive signal — there's no separate mechanism for "early" beyond an ordinary `to-milestone` invocation, visible after the fact by comparing the resulting gate-check date to the snapshotted Target Check-in.
_Avoid_: due date, deadline (both imply a hard commitment/consequence; this is an expectation a passive check surfaces, not a gate that blocks anything), reminder (that's the passive-surfacing mechanism's behavior, not the field itself)

**Evidence Threshold**:
A Move's stated condition for what would justify moving on to the next Move, with two sub-fields — **signal** (the observable result, e.g. "10 paying customers from cohort X") and **threshold** (the specific bar, e.g. "≥10") — deliberately lighter than to-pitch's four-part Riskiest Assumption (claim/threshold/test/timebox), since it's `to-milestone`, not `to-roadmap`, that owns *how* the check gets executed. Defined by `to-roadmap` at authoring/resequencing time, but judged (executed as a pass/fail gate check) by `to-milestone`, never by `to-roadmap` itself. The split that keeps "what would count as evidence" and "did the evidence actually come in" owned by different skills.
_Avoid_: success criteria (too generic, doesn't convey the split between stating and judging), evidence gate (that's `to-milestone`'s mechanism for executing against this threshold, not the threshold itself)

**Re-entry session**:
A `to-roadmap` invocation against an *existing* roadmap artifact — as opposed to a from-scratch authoring session — that reads prior Moves and whatever evidence has returned, decides resequence vs. no-op, and invokes the in-place revision mechanism from Revision propagation policy (#8) rather than a new versioning scheme.
_Avoid_: revision (too generic — every artifact in this pipeline can be revised per #8; this term specifically names the roadmap's own recurring authoring mode, not the general mechanism), re-plan (implies discarding the existing sequence rather than resequencing it)

### to-milestone artifact

**Milestone (artifact)**:
One gate-check `to-milestone` produces each time it judges a Move's Evidence Threshold against the founder's reported evidence — unrelated to the "Milestone map" term above, a different-layer Wayfinder concept from this same repo's own planning process. Snapshots the Move being judged (roadmap link + positional index + Description, since Moves carry no id of their own), the Evidence Threshold being judged, and the Target Check-in it was measured against, as they stood at check time — not a live pointer, since a later `to-roadmap` Re-entry session can resequence or revise all three. Recording both the snapshotted Target Check-in and the gate-check's own date shows whether a check landed early, on time, or late. A Move accumulates one Milestone per gate-check, never overwritten, so its full history of checks stays readable.
_Avoid_: Milestone map (the unrelated Wayfinder term above), gate-check result (undersells that it's a durable, stored artifact rather than a momentary computation), review (too generic, collides with unrelated review practices elsewhere in engineering)

**Verdict**:
A Milestone's decision field: advance, persevere, pivot, or stop. Advance and persevere continue the roadmap unchanged (move to the next Move, or keep working the active one); pivot hands off to `to-roadmap`'s Re-entry session; stop ends further Moves on this roadmap. A root-cause narrative accompanies every Verdict except an undisputed advance, mirroring the reviewed traditions' pattern of writing up misses, not hits — an advance the founder reached only by overriding a divergent mechanical reading (per the one-challenge-then-stand rule) still gets a narrative, capturing that divergence rather than treating it as clean.
_Avoid_: decision (too generic — every Wayfinder ticket in this repo is also "a decision"), outcome (implies something that just happens rather than a judged call), grade (evokes OKR's continuous 0.0–1.0 scoring, which this four-value enum deliberately isn't)

### to-stance artifact

**Stance record**:
The artifact `to-stance` produces — a durable, frozen record of one real named person's positions, read downstream as **context enrichment** so that later work is informed by the stance that produced the product rather than improvising against nothing. Its subject is the **delta** between the dispositions that person states and the conduct that supports them, not the dispositions alone. Deliberately not a member of the vision → pitch → roadmap → milestone chain: nothing gates on it, because a gate would be the first step toward it becoming an authority. Named for a genuine gap between established categories — five required properties owned by five different categories, none holding more than four — with the IBIS issue record as the nearest neighbour to build on. Reference material, never an authority; every conflict is resolved by a human. See [ADR 0008](docs/adr/0008-stance-record-replaces-persona-as-the-artifact-category.md) and [ADR 0011](docs/adr/0011-conditional-go-the-stance-record-is-the-delta-between-stated-and-evidenced.md).
_Avoid_: persona, archetype (both denote a fictional composite of *users* as a design target, and pull impersonation sections in by gravity — the category this term replaces), profile (implies psychometrics and a completeness claim nothing supports), principles, credo, charter, doctrine, playbook (all prescriptive by genre — the standing is exactly wrong), founder decision record (implies bindingness and collides with `docs/adr/`)

**Position**:
One entry in a stance record, keyed to **the question it was elicited about** rather than to a topic, and inadmissible unless it cites at least one dated episode. The question key is what makes "no entry covers this" a *computable* condition an agent can check, as opposed to "does this stance extend to X" — a judgement it will silently get wrong. Carries the standing disposition verbatim alongside an evidenced scope and a residue, so a reader sees both what the person asserts and how far his conduct actually reaches. Arrived at independently by three disjoint literatures: agent-memory/retrieval sources named the retrievable unit a "position file"; gIBIS defines "A Position is a statement or assertion which resolves the Issue"; and #80's own prior-art notes used the noun twice unprompted. **Frozen, full stop** — a later position on the same conflict class does not replace it, because the conduct its episodes record is not undone by whatever the person decides afterwards. See [ADR 0015](docs/adr/0015-two-legal-routing-lines-are-correct-and-a-position-is-never-superseded.md).
_Avoid_: opinion, belief, value (all name the content without the question key, which is the part doing the structural work), entry (too generic — a stance record holds more than one kind), superseded, supersedes (no position ever replaces another — two dated positions on one conflict class are a time series whose delta is the reader's to read, and the word invites a reader to discard the earlier point)

**Episode**:
A dated occasion a position cites as its evidence — what was at stake, what the person did, and the reason he gave at the time. The evidence layer of a stance record, and the thing the interview must press for separately, since a person asked what he thinks returns standing rules and never occasions. See [ADR 0009](docs/adr/0009-position-altitude-is-a-trade-off-not-a-product-artifact.md).
_Avoid_: anecdote, story, example (all imply illustration of a rule already stated, where an episode is what makes the rule admissible at all), decision (too generic in a repo whose ADRs and Wayfinder tickets are also decisions)

**Evidenced scope**:
The part of a position's standing disposition that its cited episodes actually support. The only part the stance index routes to, and therefore the only part a downstream reader can retrieve.
_Avoid_: scope (bare, ambiguous with a position's defensibility cap), coverage (belongs to the record-level statement of what the record is silent on)

**Residue**:
The part of a position's standing disposition that no cited episode reaches — recorded in the position, marked as stated and unevidenced, deliberately given no routing line — so an unevidenced absolute cannot be retrieved and therefore cannot be projected onto — and simultaneously reopened in the open-questions register so a later sitting presses for the incident that would close it. One occurrence of the record's single quarantine invariant: **a stated disposition that no episode reaches is recorded and never retrievable, wherever it sits.** Its other occurrence is a register entry's *disposition on file*. Stated as one rule rather than two agreeing rules by [ADR 0014](docs/adr/0014-the-register-is-adjacent-to-the-always-loaded-tier-not-in-it.md).
_Avoid_: gap, remainder (both read as an oversight rather than a recorded finding), unsupported claim (implies the entry is defective, where the residue is the artifact's product)

**Disposition on file**:
The field of an open-questions register entry holding what the subject asserts about the entry's trade-off with no episode closing it — recorded so the next sitting has an agenda, never retrieved. Governed by the same quarantine invariant as *residue*, and for `residue`-origin entries it is literally the same material in a second location. The half of a register entry that can never move on-tier; the other half — the bare **question** — is a statement of silence and carries no claim.
_Avoid_: weak position, draft position (a register entry is not a position at any strength — it is the record's admission that it cannot answer), disposition (bare, ambiguous with a position's *standing disposition*, which is evidenced in part)

**Conflict class**:
The trade-off axis a position sits on. Carries the differentiation that named position types (protected value, objective, guiding principle) used to, those having been dissolved into interview instruments once the schema was found never to act on them. Sitting on the routing line, it does a **second job** in the always-loaded tier: two positions bearing on one question share an axis, so a reader who matched one line can see from the index alone that another bears on it — without retrieving anything, and without a marker inside an entry they have already decided to trust. This tells a reader that a neighbour *exists* on the axis, not which of the two is later. See [ADR 0015](docs/adr/0015-two-legal-routing-lines-are-correct-and-a-position-is-never-superseded.md).
_Avoid_: category, type (both name the dissolved taxonomy this replaces), topic (a position is keyed to a question, never to a topic)

**Date provenance**:
Whether an episode's date was recorded **contemporaneously**, at the decision, or **recalled** later at a sitting. Both clear the dated-episode bar and they are not equal evidence — a recalled date is reconstructed self-report, which is precisely what a decision journal exists to avoid.
_Avoid_: date, timestamp (both name the value rather than how it was known, which is the part carrying evidential weight)

**Open-questions register**:
The layer of a stance record holding trade-offs that have been named but not closed by an episode. **One mechanism with three origins**, carried by an `origin` field — `asked` (a sitting reached no incident), `residue` (reopened from a position's residue), `observed` (an agent recorded a decision taken at a no-match) — so it is a product of position-writing rather than a leftover bin, and at a seed sitting it is the record's entire output. `observed` is the only origin yielding a contemporaneous date, so origin *predicts* date provenance rather than duplicating it. Carries **no status vocabulary**: an entry is open exactly when it has no dated closure append naming the position that closed it. **Sits off the always-loaded tier** and is reached by a **no-match read** — its relation to that tier is adjacency, not membership, because it is mostly quarantined material and only secondarily because it outgrows the routing table. Entries carry a **conflict class**, which is deliberately *excluded* from the stance index's derived-fitness reading: a register entry names a class the record is not competent for. See [ADR 0012](docs/adr/0012-to-stance-mechanisms-computed-over-declared-and-approval-is-authorship.md) and [ADR 0014](docs/adr/0014-the-register-is-adjacent-to-the-always-loaded-tier-not-in-it.md).
_Avoid_: backlog (agent-flagged entries are this mechanism's `observed` origin, not a second store — and they carry the register's strongest evidence, so a to-do-list reading inverts their value), TODO, parking lot (both imply work pending rather than a recorded silence), open/closed/declined as labels (status is computed from appends, never asserted)

**Stance index**:
The always-loaded tier of a stance record: a routing table whose unit is the **routing line**, one per position, pointing at the retrievable position. The set of **conflict classes** its lines carry makes the record's competence a *derived* fact — the classes present — rather than a declared fitness statement. Bounded by a tripwire on **total always-loaded bytes** (25KB), adopted as convention with vendor-convergent provenance and explicitly not as a measured cliff; the 200-line meter is dropped, having been measured at roughly 25 years away. Per ISAD(G)/DACS the index is *description* — authored as a separate act, revisable, and carrying its own **description control**; the positions it points at are *record* and are frozen. **Holds routing lines and description control and nothing else** — the open-questions register and every quarantined disposition are excluded, so the tier grows only with positions. Nothing in it can shed: a routing line can be neither compressed nor dropped, so the byte tripwire's action is an **escalation to the human at the next sitting**, not a mechanical one. An **empty routing table is a record state, not a defect** — `covers` makes a present-but-empty index self-describing. See [ADR 0011](docs/adr/0011-conditional-go-the-stance-record-is-the-delta-between-stated-and-evidenced.md), [ADR 0012](docs/adr/0012-to-stance-mechanisms-computed-over-declared-and-approval-is-authorship.md), [ADR 0013](docs/adr/0013-routing-line-extent-is-fixed-revision-is-a-wording-act.md) and [ADR 0014](docs/adr/0014-the-register-is-adjacent-to-the-always-loaded-tier-not-in-it.md).
_Avoid_: summary, overview (both imply a condensed restatement of the positions; this is a routing table that states when to look, not what the answer is), table of contents (understates that the wording is the retrieval mechanism), coverage statement (a prose enumeration of what the record does not cover — prototyped in this tier and deliberately removed by ADR 0014; the empty routing table already delivers the computable no-match, and the register carries the rest off-tier)

**Routing line**:
The stance index's unit — one per position, stating *when to consult it* in the vocabulary a downstream dilemma would arrive in, and carrying the position's conflict class. **Co-extensive with its position's evidenced scope**: extent is fixed by the record and only wording is authored. Findability is lexical rather than ranked, so that wording is the entire discoverability surface — a position with no routing line will never be retrieved. Because retrieval is lexical, **wording length and reach are the same quantity**, so a routing line **cannot be compressed**: a shorter line is a narrower line, and narrowing below evidenced scope is a floor breach. **Retained at full extent for the life of the record**: it is never dropped or narrowed on account of a later position, and two legal lines matching one question is correct behaviour rather than a collision. See [ADR 0013](docs/adr/0013-routing-line-extent-is-fixed-revision-is-a-wording-act.md), [ADR 0014](docs/adr/0014-the-register-is-adjacent-to-the-always-loaded-tier-not-in-it.md) and [ADR 0015](docs/adr/0015-two-legal-routing-lines-are-correct-and-a-position-is-never-superseded.md).
_Avoid_: index line (the term prior records use — reads as formatting over a position, where this is a separately authored act with its own provenance), keyword, tag (both imply a topic label, where a routing line names an occasion for consulting)

**Description control**:
The stance index's own provenance — who described, when, at which revision, and what span of positions the description covers — kept separate from the record it describes, per ISAD(G) I.11 / DACS Principle 6. Its constant-size fields sit in the always-loaded tier; the dated **revision log** beneath them, which holds each superseded wording, sits off-tier. See [ADR 0013](docs/adr/0013-routing-line-extent-is-fixed-revision-is-a-wording-act.md).
_Avoid_: changelog, history (both imply the positions changed, where the positions are frozen and only the description moves), metadata (silent on the description/record quarantine that is the whole point)

**No-match read**:
The stance record's third access mode, alongside the always-loaded stance index and per-question position retrieval. The open-questions register is opened only by an agent that has already matched nothing in the index — to check whether the question is already registered, and to append a dated occurrence or open a new `observed` entry. Named because the implementing map has to wire it and an unnamed access mode is a wiring instruction nobody can state. The consumer is the agent that just missed, not the reader and not `/to-stance` alone. See [ADR 0014](docs/adr/0014-the-register-is-adjacent-to-the-always-loaded-tier-not-in-it.md).
_Avoid_: lazy load, on-demand load (both frame it as a performance optimisation over a tier that would otherwise be loaded; the register is off-tier because it is quarantined material, and the byte saving is secondary), fallback (implies the register answers the question the index missed — it answers nothing and is written to, not read for an answer)
