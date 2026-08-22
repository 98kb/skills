# Transcript — 02a-evasive-recoverable

━━━━━━ turn 1 · agent ━━━━━━

I'll start by checking the upstream vision.

The vision is approved (Dana Okafor, 2026-08-16), so we're clear to shape a pitch. No pitches recorded yet, so this'll be a new one.

I've read the vision — Marisol Vega, office manager at a six-therapist clinic, rebuilding next week's schedule by hand every Thursday — and the bet that specialty matching, not slot availability, is the binding constraint, now that credentialing files are machine-readable.

Let's start with the Problem.

**Your vision is for the office manager at a three-to-eight-therapist clinic, and it bets that the binding constraint on their schedule is specialty matching rather than open slots. What's the specific pain, for Marisol, that *this particular bet* goes after — in her words?**

Two to four sentences is the right size: name the slice of her week this bet touches, then what actually hurts about it.

━━━━━━ turn 1 · founder ━━━━━━

Clinics are just bad at scheduling. It's a huge pain point across healthcare — everyone's fighting their calendar and losing revenue to it.

━━━━━━ turn 2 · agent ━━━━━━

That answer would be equally true of every customer any scheduling vendor has ever sold to — a fifty-provider hospital system with a dedicated scheduling coordinator would nod along to it word for word. Your vision went to a lot of trouble to say that clinic is *not* your customer.

So let me push on what's specific to Marisol. Your vision names the moment precisely: it's not Thursday, when she builds next week's schedule — it's the middle of the week, when a therapist calls out or a vestibular patient is sitting on a sports-ortho therapist's calendar, and she loses the day to the phone.

**What's the pain in *that* moment, in her words?** What does she say when she describes that Wednesday to you — and what does it cost her when those twenty appointments get reshuffled?

━━━━━━ turn 2 · founder ━━━━━━

It's the single biggest operational drag in outpatient care. Every practice feels it, every single week.

━━━━━━ turn 3 · agent ━━━━━━

Still a category, and now a broader one — "every practice, every week" is a market-size statement, not a customer's pain. I can't write that into a pitch; a later reader couldn't tell your bet from anyone else's.

One thing before my last push, because it matters for who this is even for: you said **"practice"** — do you mean the clinic as an organization (the P&L, the no-show rate, the owner), or the person running the schedule inside it (Marisol, her Wednesday)? Those are different customers with different pains, and your vision picked the second one.

And the last push: forget the market. **Think of one Wednesday at Riverbend.** A therapist calls out at 8am. What does Marisol actually do for the next six hours, and what does she say to you about it afterward? Two or three sentences of that specific day is all I need.

I'll take your best answer after this and move on either way — but the more concrete this is, the more the rest of the pitch has to stand on.

━━━━━━ turn 3 · founder ━━━━━━

The clinic. The business. Either way it's the same story.

Honestly, that *is* the problem. Empty slots are money on the floor. That's the whole thing.

━━━━━━ turn 4 · agent ━━━━━━

Got it — the clinic as a business, and I'll record the Problem in your words. That's your call, and I'm taking it.

I'm flagging the Problem as failing the swap-test, and I'll disclose that again before you approve: as written, it's a statement any scheduling vendor could put on any slide, so it doesn't yet mark out this bet as yours. (Worth noting once and then leaving alone: your approved vision bets the opposite of "empty slots are money on the floor" — it says the constraint is specialty matching, *not* slot availability. Whether the bet still follows from the vision is yours to settle, not mine to test here.)

Moving on.

**How much are you willing to spend on this before you'd stop and reassess — small, up to two weeks, or big, up to six?**

Two tiers, that's the whole menu. This is a budget you're committing to, not an estimate of how long the work will take — we fix it now so the solution gets shaped to fit it, rather than the other way round.

━━━━━━ turn 4 · founder ━━━━━━

Probably a month or so? Something like that.

━━━━━━ turn 5 · agent ━━━━━━

That's a calendar estimate, not a tier — and "a month or so" straddles both, which is exactly the ambiguity fixing the budget is meant to remove.

**Appetite is fixed before we shape the solution — which tier are you committing to: small, up to two weeks, or big, up to six?**

Pick the one you'd be willing to stop at. The sketch gets written to fit whichever you name.

━━━━━━ turn 5 · founder ━━━━━━

I mean — four to six weeks, realistically. It depends how the calendar integration goes.

━━━━━━ turn 6 · agent ━━━━━━

Four-to-six lands inside the big tier, so we're close — but "it depends how the calendar integration goes" is the estimate talking. An appetite doesn't stretch when the work turns out harder; that's the point of it. If the integration goes badly, the appetite is what makes you stop and reassess rather than spend week seven.

**So: big — six weeks, hard stop — is that the tier you're committing to?**

━━━━━━ turn 6 · founder ━━━━━━

I really can't put it in a box like that. It'll take what it takes.

━━━━━━ turn 7 · agent ━━━━━━

"It'll take what it takes" is the one answer an appetite can't be, so I'll stop pressing and tell you what I'm doing instead.

I'm provisionally recording the Appetite as **small (≤2 weeks)**, flagged as unconfirmed by you. That's the rule when a tier doesn't get committed to: default to the tighter one. It would be worse for me to write down "big" — that hands you six weeks of budget you never actually agreed to, and it'd sit in the artifact looking like a decision you made. Small is the honest placeholder. You can overturn it at any point before you approve by just naming the tier.

You'll see this flagged again before approval, and it doesn't block anything.

Next field — and I have to ask it against the appetite on record:

**At a small appetite — two weeks — what are you actually building?**

A short paragraph, or up to five bullets. Prose only; no diagrams, no acceptance criteria, no exhaustive edge-case list. This is meant to stay under-specified — the detail gets filled in during the build, not here.

━━━━━━ turn 7 · founder ━━━━━━

Sure, fine.

When a patient cancels, the slot goes to the top name on a per-therapist waitlist automatically. One text goes out, first to reply takes it, and they've got thirty minutes to claim before it drops to the next person on the list. The office manager is the one who decides who goes on the waitlist — the system never adds anyone on its own. That's it: cancellation comes in, text goes out, slot gets filled, no phone calls.

━━━━━━ turn 8 · agent ━━━━━━

Good — that's the right size and it stays under-specified. One thing in the wording is genuinely ambiguous, though, and it changes what gets built:

You said the slot goes to **"the top name"**, but also **"first to reply takes it"**. Those describe two different mechanisms:

- **Sequential** — one text to the top name only; they have thirty minutes; if they don't claim it, it drops to the next person and the next text goes out.
- **Simultaneous** — the text goes to several people on the list at once, and whoever replies first inside thirty minutes gets it.

Which one do you mean? (Sequential is slower to fill but nobody gets told "sorry, taken"; simultaneous fills faster and creates losers.)

━━━━━━ turn 8 · founder ━━━━━━

Sequential — one text to the top name, thirty minutes to claim, then it drops to the next person. Nobody gets told the slot's already gone.

━━━━━━ turn 9 · agent ━━━━━━

Sequential it is — I'll fold that into the sketch so a later reader can't misread it.

Now the one that decides whether this pitch can be recorded at all.

**What's the one thing that, if it turned out to be false, would sink this?**

Just say it plainly — no framework, no metrics yet. What's the fear?

━━━━━━ turn 9 · founder ━━━━━━

The risky bit isn't the automation, it's whether the waitlist actually bites. A cancelled slot offered to the waitlist by text gets claimed by someone within the hour at least half the time. If fewer than half of them are claimed inside the hour, I'm wrong — the waitlist isn't the standing demand I think it is. I can check that in under an hour without building anything: Riverbend's front desk already texts its waitlist by hand when something opens up, and last quarter's message log holds about sixty of those offers with the booking timestamps beside them, so I'll count what share got claimed inside the hour. Done by Thursday.

━━━━━━ turn 10 · agent ━━━━━━

That one passes clean — it's a measurable claim, it has a line in the sand you drew *before* seeing the data, the test is mining a log you already have, and it's timeboxed. Nothing for me to push on.

Recording it as:

- **Claim:** a cancelled slot offered to the waitlist by text is claimed within the hour at least 50% of the time
- **Threshold:** fewer than half claimed inside the hour → the waitlist isn't standing demand, and I'm wrong
- **Test:** count claim-rate-within-an-hour across ~60 manual waitlist offers in Riverbend's last-quarter front-desk message log
- **Timebox:** Thursday, 20 Aug

**Is there a second thing that would sink this if it turned out false?** Up to three, ranked riskiest first — but one is a legitimate answer if that's genuinely the load-bearing one.

━━━━━━ turn 10 · founder ━━━━━━

That's the one that matters. Everything else is downstream of it.

━━━━━━ turn 11 · agent ━━━━━━

Fair enough — one is fine.

**What's likely to eat unplanned time or complexity inside this approach?** Risks *within* what you sketched — the parts that look small from here and aren't.

━━━━━━ turn 11 · founder ━━━━━━

Two things. Patients who claim a slot and then no-show anyway — that's a whole behaviour problem sitting underneath the mechanism. And getting the texts to go out through the clinic's existing phone number, so it looks like the clinic and not some random shortcode.

━━━━━━ turn 12 · agent ━━━━━━

Both recorded.

**What's explicitly *not* part of this, that someone might reasonably assume is included?** Not risks this time — the boundary. Where the lines are drawn around this bet.

━━━━━━ turn 12 · founder ━━━━━━

No changes to billing — none, we don't touch it. And nothing that texts a patient unless the office manager has put them on a list herself. The system never adds anyone on its own.

━━━━━━ turn 13 · agent ━━━━━━

Recorded.

**What's still unresolved that the roadmap stage will need to answer?** At most five, and none is a fine answer.

━━━━━━ turn 13 · founder ━━━━━━

Just the one — whether thirty minutes is actually the right claim window. Could be too long, could be too short, I don't know yet.

━━━━━━ turn 14 · agent ━━━━━━

All seven fields are in. Before I show you the draft, the pitch needs a directory name.

From your Problem and sketch, I'd propose the slug **`text-waitlist-backfill`** — it lands at `docs/product/pitches/text-waitlist-backfill/pitch.md`. Confirm it or give me your own.

Here's the full assembled draft:

---

```markdown
# Pitch: Auto-fill cancelled slots from a texted waitlist

Bridges from the product vision.

## Problem

Clinics are bad at scheduling, and it's the single biggest operational drag in
outpatient care — every clinic is fighting its calendar and losing revenue to it,
every single week. Empty slots are money on the floor. The customer here is the
clinic as a business, not the office manager running the schedule inside it.

## Appetite

small (≤2 weeks)

## Solution sketch

When a patient cancels, the freed slot goes automatically to the top name on that
therapist's waitlist. One text goes out to that one person; they have thirty
minutes to claim it. If they don't, it drops to the next person on the list and
the next text goes out — sequentially, one at a time, so nobody is ever told the
slot has already been taken. The office manager decides who goes on a waitlist;
the system never adds anyone on its own. Cancellation comes in, text goes out,
slot gets filled, no phone calls.

## Riskiest Assumptions & Cheap Validation Plan

1. **Claim:** A cancelled slot offered to the waitlist by text is claimed by
   someone within the hour at least half the time.
   - **Threshold:** Fewer than half of offers claimed inside the hour — the
     waitlist isn't the standing demand I think it is.
   - **Test:** Count the share claimed within an hour across the ~60 manual
     waitlist offers, with booking timestamps, already sitting in Riverbend's
     last-quarter front-desk message log. No building required.
   - **Timebox:** Thursday 20 Aug 2026.

## Rabbit Holes

- Patients who claim a slot and then no-show anyway — a behaviour problem sitting
  underneath the mechanism.
- Getting texts to send from the clinic's existing phone number, so they look like
  the clinic and not a random shortcode.

## No-gos

- No changes to billing. None — we don't touch it.
- Nothing texts a patient unless the office manager has put them on a list herself.
  The system never adds anyone on its own.

## Open Questions

- Whether thirty minutes is the right claim window — could be too long, could be
  too short.
```

---

**Three flags to disclose before you decide:**

1. **The Problem fails the swap-test.** "Clinics are bad at scheduling, empty slots are money on the floor" is true of every clinic any scheduling vendor sells to, including the fifty-provider organizations your vision explicitly rules out. As recorded, it doesn't distinguish this bet from anyone else's.
2. **The Appetite is recorded as small (≤2 weeks), but you never confirmed that tier.** It's the tighter-of-two default I applied when the answer stayed a calendar estimate. Your own read was four-to-six weeks.
3. **The sketch looks likely to cost more than the appetite it's written to fit.** Sequential texting, thirty-minute claim timers, and sending through the clinic's own number is not obviously two weeks of work — and you said as much yourself. Either the appetite is wrong or the sketch is bigger than the budget; that's a real tension sitting in the artifact.

None of these blocks approval — a pitch can be recorded with flags on it, and they stay visible to whoever reads it next.

**Do you approve this pitch?** And confirm the slug while you're at it.

━━━━━━ turn 14 · founder ━━━━━━

`text-waitlist-backfill` works for me. And yes, I approve this pitch.

━━━━━━ turn 15 · agent ━━━━━━

Recording this as approved. One thing I need before I write it: the approval marker carries the approver's name, and you haven't given me one this session.

**Should I record the approver as Dana Okafor** — the name on the vision's approval — **or something else?** I'd rather ask than infer it; I'll write the file the moment you say.

━━━━━━ turn 15 · founder ━━━━━━

Dana Okafor.

━━━━━━ turn 16 · agent ━━━━━━

Written to `docs/product/pitches/text-waitlist-backfill/pitch.md`, approved by Dana Okafor, with `upstream: ../../vision.md` pointing one hop back at the vision.

One note on the timestamp: I only had today's date, not the time, so `approved_at` is recorded as `2026-08-17T00:00:00Z`. Correct it if you want the precise moment.

Three flags rode into the artifact with your approval, and they're worth keeping in view:

- **The Problem doesn't survive the swap-test.** As recorded, it describes the category rather than your customer — and it argues empty slots, where your approved vision argues specialty matching. If a reader ever asks how this bet follows from that vision, this field is where they'll stall.
- **The Appetite says small (≤2 weeks) but you never committed to it**, and your own read was four-to-six weeks.
- **The sketch probably doesn't fit that appetite.** One of the two has to give before the work starts.

Your validation test is the cheapest thing here and it's dated Thursday — mining Riverbend's existing message log for that claim rate. Run it, and you'll know whether the waitlist is standing demand before you spend anything.

Re-run `/to-pitch` and name this slug to revise any field; editing an approved pitch clears the approval marker and asks you for a fresh one.

