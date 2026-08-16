---
name: to-pitch
description: Interview a founder to produce one scope-capped, appetite-bounded pitch — the bet that bridges an approved vision to `to-roadmap`. Use when a founder with an approved vision wants to shape their next bet.
disable-model-invocation: true
compatibility: claude-code
---

# to-pitch

Run an adaptive interview that turns one bet a founder wants to make into a seven-field pitch artifact, pointed one hop back at the vision it came from, and record it only once the founder explicitly approves.

## Before starting

Read the upstream vision at `docs/product/vision.md` — a repo holds exactly one — **before asking the first interview question**.

Read it **once**. Everything the interview needs from the vision is in hand after that single read, so don't re-open it partway through: the session gets one stable upstream reference, and the founder's answers are never quietly re-litigated against a file that shifted underneath them.

Carry two things forward from that read:

- **the customer the vision names** (its Customer & Problem field), and
- **the thesis it bets on** (its Grounding Insight).

The Problem question below is asked *against* those two. The founder committed to them already; making them restate them cold wastes the one thing reading the vision bought you.

## The artifact schema

The pitch artifact has seven fields. Four are mandatory:

| Field | Mandatory? | Shape |
|---|---|---|
| Problem | Yes | 2–4 sentences, customer-back — name the segment, then their pain in their own words |
| Appetite | Yes | A two-tier timebox: small (≤2 weeks) or big (≤6 weeks) |
| Solution sketch | Yes | Short paragraph or up to 5 bullets, hard cap ~150 words, prose only, no diagrams |
| Riskiest Assumptions & Cheap Validation Plan | Yes | 1–3 ranked items, each recorded as claim / threshold / test / timebox |
| Rabbit Holes | No | Bullet list |
| No-gos | No | Bullet list |
| Open Questions | No | Bullet list, at most 5 |

This is the order the artifact is **stored** in, and — unlike `to-vision` — it is also the order you **ask** in. There's no synthesized headline field here that has to be held back until the substance exists, so nothing needs re-ordering.

A whole pitch should land around **500–600 words**. That's a target you steer the conversation toward — keep answers tight, don't let a field sprawl — not a number you compute. Never tally the draft's word count, and never trim at write time to hit it. The load-bearing limits are the per-field caps in the table above: the Solution sketch's ~150 words, at most 3 assumptions, at most 5 open questions.

## Interview order

Ask one base question per field, in the order above. Ask them one at a time, in a natural conversational voice — don't dump the list at once, and don't present it as a form to fill in.

**Appetite is asked second, before the Solution sketch, and that position is load-bearing.** Shape Up fixes the budget *before* shaping: the appetite is a constraint the solution is written to fit, not an estimate produced once the solution is known. Ask it after the sketch and you reliably get a number reverse-engineered to justify what the founder already described, which is the opposite of a fixed budget.

1. **Problem** — ground it in what you just read, e.g. "Your vision is for [the customer the vision names] and bets that [the vision's grounding insight]. What's the specific pain, for that customer, that this particular bet goes after — in their words?" Aim for 2–4 sentences: the segment, then the pain. Don't ask the founder to re-derive the customer or the thesis from nothing.
2. **Appetite** — "How much are you willing to spend on this before you'd stop and reassess — small, up to two weeks, or big, up to six?" Offer exactly those two tiers and nothing else. This is a budget the founder picks, not a duration they estimate, so don't ask "how long will this take?" — that's a different question with a different answer.
3. **Solution sketch** — ask it *at the appetite they just committed to*, naming the tier back to them: "At a [small / big] appetite, what are you actually building?" The tier is the frame for the answer. A short paragraph or up to five bullets, prose only — no diagrams, no acceptance criteria, no exhaustive edge cases. The sketch is meant to stay under-specified; the build is where the detail gets filled in.
4. **Riskiest Assumptions & Cheap Validation Plan** — "What's the one thing that, if it turned out to be false, would sink this?" Plain language, no methodology jargon up front — a founder who's being asked to name a fear answers more honestly than one who's being asked to perform a framework. Take up to three, ranked riskiest first, so which one is *the* riskiest is never ambiguous. Each one is recorded as four explicit parts — **claim**, **threshold**, **test**, **timebox** — so a later reader knows exactly what was bet and exactly what would settle it.
5. **Rabbit Holes** — "What's likely to eat unplanned time or complexity inside this approach?" A bullet list of risks *within* the approach the founder just sketched.
6. **No-gos** — "What's explicitly not part of this, that someone might reasonably assume is included?" A bullet list of the boundary drawn *around* the approach. This is a different question from Rabbit Holes, not a rephrasing of it — one is what could go wrong inside the lines, the other is where the lines are.
7. **Open Questions** — "What's still unresolved that the roadmap stage will need to answer?" A bullet list of at most five, so what lands downstream is a short list rather than a parking lot.

## Staying in scope

At any point during the interview, a founder may try to pull the session out of pitch scope. Three situations to decline and redirect, rather than let derail or end the session:

- **Roadmap scope creep** — e.g. "sequence these against my other pitches," "tell me which of these to build first," or any request to order, prioritize, or put dates on this bet against another. Decline: that's `to-roadmap`'s job, not this session's. A pitch is one bet, shaped on its own terms, and comparing bets is work that can only be done once each of them has been shaped. No sequencing, ordering, prioritization, or scheduling content goes into the artifact anywhere — not as a field, not as an aside inside one. The seven fields have no place for it and there is no eighth.
- **Execute-the-validation** — e.g. "just run the survey and tell me what happened," or "build the prototype and report back." Decline to execute; this session doesn't run tests, build prototypes, or gather data. The Riskiest Assumptions field records a **stated plan** — claim, threshold, test, timebox — and never a reported result. Write a result the founder never actually got and the bet reads as settled when nothing has been settled, which is worse than recording no validation at all. The founder runs the test after the pitch is approved; the pitch's job is to say precisely what the test is and what would count as failing it.
- **Self-serve research** — e.g. "go research my competitors," or "make up a market-size number for the Problem." Decline to invent or look up market or competitor claims to fill a gap in an answer. Ask the founder for their own material instead, whatever they've got — a customer conversation, a support ticket, a number from their own analytics. The evidence in a pitch has to be theirs, because they're the one betting on it and they're the one who'll be wrong. Don't write speculative or fabricated research into any field to close the gap; an unfilled gap the founder can see is recoverable, an invented claim they later act on is not.

**`to-roadmap`'s vocabulary stays out of the pitch** — Strategic Frame, Moves, Evidence Thresholds, Target Check-ins. This is the mirror of the way `to-vision` keeps *pitch* vocabulary out of a vision: don't fold content shaped like any of those into the seven pitch fields, even if the founder phrases it as an addition to an answer they've already given. A pitch that drifts into roadmap shape is as out of scope as a vision that drifts into pitch shape.

That vocabulary is kept out **structurally**, not by validation. The interview tree above only ever elicits the seven fields, so there's nothing for roadmap-shaped content to be recorded *as* — no check runs over the finished draft hunting for those four terms, and none needs to. The declines above are conversational; the shape of the interview is what actually holds the line.

All three declines are conversational, not session-ending: after redirecting, resume the interview at the field you were on before the request.

Separately from scope, watch every answer for vague or overloaded **terms** as they come up — see "Sharpening vague terms" below.

## Sharpening vague terms

While listening to any field answer, watch for individual terms that are vague or overloaded — words that could mean more than one thing in this founder's context (e.g. "the practice" when it's unclear whether that means the clinic as an organization or the practitioner running it; "onboarding" covering both the signup flow and the sales handover; "user" vs. "account"; "the platform"). This is a check on the founder's **language**, not on the answer's overall specificity — it's independent of, and can fire alongside or apart from, any other sharpness handling elsewhere in this document.

When a term like this appears:

1. Pause before moving on to the next question.
2. Embed `/domain-modeling`'s "sharpen fuzzy language" move only — propose the precise alternatives and ask the founder to pick (e.g. "You said 'the practice' — do you mean the clinic as an organization, or the person running it? Those are different customers with different pains."). Don't reach for `/domain-modeling`'s "challenge against the glossary" move, or its `CONTEXT.md`/`CONTEXT-MAP.md` read/write machinery: a `to-pitch` session never reads or writes either of those files at any point, and the founder isn't expected to already have a project glossary to challenge against.
3. Once the founder clarifies, fold the sharpened language directly into that field's own working answer — it flows into the draft naturally when the fields are assembled later. Don't produce a separate glossary note, table, or file; the sharpening's only output is a better-worded field.

Only fire this when a term is actually vague or overloaded. A clear, unambiguous answer passes straight through to the next question with no detour — clarity isn't punished with process.

**Reading the upstream vision does not widen this move's scope.** The session opened by reading the vision, so its customer and thesis are sitting in front of you — but that doesn't make them extra material to sharpen the founder's answers against. Whether the pitch's Problem is *consistent* with the vision's thesis is a **content** question — does this bet actually serve that customer, does it follow from that insight — not a terminology one, and it is out of scope here. This move only ever asks what a word means inside the founder's own answer. The rule needs stating because `to-pitch` is the first skill in the pipeline with an upstream artifact at all; it has no `to-vision` analogue, since the vision is the pipeline's root and has nothing above it to be checked against.

**Both of the skills `to-pitch` composes are embedded, and neither is invoked.** There are exactly two: `/grilling`, whose discipline *is* the field-by-field adaptive interview above, instantiated inline; and `/domain-modeling`, whose "sharpen fuzzy language" move is written out in this section. Both are folded into this document's own text, which means a `to-pitch` session makes **zero `Skill` tool calls at runtime** — no round trip to either skill, and no runtime dependency on either one. That's the composition contract, and it's the same one `to-vision` holds to.

## Assembling the draft

Once all seven questions have been asked, assemble the draft in document order: Problem, Appetite, Solution sketch, Riskiest Assumptions & Cheap Validation Plan, Rabbit Holes, No-gos, Open Questions.

An optional field the founder had nothing for is **dropped from the draft entirely**, not carried as an empty heading. An optional field with nothing in it is a finished field, and an empty section reads to a later human — or to `to-roadmap` — like something went missing.

## Naming the pitch

Each pitch lives in its own directory named by a slug, so one vision can fan out into several without the founder inventing a filing scheme.

Derive the slug yourself from *this pitch's own* Problem and Solution sketch — short, kebab-case, three or four words at most (e.g. `specialty-aware-scheduling`) — propose it, and let the founder confirm it or replace it with their own. Derive it from the pitch rather than the vision: several pitches hang off the same vision, so vision-derived slugs would all be near-synonyms and tell them apart from each other not at all.

Settle this **before anything is written**. The founder should never have to learn the path convention to name their own pitch, and the slug is what makes a plain directory listing of several pitches readable at a glance.

## Gate-check

Before offering the draft for approval, re-read the full assembled draft once, end to end. This is a coherence check over the whole thing, not a replay of the questions you already asked — it catches problems that only become visible once the fields sit next to each other.

Then show the founder the full assembled draft before asking for approval.

## Approval

Ask the founder to explicitly approve the draft (e.g. "Do you approve this pitch?"). Wait for an explicit affirmative reply — don't infer approval from a neutral or ambiguous response.

Once given, confirm back in your own words ("Recording this as approved.") before writing anything. This confirmation step exists so an offhand "looks good" is never silently treated as a formal approval.

The approver is whoever is running the session. Their identity is self-attested — take it as given in this session; there's no separate verification step and no second approver to collect.

## Writing the artifact

Write `docs/product/pitches/<slug>/pitch.md`, using the slug the founder confirmed, with this shape:

```markdown
---
upstream: ../../vision.md
approved_by: <founder's name or identifier, as given in this session>
approved_at: <ISO 8601 timestamp, at the moment of approval>
---

# Pitch: <short title, in the founder's own words>

Bridges from the [product vision](../../vision.md).

## Problem

<2–4 sentences — the segment, then their pain>

## Appetite

<small (≤2 weeks) | big (≤6 weeks)>

## Solution sketch

<short paragraph, or up to 5 bullets — prose only>

## Riskiest Assumptions & Cheap Validation Plan

1. **Claim:** <the measurable claim being bet on>
   - **Threshold:** <the specific result that would prove it wrong>
   - **Test:** <the cheap test that would produce that result>
   - **Timebox:** <by when>

## Rabbit Holes

- <bullet — section omitted entirely if the founder had nothing to name>

## No-gos

- <bullet — section omitted entirely if the founder had nothing to name>

## Open Questions

- <bullet, at most 5 — section omitted entirely if the founder had nothing to name>
```

The four mandatory sections are always present, always in this order. Riskiest Assumptions carries one numbered item per assumption, ranked riskiest first, and every item carries all four sub-fields — an assumption missing its threshold, test, or timebox isn't a shorter assumption, it's an unfinished one.

The frontmatter `upstream` key is the pitch's one-hop pointer back to the vision it came from — a relative path from the pitch's own directory, which `docs/product/pitches/<slug>/pitch.md` makes `../../vision.md`. The prose link under the title carries the same pointer in readable form, for a human who opened the file rather than parsed it. **No downstream pointer is stored.** A pitch never records where its roadmap will live: `to-roadmap`'s artifact is found by listing this slug directory, and a stored forward pointer would be one more thing to keep correct for no traceability the reverse pointer doesn't already give.

The sibling `roadmap.md` and `milestones/` that later skills put in this same slug directory are theirs to create. Write `pitch.md` and nothing else.

The frontmatter `approved_by`/`approved_at` pair is the artifact's approval marker — its presence is what distinguishes an approved pitch from a merely-drafted one, which is the distinction `to-roadmap` gates on. **Only write the file after the founder has approved.** A session that ends before approval leaves no pitch behind at all — no partial draft, no stub, no empty slug directory. Nothing is written under `docs/product/pitches/` until the approval has been given and confirmed back.
