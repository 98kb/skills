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
