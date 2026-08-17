---
upstream: ../../vision.md
approved_by: Dana Okafor
approved_at: 2026-08-17T00:00:00Z
---

# Pitch: Credential-filtered reschedule list

Bridges from the [product vision](../../vision.md).

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
