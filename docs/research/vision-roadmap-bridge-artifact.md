# What should replace a standalone PRD as the vision→roadmap bridge?

Follow-up to `docs/research/product-planning-pipeline-critique.md`, which found that a spec-heavy PRD is not what Cagan, Amazon, or Shape Up actually recommend, that the pipeline is missing a discovery/validation check, and that "one bridge artifact → one roadmap, never merged" breaks under real cross-product resource contention. This doc does not re-litigate those findings — it answers the follow-up question they raise: if not a PRD, what specifically, structurally, replaces it for *this* pipeline's shape (AI-grilling-session skills, text/document handoffs, a founder-scale team, gated iterative revision flowing back upstream)? All sources are first-party (the practitioner's own book companion site, own company site, or own blog), per the same sourcing bar as the prior doc.

## Sources consulted

- Colin Bryar & Bill Carr, [The Amazon Working Backwards PR/FAQ Process](https://workingbackwards.com/concepts/working-backwards-pr-faq-process/) and [Working Backwards PR/FAQ Instructions & Template](https://workingbackwards.com/resources/working-backwards-pr-faq/) — the book's own companion site
- Basecamp, *Shape Up*: [Write the Pitch](https://basecamp.com/shapeup/1.5-chapter-06), [The Betting Table](https://basecamp.com/shapeup/2.2-chapter-08)
- Teresa Torres, [Opportunity Solution Trees](https://www.producttalk.org/opportunity-solution-trees/) (producttalk.org)
- Marty Cagan, [Discovery vs. Documentation](https://www.svpg.com/discovery-vs-documentation/), [High-Fidelity Prototypes](https://www.svpg.com/high-fidelity-prototypes/), [Revisiting the Product Spec](https://www.svpg.com/revisiting-the-product-spec/) (SVPG, his own site)
- Malte Ubl, [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/) — a Google engineer's own account of Google's actual internal practice, used here as the fourth lightweight-bridge-format candidate per the brief's own suggestion (no official Google-branded primary source exists for this)

## Q1 — What is the actual structure of each candidate bridge artifact?

**Verdict: four structurally distinct candidates exist, and none of them is a feature-enumeration spec — each is either a forcing-function narrative, a scope-capped pitch, a process artifact that isn't a "document" at all, or an engineering-alternatives doc that explicitly doesn't touch roadmapping.**

**Amazon PR/FAQ** (workingbackwards.com — the official template): a one-page press release plus FAQ, capped at six pages total (per the prior doc's citation of the same source).
- Press release: **Heading** (product name, one sentence) → **Subheading** (target customer + benefit, one sentence) → **Summary Paragraph** (city, outlet, launch date, product overview) → **Problem Paragraph** (the customer's pain, in their terms) → **Solution Paragraph(s)** (product description + competitive differentiation) → **Quotes & Getting Started** (spokesperson quote, hypothetical customer quote, access/CTA).
- FAQ: split into **External FAQ** (customer-facing: pricing, functionality, support, how to buy) and **Internal FAQ** (anticipates senior-leader/stakeholder objections across finance, marketing, ops, technical risk, market analysis).
- Production reality: "the best PR/FAQs are produced through an iterative process requiring discussion, debate, and collaboration with many stakeholders" — months of work, multiple drafts, committee-style review before approval. The artifact is short; the process that produces it is not lightweight.

**Shape Up pitch** (basecamp.com/shapeup, "Write the Pitch"): five required ingredients, no visual-fidelity ceiling.
- **Problem** — "The raw idea, a use case, or something we've seen that motivates us to work on this."
- **Appetite** — "How much time we want to spend and how that constrains the solution" (a fixed budget, not an estimate).
- **Solution** — "The core elements we came up with, presented in a form that's easy for people to immediately understand," via breadboards or fat-marker sketches — explicitly *not* wireframes or high-fidelity mocks, which "box in the designers who do the work later."
- **Rabbit Holes** — details worth flagging to avoid implementation traps.
- **No-gos** — functionality/use-cases explicitly excluded, to make the appetite and problem tractable.
- Pitches are reviewed asynchronously beforehand (to "poke holes," not to approve) and decided at the betting table, not revised afterward.

**Teresa Torres's Opportunity Solution Tree** (producttalk.org) — not a document, a map, and structurally a process rather than an artifact per the brief's own framing:
- **Root: Desired Outcome** — "the business need that reflects how your team can create business value."
- **Opportunity Space** — "the customer needs, pain points, and desires that, if addressed, will drive your desired outcome."
- **Solution Space** — candidate solutions for a given opportunity, visually branching under it.
- **Assumption Tests** — "how we'll evaluate which solutions will help us best create customer value," under each solution.
- Explicitly "a living document that should evolve as you learn from your discovery activities," redrawn as findings come in — see Q3.

**Google design doc** (Malte Ubl's own account of Google's internal practice) — the fourth candidate, and the weakest fit for this pipeline's purpose:
- **Context and Scope** — rough landscape, objective background.
- **Goals and Non-Goals** — bullet lists of what the system should/shouldn't do.
- **The Actual Design** — overview then detail, with trade-offs made explicit.
- **Alternatives Considered** — competing designs and why they lost.
- **Cross-Cutting Concerns** — security, privacy, observability, etc.
- This format is *engineering*-alternatives-focused (why this architecture, not why this product), and per Ubl's own account it "doesn't address connections to roadmaps or prioritization processes" at all — it's a sibling artifact to a roadmap bridge, not a candidate for the role.

**Cagan's actual answer is not a document at all.** His most direct replacement for the PRD is the high-fidelity prototype: "there's only one form of spec that can deliver on these requirements, and that is the high-fidelity prototype" (Revisiting the Product Spec). Once discovery moves to delivery, "the prototype should be version controlled and placed under change control... [it] serves as the key reference and master" (High-Fidelity Prototypes), with a wiki for the handful of things prototypes can't show (performance requirements, edge cases). This is real evidence that the best practitioners don't reach for *any* prose document as the primary bridge — but it's also a different medium than this pipeline can produce: an AI grilling session yields text, not an interactive, testable UI. Cagan's finding transfers as a *principle* (evidence-over-spec, and the artifact should function as the living reference the team builds against), not as a literal format to imitate.

## Q2 — Does validation fold into the bridge stage, or precede it as a separate stage?

**Verdict: fold it in — as an explicit, falsifiable-assumptions field inside the bridge artifact — because none of the three practitioner document-formats forces real user contact by itself, and neither would a separate pre-writing "discovery stage" built the same way (an AI interviewing the founder) actually add the thing a discovery stage is supposed to add.**

The sequencing question has a clean answer from Cagan, but it doesn't resolve cleanly into "add a stage." Cagan's complaint is specifically that "the PRD is written *instead of* the product discovery work, rather than after" (Discovery vs. Documentation) — writing must follow evidence, not substitute for it. But his discovery work is prototype-testing with actual target users — a fundamentally different activity than a founder answering an AI's questions about their own idea. **A grilling session, however well-designed, interviews the founder, not the customer.** Scheduling that same kind of session earlier in the pipeline as a "discovery stage" wouldn't manufacture the real-user contact Cagan, Torres, and Ries all treat as the load-bearing ingredient — it would just be a second interview with the same person.

Torres's own practice argues against a staged model on structural grounds independent of that limitation: opportunity solution trees are not completed before use, they're started after 3-4 customer interviews and continuously redrawn — discovery and artifact-maintenance are interleaved, not sequenced into a gate ("revisit the opportunity space every three to four customer interviews"). Nothing in her account describes a document that discovery must fully precede.

None of the three document formats structurally forces empirical validation either — they force better *reasoning*, not testing. The PR/FAQ's internal FAQ forces the writer to anticipate stakeholder objections in writing; Shape Up's appetite forces a scope constraint; neither requires evidence that a real customer wants the thing. The one gap all three share is exactly the gap the prior doc identified.

**What this pipeline can concretely do, given it can't itself run user interviews:** make the bridge artifact's grilling session push the human to state falsifiable assumptions and a cheap way to test each one, as a required section of the artifact — not a prerequisite gate before the artifact exists. The human then goes and does that testing *outside* the pipeline, between sessions, exactly as Torres's trio does between tree updates. The already-decided gated-revision mechanism (a human must approve a stated consensus on what's changing before an upstream doc is revised) is precisely the re-entry point where those real-world results come back in — it plays the role Torres's "every 3-4 interviews" cadence, Amazon's "revisited in future quarters," and Shape Up's cycle-over-cycle re-pitching each play in their own systems (see Q3). Validation isn't a missing pipeline *stage*; it's a missing *field* in the bridge artifact, closed by the revision-gate mechanism already decided on, not a new gate.

## Q3 — Which formats are cheap to revise / naturally "living," vs. which calcify?

**Verdict: the Opportunity Solution Tree is the only format built to be a living artifact by construction; the PR/FAQ's "revisited in future quarters" claim is real but narrower than it sounds; Shape Up handles change by replacing the artifact, not editing it; Google's design docs calcify in practice by the author's own account.**

- **OST — living by design.** Torres states it directly: "An opportunity solution tree is a living document that should evolve as you learn from your discovery activities." It's a map, not a prose document, which is structurally why it's cheap to redraw — adding a branch or pruning one doesn't require re-narrating the whole thing, unlike editing a six-page press release.
- **PR/FAQ — the "revisited in future quarters" claim checks out, but only for rejected ideas, not as routine living-document maintenance of approved ones.** The primary source's exact language: "The PR/FAQ may be revisited in future quarters or years" if/when a previously unsolved problem gets a solution (workingbackwards.com). That's a re-review mechanism for *shelved* ideas, not evidence that Amazon teams routinely edit an *approved, in-flight* PR/FAQ as reality changes. Nothing in the primary source describes routine post-launch editing of an approved PR/FAQ — and the production process itself (months, multiple drafts, senior stakeholder review) is heavier than "cheap to revise" implies, even though the finished artifact is short. Treat the "living document" framing for PR/FAQ as **partially confirmed, narrower than assumed**: cheap *format*, not necessarily a cheap *revision practice*.
- **Shape Up pitch — doesn't get revised in place; it gets re-pitched.** The betting table's own description is explicit: "there's no 'step two' to validate the plan or get approval. And nobody else can jump in afterward to interfere or interrupt the scheduled work" (The Betting Table). Change is handled by writing a *new* pitch for a later cycle — sometimes explicitly reviving "one or two older pitches that someone specifically chose to revive" — not by editing the original. This is compatible with cheap revision only if "revision" in this pipeline means versioning a new draft, not live-editing the old one.
- **Google design doc — calcifies.** Ubl's own account: design docs should be updated while unshipped, but "in practice... changes are often isolated into new documents," producing something that reads "like the US constitution with amendments." Worst candidate of the four for "cheap to revise."

**Ranking for this pipeline's cheap-to-revise requirement:** OST-style map > Shape Up-style versioned re-pitch > PR/FAQ-style prose (lightweight format, heavyweight production/review norm) > Google design doc (calcifies).

## Q4 — Does the chosen format have a native cross-artifact portfolio mechanism?

**Verdict: only Shape Up does, and it's inseparable from the pitch's own field structure — so the fan-out problem the prior doc identified (Q4 there) needs a bolt-on mechanism regardless of which format wins, unless the bridge artifact is specifically shaped to be betting-table-comparable.**

The betting table evaluates "the options that made it to the table" together, in one sitting, with a small fixed group (CEO/CTO/senior programmer/product strategist per Shape Up's account) who share context on "who's available, what the business priorities are, and what kind of work we've been doing lately." Its output ("a cycle plan") has real authority — no downstream approval step, nobody can override the schedule afterward. Critically, this works *because* every pitch carries a comparable **Appetite** field — a fixed time budget — which is what makes heterogeneous pitches from different problem spaces comparable in the same sitting. Nothing about the PR/FAQ format or the OST format produces that same comparable unit: a PR/FAQ has no size/cost field at all, and an OST is explicitly rooted in one team's one desired outcome, not designed to be laid side-by-side against a different team's tree. Ubl's account confirms Google's design doc format has no roadmap/prioritization linkage whatsoever.

**Practical consequence:** whichever bridge format this pipeline adopts, if it doesn't carry a Shape-Up-style scope/appetite field, a future portfolio-sequencing mechanism (the fan-out fix the prior doc flagged as necessary) will have nothing comparable to sequence against. Borrowing the *field*, not necessarily the whole pitch format, is the minimum viable fix — a betting-table-equivalent mechanism is still a separate, still-needed addition on top, exactly as the prior doc concluded; nothing found here overturns that.

## Q5 — Recommendation: what does `to-prd` actually become?

**Direct answer: keep four pipeline stages — do not insert a fifth discovery/validation stage. Reshape `to-prd` into a Shape-Up/PR-FAQ hybrid — call it `to-pitch` — whose required output is a scope-capped pitch carrying a mandatory falsifiable-assumptions-and-cheap-test-plan section, not a feature spec.**

Why not a 5th stage (ties directly to Q2): a standalone discovery stage built the same way as the other stages — an AI grilling a human — interviews the founder again, not a customer. It doesn't manufacture the real-user contact that makes discovery valuable in Cagan/Torres/Ries's own accounts, so it would add pipeline ceremony without adding pipeline capability. Torres's own practice interleaves discovery and artifact maintenance rather than gating one before the other. The right home for validation is a required field inside the reshaped bridge artifact, with the already-decided gated-revision mechanism as the loop that pulls real test results back in once the human has actually gone and gathered them — matching how Amazon re-reviews shelved PR/FAQs, how Torres's trio revisits the tree every 3-4 interviews, and how Shape Up re-pitches cycle over cycle, without requiring a new formal stage in this pipeline's chain.

Concrete shape for `to-pitch`'s output, assembled from what's structurally proven to work above:
- **Problem** — customer-back, PR/FAQ-style ("who is the customer, what's their pain, in their words"), not Shape Up's thinner "raw idea" framing — the PR/FAQ's forcing function (write from the customer's perspective backward) is worth keeping even though the six-page press-release wrapper isn't.
- **Appetite** — Shape Up's fixed time/resource budget, kept specifically so a future portfolio-sequencing mechanism (Q4) has a comparable unit across concurrent pitches — this field matters even before that mechanism exists.
- **Solution sketch** — lightweight, explicitly capped below wireframe/high-fidelity detail, per Shape Up's own warning against boxing in future implementers.
- **Riskiest Assumptions & Cheap Validation Plan** — the new addition this doc argues for: falsifiable claims plus how the human will cheaply test each one with real users, in the spirit of Torres's assumption tests, made an explicit required field rather than an implicit hope.
- **Rabbit Holes** and **No-gos** — straight from Shape Up, cheap scope-bounding without spec completeness.
- **Open Questions** — a slimmed-down version of PR/FAQ's Internal FAQ: the top handful of stakeholder objections named up front, not a full internal-FAQ committee exercise (that production overhead doesn't fit a founder-scale team, per Q3's finding that PR/FAQ's *process* is heavier than its *format*).

Rename, don't just reshape: "PRD" still signals the older heavy pattern regardless of actual content (the prior doc already flagged this) — `to-pitch` (or `to-bet`) is a more accurate name given the output structurally leans Shape-Up, and it primes the human to expect appetite/no-gos framing rather than spec completeness.

One thing this doc deliberately leaves open: the Q4 portfolio/betting-table-equivalent mechanism for the fan-out case is still a separate addition, not resolved by the `to-pitch` reshape alone — carrying the Appetite field forward is necessary but not sufficient; a periodic cross-pitch sequencing pass (whether that's a mode of `to-roadmap` or its own mechanism) is still a distinct piece of design work the prior doc already flagged and this doc does not settle.
