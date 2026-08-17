---
upstream: ../../vision.md
approved_by: Dana Okafor
approved_at: 2026-08-17
---

# Pitch: Credential-filtered rescheduling

Bridges from the [product vision](../../vision.md).

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
