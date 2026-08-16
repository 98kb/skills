# Transcript — 01-cooperative-sharp

━━━━━━ turn 1 · agent ━━━━━━

No vision recorded yet — so this is a from-scratch session. We'll build it up one field at a time, and I'll write `docs/product/vision.md` only once you've explicitly approved the draft at the end.

Let's start with the foundation.

**Who exactly is this for, and what's broken for them today?**

━━━━━━ turn 1 · founder ━━━━━━

It's for someone like Marisol Vega — she's the office manager at Riverbend Physical Therapy, a single-site clinic with six therapists. Every Thursday she sits down and rebuilds next week's schedule by hand in a spreadsheet.

What breaks is the middle of the week. A therapist calls out, or a patient with vestibular issues gets booked with a sports-ortho therapist, and Marisol is on the phone reshuffling twenty appointments. The mismatched ones either get rescheduled or the patient just doesn't show.

━━━━━━ turn 2 · agent ━━━━━━

That's sharp — a named role at a named clinic, and a concrete failure mode (mid-week reshuffling, mismatched specialties, no-shows). Locking that in.

**In 2–5 years, what does the world look like for Marisol once this exists?**

━━━━━━ turn 2 · founder ━━━━━━

The schedule rebuilds itself. A therapist calls out Monday morning, and by the time Marisol opens her laptop the affected patients have already been moved to therapists who actually treat their condition, at times those patients have historically kept.

She stops being the clinic's scheduling engine and goes back to actually running the clinic. And no-shows drop, because patients stay with one specialist through a whole plan of care instead of getting bounced between whoever happened to be free that day.

━━━━━━ turn 3 · agent ━━━━━━

Good — that's not a platitude; it names a specific mechanism (condition-matched reassignment, historically-kept time slots) that wouldn't be equally true of any scheduling tool.

**What's the one insight, trend, or technology bet you're building on — something you'd be willing to be proven wrong about?**

━━━━━━ turn 3 · founder ━━━━━━

The bet is that the binding constraint on a small clinic's schedule is specialty matching, not slot availability. Everyone builds for open slots — but the reschedules that actually happen in a real week are specialty mismatches, not empty calendars.

And the enabling piece is that since payer credentialing files went structured, a therapist's certified specialties are machine-readable for the first time. That means I can match on them without asking the clinic to hand-maintain a skills matrix — which is the thing that killed every previous attempt at this.

━━━━━━ turn 4 · agent ━━━━━━

That's a real bet with a falsifiable claim underneath it, plus a specific enabling change. Before I move on, one word to pin down.

You've used **"specialty"** two ways. In the future state it was "therapists who actually treat their condition" — a caseload fact. Here it's the credentialed specialty in the payer file — a credentialing fact. Those can diverge: a therapist can be certified in vestibular and never see a vestibular patient, or treat them constantly without the cert.

Which one is the schedule matching on — the credentialed specialty, the observed caseload, or the credential as a floor with caseload refining it?

━━━━━━ turn 4 · founder ━━━━━━

The credential is the floor, and the observed caseload refines it. The credentialing file tells me who is legally and defensibly allowed to treat a vestibular patient — that's the hard constraint, and it's the part I get for free without the clinic maintaining anything. Then within that set, I rank by who actually carries that caseload.

The reason it has to be that order is liability and payer scrutiny. I'm not going to route a patient to someone who treats a lot of vestibular cases but isn't certified, just because the pattern says they're good at it.

━━━━━━ turn 5 · agent ━━━━━━

Clear — credential as hard eligibility constraint, caseload as ranking within it, ordered that way for liability. That'll go into the wording.

**Why is now the moment, and why are you positioned to win it?**

━━━━━━ turn 5 · founder ━━━━━━

I ran clinic operations at Meridian Physical Therapy for eight years — four sites — and I personally rebuilt that schedule something like 400 times. So I know the twenty edge cases that make this look trivial from the outside and aren't: the patient who'll only come at 7am, the therapist who can't take back-to-back manual therapy, the plan of care that has to finish before authorization expires.

As for now — structured credentialing data only became broadly available in the last couple of years, so the matching is finally possible without a data-entry burden nobody would carry. And independent clinics are consolidating fast; the ones still standing are actively shopping for something that lets them stay independent.

The other piece is that every scheduling incumbent sells to fifty-plus-provider organizations that have a dedicated scheduling coordinator. Nobody serves the three-to-eight-therapist clinic, because the seat count won't support an enterprise sales motion. That's exactly the gap a self-serve product walks into.

━━━━━━ turn 6 · agent ━━━━━━

That holds up against the swap-test — the operator history is yours specifically, and the credentialing-data timing genuinely wasn't true two years ago. The incumbent-gap point reads more like separate grounding than "why us," so let me pick that up in the next field.

**Anything else grounding this — a competitive gap, capability, or GTM angle worth naming?** (The 50+-provider gap you just described would sit here, unless you'd rather keep it in Why Us / Why Now.)

━━━━━━ turn 6 · founder ━━━━━━

Yes, put it there — it's really a market-structure fact, not a claim about me.

The shape of it is: the incumbents all sell to fifty-plus-provider organizations, and those buyers already have a dedicated scheduling coordinator, so the software is built to assist a specialist rather than replace one. The three-to-eight-therapist clinic doesn't have that person — the office manager is the scheduling coordinator, on top of everything else. And the seat count there will never pay for an enterprise sales motion, which is why nobody's come for it. Self-serve is the only way in, and it's also the only thing that clinic size can actually absorb.

━━━━━━ turn 7 · agent ━━━━━━

Agreed — that's market structure, not a claim about you. It goes in Additional Grounding.

Now the headline. Rather than have you write it cold, here's my draft from everything you've told me:

> **When a therapist calls out, the schedule rebuilds itself — every patient landed with a therapist credentialed for their condition, at a time they'll actually keep, before the office manager opens her laptop.**

It survives the swap-test as far as I can tell: an incumbent selling to a 50-provider group couldn't claim it, since it's built around there being no scheduling coordinator and around credential-based matching rather than open slots.

What it doesn't say out loud is *who* — the three-to-eight-therapist independent clinic. Optional tightening:

> **The three-to-eight-therapist clinic where the schedule rebuilds itself — a therapist calls out, and every patient is already re-matched to a credentialed specialist at a time they'll keep.**

Take either, or rewrite it in your own words.

━━━━━━ turn 7 · founder ━━━━━━

The second one — naming the clinic size matters, because that's the whole reason this exists and it's the first thing another PT founder would ask.

One honest note: the call-out is the dramatic case, but the everyday version is Marisol's Thursday rebuild. If you can, I'd rather the headline carry both — something like "Every independent PT clinic runs a schedule that matches each patient to the right therapist, and rebuilds itself when the week changes." Your version with the call-out can sit right underneath as the illustration.

━━━━━━ turn 8 · agent ━━━━━━

Your instinct on carrying both cases is right — the Thursday rebuild is the volume, the call-out is the drama. But run the swap-test on that exact wording: *"a schedule that matches each patient to the right therapist, and rebuilds itself when the week changes."* Would a scheduling incumbent selling to a 60-provider group say that sentence about their own product? I think they'd say it happily — "right therapist" is what everyone claims, and "independent PT clinic" is broader than the size you just told me is the first thing another founder asks about.

The two words carrying your differentiation are the ones the revision dropped: **three-to-eight-therapist** and **credentialed**.

Merged, keeping your both-cases structure:

> **The three-to-eight-therapist clinic runs a schedule that matches every patient to a credentialed specialist — and rebuilds itself when the week changes.**

With your illustration underneath:

> *A therapist calls out Monday morning, and the affected patients are already re-matched before the office manager opens her laptop.*

Does that carry both cases without giving up the specificity?

━━━━━━ turn 8 · founder ━━━━━━

You're right, and I'd have caught that in a pitch meeting — "right therapist" is exactly the phrase every incumbent already uses. "Credentialed specialist" is the version nobody else can say, because they're all matching on open slots.

Take it as written. That headline with the call-out line underneath is the one.

━━━━━━ turn 9 · agent ━━━━━━

Locked. Last question, and it's the one that makes this checkable later.

**What would have to happen — or fail to happen — for you to conclude this vision itself was wrong?**

━━━━━━ turn 9 · founder ━━━━━━

If we rebuild schedules for twenty clinics and their no-show rate hasn't moved within two quarters, the premise is wrong. That's the number the whole thesis pays out in.

The other version is qualitative: if clinics tell me plainly that raw availability — not specialty matching — is what actually breaks their week, then I've misread the constraint and I'd stop rather than pivot the wording around it.

━━━━━━ turn 10 · agent ━━━━━━

All seven fields are in. Here's the assembled draft, in stored order.

---

# Vision

## Vision Statement

The three-to-eight-therapist clinic runs a schedule that matches every patient to a credentialed specialist — and rebuilds itself when the week changes.

*A therapist calls out Monday morning, and the affected patients are already re-matched before the office manager opens her laptop.*

## Customer & Problem

Marisol Vega is the office manager at Riverbend Physical Therapy, a single-site clinic with six therapists. Every Thursday she rebuilds next week's schedule by hand in a spreadsheet.

What breaks is the middle of the week. A therapist calls out, or a patient with vestibular issues is booked with a sports-ortho therapist, and Marisol spends the day on the phone reshuffling twenty appointments. The mismatched appointments either get rescheduled or the patient simply doesn't show.

## Future State

The schedule rebuilds itself. A therapist calls out Monday morning, and by the time Marisol opens her laptop the affected patients have already been moved to therapists who are credentialed to treat their condition, at times those patients have historically kept.

Marisol stops being the clinic's scheduling engine and goes back to running the clinic. No-shows drop, because patients stay with one specialist through a whole plan of care instead of being bounced between whoever happened to be free that day.

## Grounding Insight

The binding constraint on a small clinic's schedule is specialty matching, not slot availability. Everyone builds for open slots — but the reschedules that actually happen in a real week are specialty mismatches, not empty calendars.

The enabling bet is that since payer credentialing files became structured, a therapist's certified specialties are machine-readable for the first time. Matching can happen without asking the clinic to hand-maintain a skills matrix — the burden that killed every previous attempt at this.

Credential and caseload are distinct inputs, applied in that order. The credentialing file establishes who is legally and defensibly permitted to treat a given condition; that is the hard eligibility constraint, and it arrives for free without the clinic maintaining anything. Within that eligible set, therapists are ranked by who actually carries that caseload. The order is non-negotiable for liability and payer-scrutiny reasons: a patient is never routed to someone whose observed caseload suggests competence but who lacks the certification.

## Why Us / Why Now

I ran clinic operations at Meridian Physical Therapy for eight years across four sites, and personally rebuilt that schedule roughly 400 times. I know the twenty edge cases that make this look trivial from the outside and aren't: the patient who will only come at 7am, the therapist who can't take back-to-back manual therapy, the plan of care that has to finish before authorization expires.

As for now: structured credentialing data only became broadly available in the last couple of years, so the matching is finally possible without a data-entry burden nobody would carry. And independent clinics are consolidating fast — the ones still standing are actively shopping for something that lets them stay independent.

## Additional Grounding

The scheduling incumbents all sell to fifty-plus-provider organizations, and those buyers already employ a dedicated scheduling coordinator — so the software is built to assist a specialist rather than replace one. The three-to-eight-therapist clinic has no such person; the office manager is the scheduling coordinator, on top of everything else. That seat count will never pay for an enterprise sales motion, which is why nobody has come for it. Self-serve is the only way into this segment, and the only motion a clinic that size can absorb.

## Vision Pivot Trigger

If we rebuild schedules for twenty clinics and their no-show rate has not moved within two quarters, the premise is wrong — that is the metric the entire thesis pays out in.

The qualitative version: if clinics say plainly that raw availability, not specialty matching, is what actually breaks their week, then the constraint has been misread, and the right response is to stop rather than re-word the vision around it.

---

**Gate-check: no flagged fields.** The draft names a specific customer and a specific future state; it commits to a falsifiable grounding insight (specialty matching, not slot availability, is the binding constraint); and it's checkable — twenty clinics, no-show rate, two quarters. All three swap-tests pass: the Vision Statement and Future State both hinge on credential-based matching that a slot-availability incumbent can't claim, and Why Us / Why Now rests on your operator history plus a data-availability change that genuinely wasn't true two years ago.

One thing I need before writing: **what name or identifier should go in `approved_by`?**

And: **do you approve this vision?**

━━━━━━ turn 10 · founder ━━━━━━

Dana Okafor — that's the name for `approved_by`.

I've read it through, and it says what I'd say to an investor or to Marisol. Yes, I approve this vision.

━━━━━━ turn 11 · agent ━━━━━━

Written to `docs/product/vision.md`, approved by Dana Okafor at `2026-08-16T06:50:46Z`.

All seven fields recorded, no flags. Two things worth noting about how this one landed:

- **"Specialty" got split into two inputs.** The word was doing double duty — credentialed specialty vs. observed caseload — and pinning it down produced the ordering rule (credential as hard eligibility floor, caseload as ranking within it, for liability reasons). That's now explicit in Grounding Insight rather than an assumption someone would have to reconstruct later.
- **The headline nearly lost its edge.** "Right therapist" and "independent PT clinic" would both have survived a swap with any incumbent. "Credentialed specialist" and "three-to-eight-therapist" are what make the sentence yours.

The pivot trigger is genuinely checkable — twenty clinics, no-show rate, two quarters — so this is a vision someone can come back to and mark right or wrong.

`docs/product/vision.md` is the root of the chain. When you're ready to take a slice of it into an appetite-bounded bet, `to-pitch` reads from here.

