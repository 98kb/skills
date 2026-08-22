---
upstream: ../../vision.md
approved_by: Dana Okafor
approved_at: 2026-08-17T00:00:00Z
---

# Pitch: Text the waitlist to fill same-day cancellations

Bridges from the [product vision](../../vision.md).

## Problem

Marisol Vega, office manager at a six-therapist clinic, loses six to eight patients a week to cancellations and reschedules — almost always the morning of. The right patient to fill that slot is someone already mid-course with *that* therapist, same plan of care, same body part, due for a visit this week, and able to get to the clinic by two. Marisol holds that in her head rather than in the system, so filling one slot means scanning the therapist's caseload, working out who's behind on visits, then calling them one at a time and mostly reaching voicemail. Four calls in it's one-thirty, the slot is gone, and she's stopped trying — she writes them off.

## Appetite

Small (≤2 weeks)

## Solution sketch

When a slot gets cancelled, we text the top name on that therapist's waitlist: "there's a slot at 2pm today, reply YES to take it." They have thirty minutes to claim it; if nothing comes back, the offer moves to the next person down the list. Marisol builds and orders the list herself — nobody is added automatically. No matching logic, no caseload scanning. Just a list she controls and a text that goes out without her having to do anything.

## Riskiest Assumptions & Cheap Validation Plan

1. **Claim:** Auto-offering a cancelled slot by text fills at least half of offered slots within the hour.
   - **Threshold:** Fewer than a quarter of offered slots claimed within an hour, across whatever cancellations the test week produces (roughly twelve to sixteen).
   - **Test:** Hand-text the waitlist at Riverbend and one other clinic for a week — no software, founder texting from the list personally — and count how many are claimed inside an hour. About an hour of founder time total.
   - **Timebox:** By Friday 21 August 2026.

## Rabbit Holes

- A patient claims the slot and then no-shows anyway.
- Texting from the clinic's existing phone number — Marisol wants messages to look like they came from Riverbend, not a shortcode, and getting a carrier to permit sending from their landline can eat a week of a two-week bet.

## No-gos

- No billing changes — nothing about how a filled slot gets charged or credited.
- No auto-populating the waitlist from the schedule. Nobody gets texted who Marisol didn't put on a list herself.

## Open Questions

- Whether thirty minutes is the right claim window — possibly too long when the slot is at two and it's already noon, possibly too short for someone mid-session. To be answered by the hand-texting week rather than argued now.
