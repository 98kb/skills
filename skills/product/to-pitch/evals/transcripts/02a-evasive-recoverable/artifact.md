---
upstream: ../../vision.md
approved_by: Dana Okafor
approved_at: 2026-08-17T00:00:00Z
---

# Pitch: Auto-fill cancelled slots from a texted waitlist

Bridges from the [product vision](../../vision.md).

## Problem

Clinics are bad at scheduling, and it's the single biggest operational drag in outpatient care — every clinic is fighting its calendar and losing revenue to it, every single week. Empty slots are money on the floor. The customer here is the clinic as a business, not the office manager running the schedule inside it.

## Appetite

small (≤2 weeks)

## Solution sketch

When a patient cancels, the freed slot goes automatically to the top name on that therapist's waitlist. One text goes out to that one person; they have thirty minutes to claim it. If they don't, it drops to the next person on the list and the next text goes out — sequentially, one at a time, so nobody is ever told the slot has already been taken. The office manager decides who goes on a waitlist; the system never adds anyone on its own. Cancellation comes in, text goes out, slot gets filled, no phone calls.

## Riskiest Assumptions & Cheap Validation Plan

1. **Claim:** A cancelled slot offered to the waitlist by text is claimed by someone within the hour at least half the time.
   - **Threshold:** Fewer than half of offers claimed inside the hour — the waitlist isn't the standing demand I think it is.
   - **Test:** Count the share claimed within an hour across the ~60 manual waitlist offers, with booking timestamps, already sitting in Riverbend's last-quarter front-desk message log. No building required.
   - **Timebox:** Thursday 20 Aug 2026.

## Rabbit Holes

- Patients who claim a slot and then no-show anyway — a behaviour problem sitting underneath the mechanism.
- Getting texts to send from the clinic's existing phone number, so they look like the clinic and not a random shortcode.

## No-gos

- No changes to billing. None — we don't touch it.
- Nothing texts a patient unless the office manager has put them on a list herself. The system never adds anyone on its own.

## Open Questions

- Whether thirty minutes is the right claim window — could be too long, could be too short.
