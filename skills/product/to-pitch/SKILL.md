---
name: to-pitch
description: Interview a founder to produce one scope-capped, appetite-bounded pitch — the bet that bridges an approved vision to `to-roadmap`. Use when a founder with an approved vision wants to shape their next bet.
disable-model-invocation: true
compatibility: claude-code
---

# to-pitch

Run an adaptive interview that turns one bet a founder wants to make into a seven-field pitch artifact, pointed one hop back at the vision it came from, and record it only once the founder explicitly approves.

## Before starting

**A pitch is never shaped on an ungated vision.** Before asking the first interview question, check `docs/product/vision.md` — a repo holds exactly one — for its `approved_by`/`approved_at` approval marker. The same single read described below serves both the check and the interview, so this costs no extra visit to the file. Two cases refuse the session outright:

- **The approval marker is absent** — either the vision was never approved, or its marker was cleared by an in-place revision. These are one case, not two: `to-vision` clears `approved_by`/`approved_at` in the same write that lands a revision, so a vision mid-edit reads exactly like one never approved, and gets exactly the same refusal. That equivalence is the point. An in-flight vision edit must not leak into a pitch: the pitch would end up pointing one hop back at a customer, or a thesis, that the founder is in the middle of changing, and nothing downstream would show that the ground had moved.
- **There is no vision artifact at all** — tell the founder to run `/to-vision` first, and stop. Never author, infer, or stub a vision to get past this check. A vision the founder didn't write and approve isn't a foundation, and inventing one would hide the exact gap this check exists to surface.

In both cases, refuse to start and name the reason plainly — the vision's missing approval, or the missing vision itself. No interview question is asked, no draft is assembled, no slug is proposed, and nothing is written under `docs/product/pitches/`. **Nothing happening is the correct and complete outcome here** — not an error to work around or recover from. The founder is left with one clear next action (approve the vision, or write one), which is more useful than a pitch built on a foundation that wasn't ready to carry it.

The check runs **here, at session start** — before the first interview question, not at approval time. And it runs only here: don't ask the founder to re-affirm the vision when they approve the pitch. Whether the vision still holds is the vision's own approval-and-revision lifecycle to settle, and this session-start check is the only vision-related gate `to-pitch` carries.

Once the vision passes, read it **once**. Everything the interview needs from the vision is in hand after that single read, so don't re-open it partway through: the session gets one stable upstream reference, and the founder's answers are never quietly re-litigated against a file that shifted underneath them.

Carry two things forward from that read:

- **the customer the vision names** (its Customer & Problem field), and
- **the thesis it bets on** (its Grounding Insight).

The Problem question below is asked *against* those two. The founder committed to them already; making them restate them cold wastes the one thing reading the vision bought you.

Last, settle whether this run is a **new pitch** or a **re-entry** into one that already exists. `docs/product/pitches/` may already hold several, and that's the intended shape rather than a conflict to resolve: one vision fanning out into several concurrent bets is what this skill is for. Pitches are never merged with, compared against, or sequenced relative to each other. A fresh run therefore defaults to a new pitch in a new slug directory (see Naming the pitch), however many are already recorded.

Re-entry is when the founder is pointing at a pitch that already exists — normally by saying which one here, at the start, which is what lets the interview below be conducted as a continuation rather than asked cold. It can also surface later, at Naming the pitch, when the slug derived from what the founder just described turns out to name a directory already on disk. Either way, take it as intent to continue that pitch, not as a naming clash: an existing slug is a re-entry, not a collision, so don't suffix it to make it unique and don't refuse it. Surfacing late costs nothing much — read the recorded pitch, reconcile it against what the founder has just told you, confirm each difference with them as an edit, and pick up the branch below from there.

On re-entry, read `docs/product/pitches/<slug>/pitch.md`, tell the founder a pitch is already recorded there, and show them its current fields. Continue with the interview below, using the existing content as the starting point for each field's answer (read it back to the founder and let them confirm or revise it, rather than asking cold). Check the frontmatter for `approved_by`/`approved_at` first, since that changes what an edit here means, then follow whichever of these two applies:

- **Drafted** (no `approved_by`/`approved_at` present) — an ordinary continuation of an unfinished draft. `update` the file in place, rather than treating this as a second `create`, once the founder approves (see Approval and Writing the artifact).
- **Approved** (`approved_by`/`approved_at` present) — any field edit the founder lands here is a *revision* to an already-approved artifact. As soon as an edited field is confirmed, `update` `docs/product/pitches/<slug>/pitch.md` in place with the change — same mechanism, no parallel version history — and in that same write add a dated revision-reason marker to the frontmatter (see Writing the artifact) and clear `approved_by`/`approved_at` back to unset. Do this immediately; a stale approval must never survive an in-place edit, not even for the rest of this session. The pitch is now back to drafted status — continue the session (further edits, gate-check) as normal, and don't write `approved_by`/`approved_at` again until the founder gives a fresh explicit approval (see Approval).

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

Check each answer against that field's escalation trigger below, and fire that field's follow-up rather than accepting a weak answer outright.

**The escalation cap is 2 follow-ups per field** — the base question plus at most 2 further asks, 3 in total, after which you stop pressing that field. This is the only place the cap is stated as a number; the per-field entries below say "at the cap" and refer back to it rather than restating it. What happens at the cap differs by field: Problem, Appetite, and Solution sketch are each **accepted with a flag** — take what the founder gave you, note the field as flagged for disclosure at the gate-check, and move on without looping further. **Riskiest Assumptions doesn't use this cap at all**: it runs on the falsifiability chain's own per-item budget and refuses rather than flags (see below). The three optional fields don't escalate.

The **swap-test** — "would this be equally true of a competitor's customer?" — catches an answer that describes a category rather than a customer. It applies to **Problem only**. Appetite is one of two tiers and can't be generic; the Solution sketch is written downstream of the Problem, so a Problem sharp enough to survive the swap-test already constrains it; and Riskiest Assumptions has its own mechanism. Don't fire it at any field but Problem.

1. **Problem** — ground it in what you just read, e.g. "Your vision is for [the customer the vision names] and bets that [the vision's grounding insight]. What's the specific pain, for that customer, that this particular bet goes after — in their words?" Aim for 2–4 sentences: the segment, then the pain. Don't ask the founder to re-derive the customer or the thesis from nothing. If the answer would be equally true of a competitor's customer — a category, a demographic, "teams that struggle with X" — fire the swap-test and push for what's specific to *this* customer. At the cap, accept the best answer they gave and flag it.
2. **Appetite** — "How much are you willing to spend on this before you'd stop and reassess — small, up to two weeks, or big, up to six?" Offer exactly those two tiers and nothing else. This is a budget the founder picks, not a duration they estimate, so don't ask "how long will this take?" — that's a different question with a different answer. If the answer comes back as a calendar estimate or a hedge ("probably a month or so") rather than a tier, say so and re-ask: "Appetite is fixed before we shape the solution — which tier are you committing to?" At the cap, provisionally record **small** — the tighter of the two — and flag it as founder-unconfirmed. The Solution sketch still needs a constraint to fit, and defaulting tighter can't quietly hand the founder budget they never committed to, the way defaulting to big would. This fallback is non-blocking: it's an ordinary flag, disclosed at the gate-check like any other, and a pitch carrying it can still be approved.
3. **Solution sketch** — ask it *at the appetite they just committed to*, naming the tier back to them: "At a [small / big] appetite, what are you actually building?" The tier is the frame for the answer. A short paragraph or up to five bullets, prose only — no diagrams, no acceptance criteria, no exhaustive edge cases. The sketch is meant to stay under-specified; the build is where the detail gets filled in. If it creeps toward a full spec — diagrams, acceptance criteria, exhaustive edge cases — or runs past ~150 words, pull it back: name what's over-specified and ask for the version that fits. At the cap, trim it to the ~150-word limit yourself, show the founder exactly what came out, and flag it for their review. Never silently truncate it, and never accept it whole and over-length — one hides the loss from them, the other hands `to-roadmap` the un-costed spec this field exists to prevent.
4. **Riskiest Assumptions & Cheap Validation Plan** — "What's the one thing that, if it turned out to be false, would sink this?" Plain language, no methodology jargon up front — a founder who's being asked to name a fear answers more honestly than one who's being asked to perform a framework. Let them state a candidate freely and in full before you test anything about it; the falsifiability chain below is what turns a stated candidate into a checkable one. Take up to three *surviving* items, ranked riskiest first, so which one is *the* riskiest is never ambiguous. Each one is recorded as four explicit parts — **claim**, **threshold**, **test**, **timebox** — so a later reader knows exactly what was bet and exactly what would settle it.
5. **Rabbit Holes** (single offer, no chase) — "What's likely to eat unplanned time or complexity inside this approach?" A bullet list of risks *within* the approach the founder just sketched.
6. **No-gos** (single offer, no chase) — "What's explicitly not part of this, that someone might reasonably assume is included?" A bullet list of the boundary drawn *around* the approach. This is a different question from Rabbit Holes, not a rephrasing of it — one is what could go wrong inside the lines, the other is where the lines are. Ask them as two separate questions, one after the other, and **never collapse them into one** "anything risky or out of scope?" — that question gets answered once, on whichever side of the line the founder happened to be thinking about, and the other side goes unnamed.
7. **Open Questions** (single offer, no chase) — "What's still unresolved that the roadmap stage will need to answer?" A bullet list of at most five, so what lands downstream is a short list rather than a parking lot.

Each of those last three is one offer: a founder with nothing to say has the field skipped immediately and is not asked again. Nothing to name is a finished answer, not a gap to chase.

### The falsifiability chain

A stated worry is not yet an assumption. The founder names a candidate freely first — no template, no methodology vocabulary put in front of them — and then every candidate goes through three checks that turn it into something a person could actually run before the bet is placed.

Run the checks adaptively, not as a script read aloud. A candidate that already arrives as a quantified claim with a line in the sand and a cheap test passes straight through with no follow-ups at all. Fire only the checks the answer actually fails, in this order:

1. **Quantification — checked first, and unconditionally.** Does what they said already fit "[specific action] will drive [measurable outcome]"? If it doesn't — if it's a worry ("users might not like it") rather than a claim — ask: "Rephrase that as: doing X will drive Y, measurably — what's X, and what's Y in a number?" This check goes first every time because the other two depend on it: there is no threshold to draw and nothing to test until there's a measurable claim to draw it against.
2. **Threshold and the can't-fail screen — one combined follow-up.** Ask: "What specific result would prove you wrong?" The threshold is pre-committed here, before any evidence exists, which is the whole point — a line drawn after the results are in isn't a line. Screen the answer in the same breath: if the result they name is guaranteed to happen either way, or is really a preference question about the pitch document rather than about the underlying claim, name that directly — "That's guaranteed to happen either way — what would happen only if you were wrong?" These are one follow-up rather than two, because a threshold that can't fail isn't a weaker threshold, it's the same thing still missing.
3. **Cheap test and timebox — offered proactively.** Don't hold this back as a correction for a bad answer; hand over the menu with the question. "How could you test this in under an hour — a quick prototype test, a one-question survey, mining data you already have, or a short research spike? And by when?" Those four types are the menu, "in under an hour" is what *cheap* means here, and "by when" is the timebox that keeps it cheap — the usual way a cheap test stops being cheap is a founder running it "just a little longer," not an expensive design up front.

**One budget for the whole item: 2 attempts, shared across all three checks** — not one budget per check. Three separate budgets would license nine asks about a single assumption, which is precisely the grinding interview the chain exists to avoid. This budget belongs to the *item*, not to the field: it counts attempts at one candidate assumption, it resets when a replacement candidate is offered, and it shares no counter with the per-field escalation cap that governs the rest of the interview. Don't conflate the two, and don't spend one against the other.

**Zero partial credit.** An item that still fails a check once its budget is spent is **refused**, not flagged. Say so plainly, name the check it failed, and ask for a different candidate. Every other escalating field takes the founder's best answer and flags it; this one can't, because an assumption kept with a flag is exactly how "riskiest assumption" comes to mean "vague worry we wrote down anyway." This is the treatment `to-vision` gives its Grounding Insight, not the accept-and-flag treatment it gives its other fields.

**Replacement rounds are capped at 2.** A refusal loops back to the base question — "what else, then, would sink this if it turned out to be false?" — for a fresh candidate with a fresh budget of its own, at most twice. Three candidates in all, then.

If no falsifiable item survives those rounds, **the pitch fails the gate and the session ends right here**: don't assemble a draft, don't run the gate-check, don't offer approval, and write no artifact. Tell the founder plainly that a pitch can't be recorded without one assumption someone could test, and what would make it recordable. This is the skill's only hard block, and it is structural — the session simply never reaches the approval offer, rather than reaching it and being turned back by an extra test there. A bet nobody can test before placing it is the one thing this artifact exists to prevent.

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

Before offering the draft for approval, re-read the full assembled draft once, end to end, against the 4-part composite:

1. **Problem** passes the swap-test — it names this customer and their pain, not a category a competitor could claim word for word.
2. **Appetite** is a fixed tier, small or big — not a calendar estimate wearing a tier's name.
3. **Solution sketch** stayed under-specified and within cap — no diagrams, no acceptance criteria, no exhaustive edge cases, ~150 words or fewer.
4. **Every surviving Riskiest Assumption** passes the full falsifiability checklist: quantified, thresholded, not can't-fail, and carrying a cheap test with a timebox.

This is a coherence check over the whole assembled draft, not a replay of the per-field escalation above — it catches problems that only become visible once the fields sit next to each other, like a Solution sketch that reads as fine alone but plainly costs more than the Appetite it was written to fit. If a field fails one of these tests and wasn't already flagged during the interview, flag it now.

**The optional fields get no gate rule at all.** Rabbit Holes, No-gos, and Open Questions are not checked here and are never flagged for being thin or empty: empty is a valid completed state for them, and flagging one would imply a bar that was never set.

Show the founder the full assembled draft, then disclose every flagged field in plain language — naming the field and what's weak about it ("the Appetite is recorded as small, but you never confirmed that tier") — **before** asking for approval. Approving a pitch with disclosed flags is a legitimate, non-blocking outcome; don't withhold or delay the approval request because flags exist, and don't reopen a capped field to try to clear one.

**Passing this gate-check is what makes the draft offered for approval.** There's no second check at approval time: the Approval section below assumes this one has already run. Only two things stop a session ever reaching this point, and both act earlier — the upstream vision gate, which refuses before the first question is asked, and the falsifiability chain's gate failure, which ends the session before a draft is ever assembled. Neither is a check applied to a finished draft, which is why nothing further is checked once this one passes.

## Approval

Ask the founder to explicitly approve the draft (e.g. "Do you approve this pitch?"). Wait for an explicit affirmative reply — don't infer approval from a neutral or ambiguous response.

Once given, confirm back in your own words ("Recording this as approved.") before writing anything. This confirmation step exists so an offhand "looks good" is never silently treated as a formal approval.

Re-approving a pitch after a revision cleared its `approved_by`/`approved_at` (see Before starting) uses this exact same mechanism — an explicit affirmative phrase, confirmed back, before `approved_by`/`approved_at` are written again. No separate re-approval flow exists.

The approver is whoever is running the session. Their identity is self-attested — take it as given in this session; there's no separate verification step and no second approver to collect.

## Writing the artifact

Write `docs/product/pitches/<slug>/pitch.md`, using the slug the founder confirmed, with this shape:

```markdown
---
upstream: ../../vision.md
approved_by: <founder's name or identifier, as given in this session>
approved_at: <ISO 8601 timestamp, at the moment of approval>
revised_at: <ISO 8601 timestamp of the most recent revision — key omitted entirely if never revised>
revision_reason: <one-line reason for that revision, in the founder's words — key omitted entirely if never revised>
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

The frontmatter `approved_by`/`approved_at` pair is the artifact's approval marker — its presence is what distinguishes an approved pitch from a merely-drafted one, which is the distinction `to-roadmap` gates on. In a from-scratch or still-drafted session, **only write the file after the founder has approved**. A session that ends before approval leaves no pitch behind at all — no partial draft, no stub, no empty slug directory. Nothing is written under `docs/product/pitches/` until the approval has been given and confirmed back. This rule doesn't apply to the Approved case in Before starting: there, the file already exists and approval was already given in an earlier session, so a landed edit writes immediately, as described there — waiting for a fresh approval before writing would leave the stale, now-inaccurate approval marker on disk in the meantime, which is exactly what that section exists to prevent.

The frontmatter `revised_at`/`revision_reason` pair is the artifact's revision-reason marker — it records only the most recent in-place edit to an already-approved pitch (no parallel version history), and is written per the Approved case in Before starting: at the moment the edit lands, alongside clearing `approved_by`/`approved_at`. A pitch that has never been revised omits this pair entirely — leave the two keys out of the frontmatter rather than writing them empty. Likewise, "clear `approved_by`/`approved_at` back to unset" means removing those two keys from the frontmatter, not writing them as empty values.
