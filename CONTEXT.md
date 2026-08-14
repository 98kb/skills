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
One item in the roadmap artifact's ordered sequence — a Shape-Up-scale bet, sized and sequenced under the Strategic Frame, carrying its own Appetite, Evidence Threshold, and Status. The unit `to-milestone` later picks off as "the next unfinished roadmap move." Four Status states: pending → active (Shape Up's one-bet-at-a-time cadence — only one Move active at a time) → proven or invalidated. Moves list capped at 6 open (non-invalidated) Moves at a time; Description capped ~50 words.
_Avoid_: bet (Shape Up's own term, kept as a description of a Move's scale, not adopted as this pipeline's field name), feature (implies a single deliverable rather than a scoped, thresholded unit of the sequence)

**Evidence Threshold**:
A Move's stated condition for what would justify moving on to the next Move, with two sub-fields — **signal** (the observable result, e.g. "10 paying customers from cohort X") and **threshold** (the specific bar, e.g. "≥10") — deliberately lighter than to-pitch's four-part Riskiest Assumption (claim/threshold/test/timebox), since it's `to-milestone`, not `to-roadmap`, that owns *how* the check gets executed. Defined by `to-roadmap` at authoring/resequencing time, but judged (executed as a pass/fail gate check) by `to-milestone`, never by `to-roadmap` itself. The split that keeps "what would count as evidence" and "did the evidence actually come in" owned by different skills.
_Avoid_: success criteria (too generic, doesn't convey the split between stating and judging), evidence gate (that's `to-milestone`'s mechanism for executing against this threshold, not the threshold itself)

**Re-entry session**:
A `to-roadmap` invocation against an *existing* roadmap artifact — as opposed to a from-scratch authoring session — that reads prior Moves and whatever evidence has returned, decides resequence vs. no-op, and invokes the in-place revision mechanism from Revision propagation policy (#8) rather than a new versioning scheme.
_Avoid_: revision (too generic — every artifact in this pipeline can be revised per #8; this term specifically names the roadmap's own recurring authoring mode, not the general mechanism), re-plan (implies discarding the existing sequence rather than resequencing it)

### to-milestone artifact

**Milestone (artifact)**:
One gate-check `to-milestone` produces each time it judges a Move's Evidence Threshold against the founder's reported evidence — unrelated to the "Milestone map" term above, a different-layer Wayfinder concept from this same repo's own planning process. Snapshots the Move being judged (roadmap link + positional index + Description, since Moves carry no id of their own) and the Evidence Threshold being judged as they stood at check time — not a live pointer, since a later `to-roadmap` Re-entry session can resequence or revise both. A Move accumulates one Milestone per gate-check, never overwritten, so its full history of checks stays readable.
_Avoid_: Milestone map (the unrelated Wayfinder term above), gate-check result (undersells that it's a durable, stored artifact rather than a momentary computation), review (too generic, collides with unrelated review practices elsewhere in engineering)

**Verdict**:
A Milestone's decision field: advance, persevere, pivot, or stop. Advance and persevere continue the roadmap unchanged (move to the next Move, or keep working the active one); pivot hands off to `to-roadmap`'s Re-entry session; stop ends further Moves on this roadmap. A root-cause narrative accompanies every Verdict except advance, mirroring the reviewed traditions' pattern of writing up misses, not hits.
_Avoid_: decision (too generic — every Wayfinder ticket in this repo is also "a decision"), outcome (implies something that just happens rather than a judged call), grade (evokes OKR's continuous 0.0–1.0 scoring, which this four-value enum deliberately isn't)
