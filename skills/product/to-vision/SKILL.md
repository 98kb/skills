---
name: to-vision
description: Interview a founder to produce a sharp, falsifiable product vision — the durable, product-specific artifact `to-pitch` bridges from. Use when a founder wants to write, or start, a product vision.
disable-model-invocation: true
compatibility: claude-code
---

# to-vision

Run an adaptive interview that turns a founder's raw idea into a seven-field vision artifact, gate it through a sharpness check, and record it only once the founder explicitly approves.

## Before starting

Check whether `docs/product/vision.md` already exists in the founder's repo.

- **If it doesn't exist**, this is a from-scratch session. Proceed with the interview below.
- **If it exists**, read it and tell the founder a vision is already recorded there, showing them its current fields. Continue with the interview below, using the existing content as the starting point for each field's answer (read it back to the founder and let them confirm or revise it, rather than asking cold). Check the frontmatter for `approved_by`/`approved_at` first, since that changes what an edit here means, then follow whichever of these two applies:
  - **Drafted** (no `approved_by`/`approved_at` present) — an ordinary continuation of an unfinished draft. `update` the file in place, rather than treating this as a second `create`, once the founder approves (see Approval and Writing the artifact).
  - **Approved** (`approved_by`/`approved_at` present) — any field edit the founder lands here is a *revision* to an already-approved artifact. As soon as an edited field is confirmed, `update` `docs/product/vision.md` in place with the change — same mechanism, no parallel version history — and in that same write add a dated revision-reason marker to the frontmatter (see Writing the artifact) and clear `approved_by`/`approved_at` back to unset. Do this immediately; a stale approval must never survive an in-place edit, not even for the rest of this session. The vision is now back to drafted status — continue the session (further edits, gate-check) as normal, and don't write `approved_by`/`approved_at` again until the founder gives a fresh explicit approval (see Approval).

## The artifact schema

The vision artifact has seven fields. Six are mandatory; only Additional Grounding is optional:

| Field | Mandatory? |
|---|---|
| Vision Statement | Yes |
| Customer & Problem | Yes |
| Future State | Yes |
| Grounding Insight | Yes |
| Why Us / Why Now | Yes |
| Additional Grounding | No |
| Vision Pivot Trigger | Yes |

This is the field order the artifact is **stored** in. It is not the order you **ask** questions in — see below.

## Interview order

Ask one base question per field, in this order. Substance first, headline second, falsifiability last. Ask questions one at a time, in a natural conversational voice — don't dump the whole list at once.

For every field except Additional Grounding, check the founder's answer against that field's sharpness test below. If it's vague, generic, or unfalsifiable, fire that field's specific follow-up rather than accepting the answer outright. Escalation is capped at 2 follow-up attempts per field. What happens at the cap differs by field: every field except Grounding Insight is **accepted but flagged** once the cap is hit — take the founder's best answer, note that the field is flagged (for disclosure at the end-of-session gate-check), and move on without looping further. Grounding Insight is the one non-negotiable field — see its entry below.

The **swap-test** — "if you swapped your company's name for a direct competitor's, would this still ring true?" — catches answers that could describe any company. It's used as written for Vision Statement and Future State; Why Us/Why Now uses an extended form of it.

1. **Customer & Problem** — "Who exactly is this for, and what's broken for them today?" If the answer names a generic customer (a demographic, "everyone who...", etc.) rather than a specific person or role, ask: "Name the one person or role you'd actually go talk to this week." Capped at 2 attempts, then accept and flag.
2. **Future State** — "In 2–5 years, what does the world look like for that customer once this exists?" If the answer is vague or aspirational, apply the swap-test: "If you swapped your company's name for a direct competitor's, would this still ring true?" A "yes" means it's too generic — push for the differentiator. Capped at 2 attempts, then accept and flag.
3. **Grounding Insight** — "What's the one insight, trend, or technology bet you're building on — something you'd be willing to be proven wrong about?" If the answer restates the problem instead of naming a belief, say so and re-ask: "That's the problem again — what's the belief that makes you think it's solvable now?" Capped at 2 attempts. **If a real Grounding Insight is still absent or inadequate after 2 attempts, end the session right here** — do not assemble a draft, do not run the gate-check below, and do not offer approval. This is the one field with no partial credit: a vision without a grounding insight isn't a vision.
4. **Why Us / Why Now** — "Why is now the moment, and why are you positioned to win it?" If the answer is generic or timeless, apply the extended swap-test: "Would this be equally true of a competitor, or true two years ago?" Capped at 2 attempts, then accept and flag.
5. **Additional Grounding** (single offer, no chase) — "Anything else grounding this — a competitive gap, capability, or GTM angle worth naming?" If the founder has nothing to add, skip this field immediately — don't ask again. No escalation applies to this field.
6. **Vision Statement** (synthesized, not asked cold) — "Now say it in one line — the Amazon-headline version of everything you just told me." Draft this yourself from the answers gathered so far, offer it to the founder, and let them adjust it, rather than asking them to write a headline from nothing. If the draft (or the founder's revision of it) reads like a mission statement, apply the swap-test. Capped at 2 attempts, then accept and flag.
7. **Vision Pivot Trigger** — "What would have to happen — or fail to happen — for you to conclude this vision itself was wrong?" If the answer is an unfalsifiable hedge, ask: "What specific customer behavior, market signal, or metric would tell you that?" Capped at 2 attempts; a 3rd still-vague answer is accepted, but note the gap directly in the Vision Pivot Trigger prose you write into the artifact (not just disclosed at the gate-check, since this field's whole point is to be checkable later) — e.g. "not yet tied to a specific, checkable signal."

## Staying in scope

At any point during the interview, a founder may try to pull the session out of vision scope. Two situations to decline and redirect, rather than let derail or end the session:

- **Skipping ahead to `to-roadmap`** — e.g. "just turn this into next quarter's roadmap," or any request to produce a roadmap, prioritized backlog, or timeline. Decline: that's `to-roadmap`'s job, not this session's.
- **Leaking `to-pitch`'s field vocabulary** — Problem, Appetite, Solution sketch, Riskiest Assumptions, Rabbit Holes, No-gos, Open Questions. Don't fold content shaped like any of these into the seven vision fields, even if the founder phrases it as an addition to an answer already given — a vision that drifts into pitch-shaped content is as out of scope as one that drifts into a roadmap.
- **Asking the skill to self-serve research** — e.g. "go research my competitors" or "figure out the market trend for me." Decline to fabricate or look up that research yourself. Tell the founder the Grounding Insight has to be their own belief, not an invented one, and ask them to supply it directly — this holds regardless of which field you were asking about when the request came in, since the Grounding Insight field is specifically where fabricated research would otherwise land. Don't write speculative or fabricated research into the Grounding Insight field, or any other field, to fill this gap.

Both declines are conversational, not session-ending: after redirecting, resume the interview at the field you were on before the request.

Separately from scope, watch every answer for vague or overloaded **terms** as they come up — see "Sharpening vague terms" below.

## Sharpening vague terms

While listening to any field answer, watch for individual terms that are vague or overloaded — words that could mean more than one thing in this founder's context (e.g. "the practice" when it's unclear whether that means the clinic org or an individual practitioner; "user" vs. "account"; "the platform"). This is a check on the founder's **language**, not on the answer's overall specificity — it's independent of, and can fire alongside or apart from, any other sharpness handling elsewhere in this document.

When a term like this appears:

1. Pause before moving to the next question.
2. Embed `/domain-modeling`'s "sharpen fuzzy language" move only — propose the precise alternatives and ask the founder to pick (e.g. "You said 'the practice' — do you mean the clinic as an organization, or the person running it? Those are different things."). Don't reach for `/domain-modeling`'s "challenge against the glossary" move or its `CONTEXT.md`/`CONTEXT-MAP.md` read/write machinery: `to-vision` never reads or writes those files, and the founder isn't expected to already have a project glossary to challenge against.
3. Once the founder clarifies, fold the sharpened language directly into that field's own working answer — it flows into the draft naturally when fields are assembled later. Don't produce a separate glossary note, table, or file; the sharpening's only output is a better-worded field.

Only fire this when a term is actually vague or overloaded. A clear, unambiguous answer should pass straight through to the next question with no detour.

## Assembling the draft

Once all seven questions have been asked, assemble the draft in **stored field order**: Vision Statement, Customer & Problem, Future State, Grounding Insight, Why Us / Why Now, Additional Grounding, Vision Pivot Trigger.

## Gate-check

Before offering the draft for approval, re-read the full assembled draft once, end to end, against:

- **The 3-part composite sharpness test**: (1) names a specific customer and future state, not a platitude; (2) commits to at least one grounding insight; (3) is falsifiable — a reader could point to it and say "this didn't happen."
- **All 3 swap-tests**: the Vision Statement swap-test, the Future State swap-test, and Why Us/Why Now's extended swap-test ("would this be equally true of a competitor, or true two years ago?").

This is a coherence check over the whole assembled draft, not a repeat of the per-field escalation above — it can catch problems that only become visible once the fields sit next to each other. If a field fails one of these tests and wasn't already flagged during the interview, flag it now.

Show the founder the full assembled draft, then disclose every flagged field in plain language — naming the field and what's weak about it — **before** asking for approval. Approving with visible flags is a legitimate, non-blocking outcome; don't withhold or delay the approval request just because flags exist.

## Approval

Ask the founder to explicitly approve the draft (e.g. "Do you approve this vision?"). Wait for an explicit affirmative reply — don't infer approval from a neutral or ambiguous response.

Once given, confirm back in your own words ("Recording this as approved.") before writing anything. This confirmation step exists so an offhand "looks good" is never silently treated as a formal approval.

Re-approving a vision after a revision cleared its `approved_by`/`approved_at` (see Before starting) uses this exact same mechanism — an explicit affirmative phrase, confirmed back, before `approved_by`/`approved_at` are written again. No separate re-approval flow exists.

## Writing the artifact

Write `docs/product/vision.md` with this shape:

```markdown
---
approved_by: <founder's name or identifier, as given in this session>
approved_at: <ISO 8601 timestamp, at the moment of approval>
revised_at: <ISO 8601 timestamp, at the moment of the most recent revision>
revision_reason: <one-line reason for the most recent revision, in the founder's words>
---

# Vision

## Vision Statement

<one-sentence headline>

## Customer & Problem

<prose>

## Future State

<prose>

## Grounding Insight

<prose>

## Why Us / Why Now

<prose>

## Additional Grounding

<prose — section omitted entirely if the founder had nothing to add>

## Vision Pivot Trigger

<prose>
```

The frontmatter `approved_by`/`approved_at` pair is the artifact's approval marker — its presence is what distinguishes an approved vision from a merely-drafted one. In a from-scratch or still-drafted session, only write the file after the founder has approved; a session that ends before approval produces no file. This rule doesn't apply to the Approved case in Before starting: there, the file already exists and approval was already given in an earlier session, so a landed edit writes immediately, as described there — waiting for a fresh approval before writing would leave the stale, now-inaccurate approval marker on disk in the meantime, which is exactly what that section exists to prevent.

The frontmatter `revised_at`/`revision_reason` pair is the artifact's revision-reason marker — it records only the most recent in-place edit to an already-approved vision (no parallel version history), and is written per the Approved case in Before starting: at the moment the edit lands, alongside clearing `approved_by`/`approved_at`. A vision that has never been revised omits this pair entirely — leave the two keys out of the frontmatter rather than writing them empty. Likewise, "clear `approved_by`/`approved_at` back to unset" means removing those two keys from the frontmatter, not writing them as empty values.

`docs/product/vision.md` has no upstream artifact to point back to — it's the root of the vision → pitch → roadmap → milestone chain.
