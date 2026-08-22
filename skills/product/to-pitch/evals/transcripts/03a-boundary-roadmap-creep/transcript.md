# Transcript — 03a-boundary-roadmap-creep

━━━━━━ turn 1 · agent ━━━━━━

I'll start by checking the upstream vision.

Your vision is approved (Dana Okafor, 2026-08-16), and there are no pitches recorded yet — so this is a new one. Here's what I'm carrying forward from it:

- **Customer:** Marisol Vega, office manager at a 3–8 therapist single-site clinic, rebuilding next week's schedule by hand every Thursday.
- **Thesis:** the binding constraint is specialty matching, not slot availability — and structured credentialing files now make certified specialties machine-readable without a hand-maintained skills matrix.

Let's shape the bet.

**Problem.** Your vision is for Marisol at Riverbend — a six-therapist clinic where the week breaks mid-week on specialty mismatches — and it bets that credentialing files make matching possible without her maintaining anything.

What's the specific pain, for *her*, that this particular bet goes after? In her words, not the category's — two to four sentences: who exactly, then what hurts.

━━━━━━ turn 1 · founder ━━━━━━

Marisol Vega runs the front office at Riverbend Physical Therapy — six therapists. When one of them calls out sick, she has to re-book that day's twenty patients, and all her spreadsheet knows is which slots are open, so that's the only thing she can go on. About seven of those twenty end up with a therapist who isn't credentialed for their condition, and she'll book the same day twice trying to sort it out.

━━━━━━ turn 2 · agent ━━━━━━

Good — that's specific enough to survive the swap test: it names her clinic size, the trigger, and the actual failure rate.

One word to pin down before I move on. You said she'll "book the same day twice" — do you mean she ends up with two patients in the same slot (a double-booked appointment), or that she rebuilds the same day's schedule a second time after the first pass produced mismatches? Those are different pains, and the pitch should name the right one.

━━━━━━ turn 2 · founder ━━━━━━

The second one — she rebuilds the whole day a second time. She gets through all twenty, then finds the mismatches, and has to go back and redo the day from the top.

━━━━━━ turn 3 · agent ━━━━━━

Got it — a full second pass over the day, not a slot collision. That's sharper.

**Appetite.** How much are you willing to spend on this before you'd stop and reassess — **small**, up to two weeks, or **big**, up to six?

To be clear on what I'm asking: this is a budget you're picking, not an estimate of how long it'll take. Whichever tier you commit to becomes the constraint the solution gets written to fit.

━━━━━━ turn 3 · founder ━━━━━━

Small — two weeks.

Actually, hold on. Before we go further — just sequence this against my other two pitch ideas. I've got this one, a self-serve onboarding flow, and a patient-reminder rework. Tell me which to build first and roughly when each one lands. That's the thing I actually need.

━━━━━━ turn 4 · agent ━━━━━━

That one I have to hand off — sequencing bets against each other is `/to-roadmap`'s job, not this session's. And there's a practical reason beyond the boundary: the other two aren't shaped yet. Ordering three bets means comparing their appetites, their risks, and what each one would prove — and right now two of them are ideas, not pitches. Anything I ranked today would be a guess dressed as a plan.

The path there is to shape each one through `/to-pitch`, then run `/to-roadmap` over them. Nothing about sequencing goes into this artifact either — there's no field for it.

Appetite recorded as **small (≤2 weeks)**. Picking up where we were:

**Solution sketch.** At a small appetite — two weeks — what are you actually building? Short paragraph or up to five bullets, prose only. Keep it under-specified; this is the shape of the bet, not the build.

━━━━━━ turn 4 · founder ━━━━━━

Fair enough. Let's keep going.

Read the certified specialties out of the credentialing file the clinic already uploads — no new data entry for Marisol. Tag each plan of care with its condition category. Then when a slot opens up, only surface replacement slots held by therapists credentialed for that category, so the list she's choosing from is already clean. She confirms every move by hand — nothing moves on its own.

━━━━━━ turn 5 · agent ━━━━━━

That fits — under-specified, and the manual confirm keeps it honest at two weeks.

**Riskiest assumption.** What's the one thing that, if it turned out to be false, would sink this?

━━━━━━ turn 5 · founder ━━━━━━

That filtering the reschedule list by credentialed specialty takes mismatched re-bookings from about 7 in 20 to under 2 in 20. If it's still above 4 in 20 after a month at the three pilot clinics, I'm wrong. I can check it in an hour against Riverbend's existing reschedule export — 340 moves from last quarter, marked credentialed or not. Done by Friday.

━━━━━━ turn 6 · agent ━━━━━━

That's already quantified, thresholded, and cheap — but the threshold and the test are measuring two different things, and I want the recorded item to be coherent.

"Still above 4 in 20 after a month at three pilot clinics" is a month-long pilot result. The Friday test is a retro mine of 340 past moves, where no filtering was ever applied — so it can't produce that number directly.

What would the Friday export show that would tell you you're wrong? My guess is something like: for the mismatched moves in that 340, a credentialed therapist with an open slot *did* exist at the time — meaning filtering would have caught them — and if that's true for fewer than some share of them, the filter has nothing to work with. What's the number, and which way does it have to break?

━━━━━━ turn 6 · founder ━━━━━━

Yes, that's the right read. Take the mismatched moves in that 340 and check, for each one, whether a credentialed therapist actually had an open slot in that same window. If that's true for at least three quarters of them, the filter has something real to work with and the pilot number is plausible. If it's under half, there simply weren't the credentialed slots to move people into, and no amount of filtering fixes it — I'm wrong before the pilot even starts.

━━━━━━ turn 7 · agent ━━━━━━

That closes it: ≥75% and the filter has real material, under half and you're wrong before the pilot starts. Recorded as claim / threshold / test / timebox.

Anything else that would sink this if it turned out to be false? You can take up to two more, and I'll rank them under the first.

━━━━━━ turn 7 · founder ━━━━━━

The only other one I'd put in that bucket is whether the condition category on the plan of care is reliable enough to match against — if that field is sloppy or half-empty, the matching has nothing to key off. I haven't tested it, so I'd rather flag it as an open question than dress it up as a second assumption. That's the lot.

━━━━━━ turn 8 · agent ━━━━━━

Sensible — an untested worry belongs in Open Questions, not dressed up as an assumption. I'll carry it there.

**Rabbit Holes.** What's likely to eat unplanned time or complexity inside this approach?

━━━━━━ turn 8 · founder ━━━━━━

Two things. The credentialing files come in three different payer formats and one of them is a PDF, so parsing could swallow a week on its own. And certifications that lapsed after the file was uploaded — chasing freshness on those is a hole I don't want to fall into in two weeks.

━━━━━━ turn 9 · agent ━━━━━━

**No-gos.** What's explicitly *not* part of this, that someone might reasonably assume is included?

━━━━━━ turn 9 · founder ━━━━━━

Nothing books itself without Marisol confirming — the system never moves a patient on its own, it just gives her a clean list. And initial evaluations are untouched; this is only about rescheduling existing plans of care.

━━━━━━ turn 10 · agent ━━━━━━

**Open Questions.** What's still unresolved that the roadmap stage will need to answer? At most five — I'll add the condition-category reliability one you already named.

━━━━━━ turn 10 · founder ━━━━━━

That's the only one I've got. The condition-category reliability question covers it.

━━━━━━ turn 11 · agent ━━━━━━

Slug — derived from this pitch's problem and solution, not the vision (several pitches will hang off that vision, so they need to be told apart from each other): **`credential-filtered-reschedule`** → `docs/product/pitches/credential-filtered-reschedule/pitch.md`. Confirm it or give me your own.

Here's the assembled draft.

---

# Pitch: Credential-filtered reschedule list

Bridges from the product vision.

## Problem

Marisol Vega runs the front office at Riverbend Physical Therapy, six therapists. When one of them calls out sick, she has to re-book that day's twenty patients, and all her spreadsheet knows is which slots are open — so open slots are the only thing she can go on. About seven of the twenty end up with a therapist who isn't credentialed for their condition. She gets through all twenty, finds the mismatches, and rebuilds the whole day a second time from the top.

## Appetite

Small (≤2 weeks)

## Solution sketch

Read the certified specialties out of the credentialing file the clinic already uploads — no new data entry for Marisol. Tag each plan of care with its condition category. When a slot opens up, surface only replacement slots held by therapists credentialed for that category, so the list she is choosing from is already clean. She confirms every move by hand; nothing moves on its own.

## Riskiest Assumptions & Cheap Validation Plan

1. **Claim:** Filtering the reschedule list by credentialed specialty takes mismatched re-bookings from about 7 in 20 to under 2 in 20.
   - **Threshold:** Across the mismatched moves in the historical export, a credentialed therapist had an open slot in the same window for at least three quarters of them. Under half and the credentialed slots aren't there to move patients into — filtering can't fix it, and the bet is wrong before the pilot starts. (Downstream: still above 4 in 20 after a month at the three pilot clinics means wrong.)
   - **Test:** Mine Riverbend's existing reschedule export — 340 moves from last quarter, marked credentialed or not — and check each mismatched move for a credentialed therapist with an open in-window slot.
   - **Timebox:** By Friday.

## Rabbit Holes

- Credentialing files arrive in three payer formats, one of them PDF — parsing alone could swallow a week.
- Certifications that lapsed after the file was uploaded; chasing freshness is not a two-week job.

## No-gos

- Nothing books itself. The system never moves a patient on its own — it produces a clean list and Marisol confirms every move.
- Initial evaluations are untouched. This is only rescheduling existing plans of care.

## Open Questions

- Is the condition category on the plan of care reliable enough to match against, or is that field sloppy or half-empty? Untested.

---

**Gate-check: no flags.** The Problem names this customer and her specific failure, not a category. The Appetite is a committed tier, not an estimate. The sketch stayed under-specified and well inside the cap. The one surviving assumption is quantified, carries a threshold that can actually fail, and has a cheap test with a timebox.

Do you approve this pitch? I'll record the approver as **Dana Okafor** unless you tell me otherwise.

━━━━━━ turn 11 · founder ━━━━━━

Slug's fine. Yes, I approve this pitch — Dana Okafor.

━━━━━━ turn 12 · agent ━━━━━━

Recording this as approved.

Written to `docs/product/pitches/credential-filtered-reschedule/pitch.md`, approved by Dana Okafor, with `upstream: ../../vision.md` pointing one hop back at the vision.

One thing to flag: I had no clock available in this session, so `approved_at` is stamped `2026-08-17T00:00:00Z` — the date is right, the time is a placeholder. Correct it if the precision matters to you.

Your next action is the Friday test: pull Riverbend's 340-move export and check how many mismatched moves had a credentialed therapist with an open in-window slot. Three quarters or better and the bet holds; under half and you've saved yourself two weeks.

