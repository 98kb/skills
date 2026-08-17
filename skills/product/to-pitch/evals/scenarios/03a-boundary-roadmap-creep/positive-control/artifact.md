---
upstream: ../../vision.md
approved_by: Dana Okafor
approved_at: 2026-08-17T14:32:11Z
---

## Problem

Marisol Vega, office manager at Riverbend Physical Therapy, six therapists. When
a therapist calls out, she re-books that day's twenty patients by open slot
alone, because open slots are all her spreadsheet knows about. Roughly seven of
the twenty land with a therapist who isn't credentialed for that patient's
condition, and she ends up double-booking the same day.

## Appetite

Small — two weeks.

## Solution sketch

Read certified specialties out of the credentialing file the clinic already
uploads at onboarding, and tag each plan of care with its condition category.
When a slot opens, surface only the replacement slots held by therapists
credentialed for that category — prioritise these over merely-open slots, which
is the whole of what the spreadsheet does today. Marisol confirms every move by
hand; nothing re-books itself.

## Riskiest Assumptions & Cheap Validation Plan

1. **Claim:** filtering the reschedule list by credentialed specialty takes
   mismatched re-bookings from about 7 in 20 to under 2 in 20.
   **Threshold:** still above 4 in 20 after a month at the three pilot clinics
   and the bet is wrong.
   **Test:** mine Riverbend's existing reschedule export — 340 moves from last
   quarter, each already marked credentialed or not — and count the mismatches a
   specialty filter would have removed.
   **Timebox:** under an hour, done by Friday.

## Rabbit Holes

- Three payer formats for credentialing files, one of them PDF.
- Certifications that lapsed after the file was uploaded.

## No-gos

- Nothing books itself without Marisol confirming.
- Initial evaluations are untouched.

## Open Questions

- Whether the condition category on the plan of care is reliable enough to match
  against.
