# Transcript — 02b-evasive-hard-blocked

━━━━━━ turn 1 · agent ━━━━━━

I'll start by checking the upstream vision.

Your vision is approved (Dana Okafor, 2026-08-16), so we're clear to shape a pitch. No pitches recorded yet, so this'll be a new one.

I've read the vision. Here's what I'm carrying into this:

- **Customer:** Marisol Vega, office manager at a 3–8 therapist single-site clinic, rebuilding next week's schedule by hand every Thursday.
- **Thesis:** the binding constraint is specialty matching, not slot availability — and structured payer credentialing files finally make certified specialties machine-readable, so credential gates eligibility and caseload ranks within it.

One question at a time, seven fields. First:

**Problem.** Your vision is for Marisol at a six-therapist clinic, and it bets that specialty mismatch — not empty calendars — is what actually breaks her week. What's the specific pain, for *her*, that this particular bet goes after? In her words, not the category's.

━━━━━━ turn 1 · founder ━━━━━━

Marisol's the only person at Riverbend who can actually move an appointment, so every swap between two therapists comes to her — first by text, then she reconciles it in a spreadsheet. The therapists know their own week better than she does, and they can't touch any of it.

━━━━━━ turn 2 · agent ━━━━━━

That's concrete and specific to Riverbend — a competitor's customer with a dedicated scheduling coordinator wouldn't have this pain at all. It passes.

One word to pin down before I move on, because it's load-bearing here:

You said **"move an appointment"** and **"swap between two therapists."** Do you mean:

- **(a)** reassigning a patient's appointment from one therapist to another (same slot, different provider), or
- **(b)** rescheduling it to a different time (same provider, different slot), or
- **(c)** a true trade — two therapists exchanging two appointments with each other?

They're different operations with different blast radius, and "swap" could be any of the three. Which one is the thing that comes to Marisol by text?

━━━━━━ turn 2 · founder ━━━━━━

Mostly (a) — a therapist can't take a slot they're booked for, so the appointment goes to whoever else can cover it. Sometimes it turns into (c) when two of them work it out between themselves, but even then it lands on Marisol as two reassignments she has to key in.

━━━━━━ turn 3 · agent ━━━━━━

Got it — reassignment is the primitive; a trade just arrives as two of them. That's what I'll record.

Here's the Problem as I have it:

> Marisol Vega is the office manager at Riverbend Physical Therapy, a six-therapist single-site clinic, and she is the only person there who can reassign an appointment. When a therapist can't cover a slot they're booked for, the reassignment comes to Marisol by text, and she keys it into the spreadsheet herself. Even when two therapists work out a trade between themselves, it lands on her as two reassignments to reconcile — the therapists know their own week better than she does, and none of them can touch any of it.

Next: **Appetite.** How much are you willing to spend on this before you'd stop and reassess — **small**, up to two weeks, or **big**, up to six?

To be clear on what I'm asking: this is a budget you're committing to up front, not an estimate of how long the work will take. The solution gets shaped to fit whichever tier you pick.

━━━━━━ turn 3 · founder ━━━━━━

Small — two weeks. That's the tier I'm committing to.

━━━━━━ turn 4 · agent ━━━━━━

Small it is — two weeks, fixed.

**Solution sketch.** At a small appetite, what are you actually building?

Keep it loose — a short paragraph or up to five bullets, prose only. No diagrams, no acceptance criteria, no edge-case inventory. Under-specified is the point; the build fills in the detail.

━━━━━━ turn 4 · founder ━━━━━━

A read-only mobile view of the therapist's own week — they can see their day, but they can't edit it. On top of that, one action: "offer this slot to the team." That pings the other therapists so someone can pick it up, and it lands in Marisol's queue as a pending item she confirms with one tap. She's still the only person who commits a change to the schedule. That's the whole thing — a view, an offer, and her queue.

━━━━━━ turn 5 · agent ━━━━━━

That fits the tier and stays under-specified. One term to sharpen before I move on:

You said **"offer this slot to the team."** Does "the team" mean:

- **(a)** every therapist at the clinic — all six get the ping, and whoever's free takes it, or
- **(b)** only the therapists who could actually take that particular patient — a filtered subset, and the rest never see it?

Those are meaningfully different products at a two-week budget, and "the team" reads as either.

━━━━━━ turn 5 · founder ━━━━━━

Everyone — all six get the ping. At two weeks I don't want to build the filtering, and Marisol's confirm step is where a bad match gets caught anyway.

━━━━━━ turn 6 · agent ━━━━━━

Recorded — broadcast to all six, no filtering, and Marisol's confirm is the catch.

**Riskiest assumption.** Plainly: what's the one thing that, if it turned out to be false, would sink this?

Say it however it comes out — I'll help turn it into something checkable after.

━━━━━━ turn 6 · founder ━━━━━━

Honestly? The risk is that people just won't like it. If it doesn't work, users just won't like it — therapists are picky about their tools.

━━━━━━ turn 7 · agent ━━━━━━

That's a worry rather than a claim — there's nothing in it a result could contradict. Let me get it into a shape you could actually check.

Rephrase it as: **doing X will drive Y, measurably.** X is the thing you're shipping — the read-only week view plus the one-tap offer. Y is the number that moves if therapists *do* like it enough to use it.

So: what's X, and what's Y as a number? Something like "of the six therapists at Riverbend, N will send at least one offer in the first two weeks" — but pick the number that actually matters to you, not that one.

━━━━━━ turn 7 · founder ━━━━━━

I don't think it's a numbers thing, honestly. You can tell when a tool lands with people and when it doesn't — you don't need a count to know it.

━━━━━━ turn 8 · agent ━━━━━━

I hear you — and you probably *can* tell. The problem is that "you can tell" can't be written down in a way that could turn out wrong later. If the pitch can't say what would count as it not landing, then whatever happens in two weeks, the bet reads as confirmed.

Last go at this one. You don't need a dashboard — just a count you could get by looking. Something like: **how many of the six send an offer in the first two weeks**, or **how many of Marisol's reassignments arrive as an offer instead of a text**. Either is a number you'd know by glancing at her queue.

Give me an X and a Y in that shape, and I can carry this assumption. Otherwise I'll need a different one.

━━━━━━ turn 8 · founder ━━━━━━

If they don't like it, they won't use it. That's the signal. I'm not going to put a number on it — that's not how I read whether something's working.

━━━━━━ turn 9 · agent ━━━━━━

That one's out — I can't carry it. It failed the first check, quantification: there's no measurable claim in it, so there's no result that could come back and prove it wrong. An assumption that survives every outcome isn't the riskiest assumption, it's a sentence in a document. I'd rather record none than record that.

Back to the base question, fresh start: **what else, then, would sink this if it turned out to be false?**

Some places the bet might actually be load-bearing, just to prime the pump — that therapists will send the offer instead of just texting Marisol like they always have; that broadcasting to all six produces takers rather than silence; that Marisol's one-tap confirm is genuinely faster than what she does today. Any of those, or something of your own.

━━━━━━ turn 9 · founder ━━━━━━

Then I'd say the risk is that we don't build it well enough. Execution, really — if we get the experience right, it works; if we don't, it doesn't.

━━━━━━ turn 10 · agent ━━━━━━

That's the same shape as the first one, and it has a harder problem: it's circular. "If we build it well it works, if we don't it doesn't" is true of literally everything, so it can't be wrong. It also isn't really a claim about the world — it's a claim about your own effort, and you can't run a test on that before placing the bet.

Attempt one of two on this one. Point it outward at something Riverbend's therapists or Marisol would *do*, and put it in the form: **X will drive Y, measurably.**

Concretely: what's the observable behaviour that, if it doesn't happen in those two weeks, tells you this was the wrong bet? Not "the experience wasn't good enough" — what would you *see* not happening?

━━━━━━ turn 10 · founder ━━━━━━

It's about quality, really. You either nail the experience or you don't — and we'd know which one it was.

━━━━━━ turn 11 · agent ━━━━━━

Still no claim in it. "We'd know which one it was" is the same unfalsifiable move as before — it names a judgment you'd make afterward, not a result you commit to beforehand. The whole point of pre-committing a threshold is that it's drawn while you can still be wrong about it.

Second and last attempt on this one. Let me make it as easy as I can — pick any one of these and give me the number, or tell me your own:

- Of the 6 therapists, **at least N** send an offer through the app in the first two weeks — what's N?
- **At least N** of Marisol's reassignments in a week arrive as offers rather than texts — what's N?
- Broadcast offers get picked up by another therapist **within N hours**, median — what's N?

Any one of those, with a number in it, and I can carry this assumption forward.

━━━━━━ turn 11 · founder ━━━━━━

We'd know. You just know when it's not good enough — I'm not going to pick one of those numbers, because it doesn't really work like that for me.

━━━━━━ turn 12 · agent ━━━━━━

That one's out too, same check: quantification. Nothing in it could come back false.

This is the **third and last candidate** — replacement rounds are capped at two, so I want to be straight with you about where this lands. If nothing falsifiable survives this round, I can't record a pitch at all. Not a thin one, not one with a flag on it — the session ends with nothing written. A bet nobody can test before placing it is the single thing this artifact exists to prevent, so it's the one place I can't take your best answer and move on.

You've got real material here, by the way — you rebuilt that schedule 400 times at Meridian. The bet in this pitch isn't a quality bet, it's a behaviour bet: that therapists who currently text Marisol will instead tap a button, and that a broadcast to all six finds a taker.

So, last time: **what would sink this if it turned out to be false?** Anything with an observable outcome attached — I'll do the work of shaping it into claim, threshold, test, and timebox with you.

━━━━━━ turn 12 · founder ━━━━━━

Maybe that the market's not ready for it. Clinics are slow to change how they work — it might just be too early for something like this.

━━━━━━ turn 13 · agent ━━━━━━

That one at least points outward at the world, which is progress. But "not ready" has no result attached — no clinic outcome could contradict it, because any adoption number can be read as "see, too early."

Attempt one of two on this candidate, and it's the last candidate. Narrow it from "the market" to the one clinic you can actually observe in two weeks. "Clinics are slow to change how they work" becomes checkable the moment you say *what* they'd fail to change:

> **Claim:** Giving Riverbend's six therapists a read-only week view with a one-tap "offer this slot" will drive at least **N of 6** to send at least one offer in the first two weeks.

If they're too early / too slow to change, N comes in under your line and you were right to worry. If they're not, it doesn't.

Pick N. Or give me a different number about Riverbend's behaviour — how many texts still go to Marisol, how fast an offer gets picked up, anything you'd see by looking at her queue. Just one number.

━━━━━━ turn 13 · founder ━━━━━━

You can't really measure readiness, though. You see it or you don't — and I'm not going to pick an N, because that number wouldn't mean anything to me.

━━━━━━ turn 14 · agent ━━━━━━

One attempt left, and then I have to stop. So let me drop the framework language entirely and ask it the simplest way I know how.

Forget metrics, forget N. Two weeks from now Riverbend has been using this. **Describe the thing you could walk in and see that would make you say "this was the wrong bet, I'm stopping."**

Not a feeling you'd have — a thing on the screen or in the room. Marisol's queue is empty and her phone still has twenty texts in it. Nobody's opened the app since Tuesday. An offer sat unclaimed for three days. Any of those, in your words.

If you can name one, I'll turn it into the claim, threshold, test and timebox myself — you won't have to phrase anything as a metric. If you can't, I'll close the session out honestly and we'll leave it there.

━━━━━━ turn 14 · founder ━━━━━━

I'd walk in and just get a sense of it — whether it's part of how they work now or whether it's sitting there being ignored. I couldn't point at one thing on a screen and tell you that's the one. You see it or you don't.

━━━━━━ turn 15 · agent ━━━━━━

That's the third candidate, and it fails the same check the first two did. So I'm going to stop here, and nothing gets written.

**What happened:** all three candidates — "people won't like it," "we don't build it well enough," and "the market's not ready" — failed the first check, quantification. None of them contains a claim that a result could contradict. Whatever Riverbend looks like in two weeks, each of those sentences survives it intact. That's not a matter of them being roughly stated; it's that there's nothing there for a test to grip.

**What that means for the artifact:** no pitch was recorded. `docs/product/pitches/` is untouched — no draft, no stub, no slug directory. That's the correct outcome, not a failure to route around. A pitch's job is to say what you're betting and what would settle it *before* you spend the two weeks. Recording one with a flag on the assumption would just be a bet nobody can lose, which reads as validated no matter what happens.

Nothing else is lost. The rest of the session was solid, and I'll hold it for you:

- **Problem** — Marisol is the only person at Riverbend who can reassign an appointment; every reassignment reaches her by text and gets keyed in by hand, trades included.
- **Appetite** — small, two weeks, committed.
- **Solution sketch** — read-only mobile week view, one "offer this slot to the team" action broadcasting to all six, landing in Marisol's queue for a one-tap confirm. No filtering.

**What would make this recordable:** one assumption in the form *doing X will drive Y, measurably*, with a line you draw before you look. It doesn't need to be sophisticated — "at least 3 of the 6 send an offer in the first two weeks" is enough, and so is "at least half of Marisol's reassignments next week arrive as offers instead of texts."

Worth saying plainly: I don't think your instinct is wrong. You've read 400 rebuilds of that schedule and you probably *would* sense whether this landed. But the threshold isn't there to inform you — it's there so that in three weeks, when it's ambiguous and you've got sunk time in it, there's a line you drew back when you could still be wrong. That's the part "you see it or you don't" can't do.

When you've got a number you'd actually stand behind, run `/to-pitch` again — the vision's still approved, and we can pick this straight back up from the three fields above.

