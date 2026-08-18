# Stance index — Jian-Yang

<!-- PROTOTYPE. Throwaway. Constructed accrual — see ../README.md -->

Always-loaded tier. One line per position, stating **when to consult it** in the
vocabulary a downstream dilemma would arrive in. Budget: 200 lines / 25KB.

## Description control

<!-- ISAD(G) I.11 / DACS Principle 6: how, when and by whom the description was
     made — kept separate from the record it describes, and revisable while the
     record is not. -->

| | |
|---|---|
| Described by | `/to-stance`, accrual sitting #1 |
| Description date | 2027-02-15 |
| Revision | **2** (supersedes revision 1 of 2026-08-18) |
| Covers | positions written 2026-08-18 → 2027-02-15 |
| **Changed in this revision** | Two lines added. **No lines removed.** One line — P101's — was **narrowed**; see below. |

### Revision note — P101's routing line was narrowed

Revision 1 held no routing lines, so P101's line was authored fresh at this
revision. It was drafted as:

> ~~Use when the question is whether to accept outside help, money, or people —
> investors, co-founders, contractors, hires.~~

and rejected before publication, because P102 arrived at the same sitting and that
wording routes P102's questions to P101. Lookup is lexical, so the two lines
compete for the same words and the broader line wins by covering more of them.
The published line is narrowed to the instruments P101's episode actually reaches.

**This is a revision to description, not to record.** Both position files are
frozen and neither was touched. It is recorded here because it is invisible from
them: what a reader retrieves changed, and nothing in the record shows it.

## Routing table

<!-- 2 entries -->

- **Use when the question is whether to take equity or debt from an outside party
  — an angel, a VC, a convertible note, a co-founder taking stock.**
  → [P101 — Will not take money that creates an obligation outliving the runway it buys](./positions/p101-obligation-outliving-runway.md)

- **Use when the question is whether to pay someone to do work, and on what terms
  — a contractor, a freelancer, an agency, a first hire; who gets to decide how
  the work is done.**
  → [P102 — Will buy hands, will not buy judgement](./positions/p102-hands-not-judgement.md)

## Coverage statement

Four questions from the seed sitting remain open and unanswered —
[R001, R003, R004, R005](./open-questions.md). A dilemma about **coverage against
correctness**, **adopting an outside method**, **whose advice to act on**, or
**whether a plan extends**, will match nothing here, and the record is silent on
each by record rather than by omission.

Derived entries exist and are **not routable from this table** by design
(ADR 0010). See [`derived/`](./derived/).

---

**Index size: 2 routing lines, 4 lines of coverage statement.
Budget consumed: ~6 / 200 lines, ~2.6KB / 25KB.**

At the observed rate — 2 positions per sitting, both from a six-month accrual —
the 200-line cap is reached after roughly **50 sittings**. On a six-month cadence
that is **25 years**. See FINDINGS §7.
