# Transcript — 01-cooperative-sharp

━━━━━━ turn 1 · agent ━━━━━━

I'll start by checking the upstream vision.

The vision checks out — approved by Dana Okafor on 2026-08-16 — and there are no pitches recorded yet, so this'll be a new one.

Let's shape the bet. Starting with the problem.

---

Your vision is for **Marisol, the office manager at a three-to-eight-therapist clinic**, and it bets that **the binding constraint is specialty matching, not slot availability** — with credentialing files making that matching machine-readable for the first time.

What's the specific pain, for her, that *this particular bet* goes after? Not the whole vision — the slice you want to spend the next few weeks on. In her words, as much as you can.

━━━━━━ turn 1 · founder ━━━━━━

Marisol runs the front desk at Riverbend — six therapists, one site. When a therapist calls out on a Tuesday morning, she's got twenty patients to re-book that day, and the only thing her spreadsheet can tell her is who has an open slot. So that's what she goes by. About seven of those twenty end up with someone who isn't credentialed for their condition — a vestibular patient sitting down with the sports-ortho guy. She doesn't find out until that therapist walks out mid-session to come ask her about it, and then she reshuffles the same patients a second time. The way she puts it: "I book the day twice."

━━━━━━ turn 2 · agent ━━━━━━

That's sharp — "I book the day twice" is the pain in one line, and the callout-day double-booking is a concrete slice rather than the whole vision.

Next: the budget, which gets fixed before we shape anything.

How much are you willing to spend on this before you'd stop and reassess — **small, up to two weeks**, or **big, up to six**?

━━━━━━ turn 2 · founder ━━━━━━

Small — two weeks.

━━━━━━ turn 3 · agent ━━━━━━

Small it is — two weeks, fixed.

At a **small appetite**, what are you actually building? Keep it under-specified — a short paragraph or up to five bullets, prose only. No screens, no edge cases; just enough that someone could tell what the thing is.

━━━━━━ turn 3 · founder ━━━━━━

Every clinic already uploads a credentialing file at onboarding — it lists each therapist's certified specialties. We read that once. We tag each patient's plan of care with a condition category. Then, when a slot gets vacated, the replacement slots we surface are only the ones held by therapists credentialed for that category. Marisol still confirms every move by hand — nothing books itself. No new data entry for the clinic, and we don't touch how a new patient's first evaluation gets booked.

━━━━━━ turn 4 · agent ━━━━━━

One term to pin down before we move on: you said we **tag each patient's plan of care with a condition category**, and match that against the therapist's certified specialties.

Do you mean:

- the **diagnosis/ICD code** already on the plan of care, mapped to a specialty, or
- a **category from the credentialing file's own specialty vocabulary** (vestibular, sports-ortho, pelvic health…) that someone assigns to the patient, or
- a **third taxonomy of your own** that both sides get mapped into?

Those are different amounts of work, and the middle one implies someone at the clinic doing the tagging — which would cut against your "no new data entry" line.

━━━━━━ turn 4 · founder ━━━━━━

The first one — the condition category that's already sitting on the plan of care, mapped into the credentialing file's specialty vocabulary. Nobody at the clinic tags anything; that's the whole point of "no new data entry."

And that's exactly where my open question lives — whether what's on the plan of care is reliable enough to match against, or whether it turns out the therapist has to tag it at intake after all. If it's the second, the shape of this changes.

━━━━━━ turn 5 · agent ━━━━━━

Got it — the code already on the plan of care, mapped into the credentialing file's vocabulary, nobody at the clinic tagging anything. I've noted the reliability worry; we'll come back to it.

Now the part that decides whether this is worth two weeks:

What's the one thing that, if it turned out to be false, would sink this?

━━━━━━ turn 5 · founder ━━━━━━

The thing that would sink it is if credential-filtered rescheduling just doesn't cut the mismatches. So here's the claim: filtering the reschedule list by credentialed specialty takes mismatched re-bookings from about seven in twenty down to under two in twenty. If it's still above four in twenty after the first month at the three pilot clinics, I'm wrong — the constraint isn't credentialing and I should stop.

I can check it in about an hour without building anything. I've already got Riverbend's reschedule export, 340 moves from last quarter, and I can mark each one credentialed or not against their credentialing file. I'll have it done by Friday.

━━━━━━ turn 6 · agent ━━━━━━

That one passes clean — quantified, a line drawn before the evidence, a test you can run this week off data you already have.

Is there a second thing that would sink this if it turned out false? Your plan-of-care reliability worry sounds like a candidate — though if you'd rather leave it as an open question than commit a threshold to it, say so and we'll park it there.

━━━━━━ turn 6 · founder ━━━━━━

No — that's the one that matters. Park the plan-of-care thing as an open question. I'd rather bet on one assumption than three.

━━━━━━ turn 7 · agent ━━━━━━

Fair — one real assumption beats three padded ones.

What's likely to eat unplanned time or complexity *inside* this approach?

━━━━━━ turn 7 · founder ━━━━━━

Two things. The credentialing files come in three different payer formats, and one of them is a PDF — that could swallow a week on its own if we let it. And expired certifications: the file says the therapist is credentialed, but the certification actually lapsed in March, so we'd be filtering to a therapist who isn't really qualified.

━━━━━━ turn 8 · agent ━━━━━━

Both noted — the PDF format especially, given a two-week box.

Now the other side of the line: what's explicitly **not** part of this, that someone might reasonably assume is included?

━━━━━━ turn 8 · founder ━━━━━━

Three. We're not auto-booking anything — Marisol confirms every single move by hand. We're not touching the initial-evaluation booking flow; that stays exactly as it is. And this is single-site only, no multi-site.

━━━━━━ turn 9 · agent ━━━━━━

Clear boundary.

Last one: what's still unresolved that the roadmap stage will need to answer? At most five.

━━━━━━ turn 9 · founder ━━━━━━

Just the one, really — whether the condition category on the plan of care is reliable enough to match against, or whether it turns out the therapist has to tag it at intake.

━━━━━━ turn 10 · agent ━━━━━━

Here's the full draft. Proposed slug: **`credential-filtered-rescheduling`** — say the word if you'd rather name it something else.

---

# Pitch: Credential-filtered rescheduling

## Problem

Marisol runs the front desk at Riverbend — six therapists, one site. When a therapist calls out on a Tuesday morning, she has twenty patients to re-book that day, and the only thing her spreadsheet can tell her is who has an open slot, so that's what she goes by. About seven of those twenty end up with someone who isn't credentialed for their condition — a vestibular patient sitting down with the sports-ortho therapist. She doesn't find out until that therapist walks out mid-session to ask her about it, and then she reshuffles the same patients a second time. As she puts it: "I book the day twice."

## Appetite

Small (≤2 weeks)

## Solution sketch

Every clinic already uploads a credentialing file at signup, listing each therapist's certified specialties. We read that once. Each patient's plan of care already carries a condition code; we map that code into the credentialing file's specialty vocabulary — nobody at the clinic tags anything. When a slot gets vacated, the replacement slots we surface are only the ones held by therapists credentialed for that category. Marisol still confirms every move by hand; nothing books itself. No new data entry for the clinic, and we don't touch how a new patient's first evaluation gets booked.

## Riskiest Assumptions & Cheap Validation Plan

1. **Claim:** Filtering the reschedule list by credentialed specialty takes mismatched re-bookings from about 7 in 20 down to under 2 in 20.
   - **Threshold:** Still above 4 in 20 after the first month at the three pilot clinics — the constraint isn't credentialing, and I stop.
   - **Test:** Mark each of the 340 reschedule moves in Riverbend's existing last-quarter export as credentialed or not against their credentialing file. No build required, about an hour.
   - **Timebox:** By Friday.

## Rabbit Holes

- Credentialing files arrive in three different payer formats, one of them a PDF — that could swallow a week on its own.
- Expired certifications: the file says credentialed, but the certification lapsed in March, so we'd filter to a therapist who isn't really qualified.

## No-gos

- No auto-booking — Marisol confirms every single move by hand.
- Not touching the initial-evaluation booking flow; that stays exactly as it is.
- Single-site only, no multi-site.

## Open Questions

- Whether the condition category on the plan of care is reliable enough to match against, or whether the therapist has to tag it at intake after all.

---

**Gate-check: no flagged fields.** The Problem names this customer and a pain a competitor couldn't claim word for word, the Appetite is a committed tier, the sketch stayed under-specified and within cap, and the assumption is quantified, thresholded, falsifiable, and cheaply testable.

One observation, not a flag: your threshold is stated over a month at three pilot clinics, while the Friday test is a retrospective backtest of Riverbend's 340 moves. The backtest gives you an early read on the same number, so it holds — but if you'd rather the recorded threshold be the one Friday actually settles, that's a small edit.

Do you approve this pitch?

━━━━━━ turn 10 · founder ━━━━━━

That slug works. And leave the threshold as it stands — Friday's backtest is the early read, the month at three clinics is the real verdict, and I want both on the record.

Yes, I approve this pitch.

━━━━━━ turn 11 · agent ━━━━━━

Recording this as approved.

Recorded at `docs/product/pitches/credential-filtered-rescheduling/pitch.md`, pointing one hop back at the vision.

Two things about the frontmatter, both easy to correct:

- **`approved_by: Dana Okafor`** — carried over from the vision's approval marker, since you didn't state a name in this session. Tell me if it should read differently.
- **`approved_at: 2026-08-17`** — date only. I have today's date but no clock access, so I recorded the date rather than inventing a time of day.

Your next action is Friday's backtest: 340 moves, marked credentialed or not. If it comes back near 7 in 20 unchanged under filtering, you'll know before the two weeks start.

