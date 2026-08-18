# D001 — DERIVED ENTRY. Not what the founder said.

<!-- PROTOTYPE. Throwaway. Constructed accrual — see ../../README.md -->

> **This is an extrapolation.** It is a new entity `wasDerivedFrom` the entries
> named below and `wasAttributedTo` the agent named below (PROV-O). It is **not**
> attributed to Jian-Yang, who has never been asked this question.
>
> **It has no index line and never will** (ADR 0010). It is retrievable only if
> someone already knows it exists and asks for it by name.

| | |
|---|---|
| Entry date | 2027-02-03 |
| `wasAttributedTo` | `claude-opus-5`, session working the funding plan |
| `wasDerivedFrom` | [P101](../positions/p101-obligation-outliving-runway.md) |
| Index line | **none, by rule** |

## Question that prompted it

*Would he take a non-dilutive grant — no equity, no repayment, but three years of
reporting obligations?*

## Why the record does not answer it

P101's scope is explicit: **equity and debt from outside parties.** A grant is
neither. The lookup returned P101 on lexical match ("money", "outside party") and
the scope cap stopped it being used. Working as designed — this is the
provenance-and-scope audit passing at read time.

## The extrapolation

P101's stated reasoning is not about the *instrument* but about **obligation
duration against runway**. Three years of reporting against eighteen months of
runway is the same shape. On that reasoning he would decline.

## Why this is not a position

The reasoning is his; the application is the agent's. He has never been offered a
grant, and the one episode P101 rests on is an equity offer declined for a reason
he stated in equity terms. Tetlock's finding bites precisely here: an absolute
stated about one instrument is an *expressed* preference, and re-framing it onto
another instrument is exactly the rhetorical move he predicts people accept when
the cost of holding the line rises.

---

## What happened next — the finding

**Nothing retrieved this entry again.**

On 2027-02-14 a second session hit the same grant question. It loaded the index,
matched P101, read P101, hit the scope cap, and stopped. D001 sat one directory
away and was never seen, because the only thing that routes anything is the index
and D001 is barred from it.

The second session re-derived the same conclusion from scratch, in-context, and
wrote nothing down.

So the device's two halves came apart. **The bar works**: no derived entry was
ever mistaken for a position, and the scope cap did the stopping both times.
**The entry does nothing**: it is a correct, well-provenanced artifact that is
unreachable by the only retrieval mechanism the design has, and its absence
changed no outcome — the extrapolation happened anyway, just uncaptured.

A derived entry is therefore not a *retrieval* device. If it is worth keeping it
is worth keeping as an **audit trail** — a record that an extrapolation was made,
by whom, from what — which is a different job, wants a different home, and is
[#108](https://github.com/98kb/skills/issues/108)'s to settle.
