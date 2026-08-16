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
