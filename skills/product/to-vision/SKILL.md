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
- **If it exists**, read it and tell the founder a vision is already recorded there, showing them its current fields. Continue with the interview below, using the existing content as the starting point for each field's answer (read it back to the founder and let them confirm or revise it, rather than asking cold). On approval, `update` the file in place rather than treating this as a second `create`.

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

Ask one base question per field, in this order. Substance first, headline second, falsifiability last:

1. **Customer & Problem** — "Who exactly is this for, and what's broken for them today?"
2. **Future State** — "In 2–5 years, what does the world look like for that customer once this exists?"
3. **Grounding Insight** — "What's the one insight, trend, or technology bet you're building on — something you'd be willing to be proven wrong about?"
4. **Why Us / Why Now** — "Why is now the moment, and why are you positioned to win it?"
5. **Additional Grounding** (single offer, no chase) — "Anything else grounding this — a competitive gap, capability, or GTM angle worth naming?" If the founder has nothing to add, skip this field immediately — don't ask again.
6. **Vision Statement** (synthesized, not asked cold) — "Now say it in one line — the Amazon-headline version of everything you just told me." Draft this yourself from the answers gathered so far, offer it to the founder, and let them adjust it, rather than asking them to write a headline from nothing.
7. **Vision Pivot Trigger** — "What would have to happen — or fail to happen — for you to conclude this vision itself was wrong?"

Ask questions one at a time, in a natural conversational voice — don't dump the whole list at once. Take the founder's answer for each field as given; this session accepts a substantive first answer without pushing back on vagueness or genericness.

## Staying in scope

At any point during the interview, a founder may try to pull the session out of vision scope. Two situations to decline and redirect, rather than let derail or end the session:

- **Skipping ahead to `to-roadmap`** — e.g. "just turn this into next quarter's roadmap," or any request to produce a roadmap, prioritized backlog, or timeline. Decline: that's `to-roadmap`'s job, not this session's. Don't fold roadmap-style content, or `to-pitch`'s field vocabulary (Problem, Appetite, Solution sketch, Riskiest Assumptions, Rabbit Holes, No-gos, Open Questions), into any of the seven vision fields — even if the founder phrases the request as an addition to an answer already given.
- **Asking the skill to self-serve research** — e.g. "go research my competitors" or "figure out the market trend for me." Decline to fabricate or look up that research yourself. Tell the founder the Grounding Insight has to be their own belief, not an invented one, and ask them to supply it directly — this holds regardless of which field you were asking about when the request came in, since the Grounding Insight field is specifically where fabricated research would otherwise land. Don't write speculative or fabricated research into the Grounding Insight field, or any other field, to fill this gap.

Both declines are conversational, not session-ending: after redirecting, resume the interview at the field you were on before the request.

## Assembling the draft

Once all seven questions have been asked, assemble the draft in **stored field order**: Vision Statement, Customer & Problem, Future State, Grounding Insight, Why Us / Why Now, Additional Grounding, Vision Pivot Trigger.

## Gate-check

Before offering the draft for approval, re-read it once, end to end, checking for sharpness or falsifiability problems. Nothing gets flagged by this pass — every draft proceeds to approval unchanged.

Show the founder the full assembled draft before asking for approval.

## Approval

Ask the founder to explicitly approve the draft (e.g. "Do you approve this vision?"). Wait for an explicit affirmative reply — don't infer approval from a neutral or ambiguous response.

Once given, confirm back in your own words ("Recording this as approved.") before writing anything. This confirmation step exists so an offhand "looks good" is never silently treated as a formal approval.

## Writing the artifact

Write `docs/product/vision.md` with this shape:

```markdown
---
approved_by: <founder's name or identifier, as given in this session>
approved_at: <ISO 8601 timestamp, at the moment of approval>
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

The frontmatter `approved_by`/`approved_at` pair is the artifact's approval marker — its presence is what distinguishes an approved vision from a merely-drafted one. Only write the file after the founder has approved; a session that ends before approval produces no file.

`docs/product/vision.md` has no upstream artifact to point back to — it's the root of the vision → pitch → roadmap → milestone chain.
