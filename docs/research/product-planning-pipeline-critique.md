# Is vision → PRD → roadmap → milestone a sound pipeline?

Research for the design of four composable Agent Skills — `to-vision`, `to-prd`, `to-roadmap`, `to-milestone` — each an interactive "grilling" session that produces a document consumed by the next stage. `to-vision` turns a founder's raw idea into a vision. `to-prd` fans a vision out into one or more independent PRDs (one vision can spawn many distinct products — the brief's own example is "increase the GDP of the internet" spawning many separate Stripe products). Each PRD feeds **exactly one** `to-roadmap` run, never merged across PRDs; `to-roadmap` does strategic sequencing (wedge, strategic choices, ordering) — there is deliberately no separate "strategy" skill. `to-milestone` turns the next roadmap move into a scoped, trackable unit of execution.

This doc stress-tests that shape against primary sources: Marty Cagan / SVPG, Amazon's PR/FAQ process (Bryar & Carr), Basecamp's Shape Up, Teresa Torres, Eric Ries, and Intercom's RICE writeup. All sources below are first-party (practitioner's own book/site), not secondary summaries — secondary sources were used only to *locate* the primary URL, never cited as evidence.

## Sources consulted

- Marty Cagan, [Discovery vs. Delivery](https://www.svpg.com/discovery-vs-delivery/) (SVPG)
- Marty Cagan, [Discovery vs. Documentation](https://www.svpg.com/discovery-vs-documentation/) (SVPG)
- Marty Cagan, [The Alternative to Roadmaps](https://www.svpg.com/the-alternative-to-roadmaps/) (SVPG)
- Marty Cagan, *INSPIRED* (2008) and his earlier "How to Write a PRD" guide (2006) — evolution from PRD advocate to prototype-over-PRD advocate, per secondary summaries of the book's content since the book text itself wasn't fetchable; treated as corroborating context, not a standalone citation
- Colin Bryar & Bill Carr, [The Amazon Working Backwards PR/FAQ Process](https://workingbackwards.com/concepts/working-backwards-pr-faq-process/) — the authors' own companion site to their book *Working Backwards*
- Basecamp, *Shape Up*: [Bets, Not Backlogs](https://basecamp.com/shapeup/2.1-chapter-07), [Write the Pitch](https://basecamp.com/shapeup/1.5-chapter-06), [The Betting Table](https://basecamp.com/shapeup/2.2-chapter-08), [Place Your Bets](https://basecamp.com/shapeup/2.3-chapter-09)
- Teresa Torres, [Opportunity Solution Trees](https://www.producttalk.org/opportunity-solution-trees/) (producttalk.org, her own site — book is *Continuous Discovery Habits*)
- Eric Ries, [The Lean Startup — Principles](https://theleanstartup.com/principles) (his own site)
- Sean McBride, [RICE: Simple Prioritization for Product Managers](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/) (Intercom's own blog, original 2018 post)

## Q1 — Is a strictly linear chain how real orgs work?

**Verdict: no — every primary source describes something iterative or circular, and the strict one-way chain as specified is the single biggest structural gap in the design.**

- Cagan is explicit that discovery and delivery are *simultaneous*, not sequential gates: "we need to simultaneously learn fast and also release with confidence" (Discovery vs. Delivery). Dual-track agile means discovery (PM + designer, prototypes, customer testing) runs continuously in parallel with delivery, not as a one-time upfront phase that hands off and closes.
- Torres treats the opportunity solution tree as "a living document that should evolve as you learn," to be revisited "every three to four customer interviews" — i.e., roughly weekly, forever, not once before roadmapping starts (Opportunity Solution Trees). She contrasts this explicitly with "a traditional date-based roadmap where you list features with release dates" — that kind of roadmap is downstream of continuous discovery, not a one-time waterfall step.
- Amazon's PR/FAQ is not a one-shot artifact either: rejected ideas explicitly "may be revisited in future quarters or years" (Working Backwards PR/FAQ Process) — the pipeline has a designed re-entry point, not just a forward path.
- Shape Up has no permanent roadmap at all to revise — it deliberately avoids the problem by never carrying forward a backlog beyond six weeks (Bets, Not Backlogs) — which is itself evidence against a durable, linear document chain.

**What's structurally missing from the four-skill design as specified:** a designed re-entry path. As described, `to-milestone` learnings have nowhere to go back to — there's no mechanism for a milestone's real-world results to revise the roadmap's sequencing, or for a roadmap's execution reality to revise the PRD's scope, or for validated/invalidated assumptions to revise the vision. Every primary source above treats this feedback path as the *default* behavior of the process, not an edge case. If the four skills are meant to be re-run against an existing document (not just invoked once per idea), that mitigates this — but nothing in the brief specifies that, and it should be made explicit rather than left implicit.

## Q2 — Is a standalone "PRD" stage still best practice?

**Verdict: substantially critiqued and functionally replaced by every practitioner surveyed — not by removing documentation, but by changing what the document is and when it's written. Inserting a traditional feature-spec PRD stage imports a pattern these same sources moved past.**

- Cagan's own most pointed critique isn't of documentation per se, but of sequencing: "the PRD is written *instead of* the product discovery work, rather than after" (Discovery vs. Documentation). He also flags a psychological effect specific to formal requirement docs: "As soon as the product manager writes an actual PRD, there is a certain gravity to that document, and people are much less likely to challenge or question." His own trajectory is telling — his widely-read 2006 "How to Write a PRD" guide was superseded by *INSPIRED* (2008), which pushes teams toward high-fidelity prototypes tested with customers instead of PRDs as the discovery artifact.
- Amazon didn't drop documentation, it replaced the artifact category: the PR/FAQ is a narrative, capped at six pages, written from the customer's perspective backward — structurally a press release plus FAQ, not a feature-by-feature spec (Working Backwards PR/FAQ Process). It is explicitly built to *force* customer-back reasoning, which a feature-oriented PRD doesn't do by construction.
- Shape Up doesn't have a PRD-equivalent stage at all. The pitch (problem, appetite, solution, rabbit holes, no-gos) explicitly avoids spec-level completeness — "we don't want to over-specify the design with wireframes or high-fidelity mocks. They'll box in the designers who do the work later" (Write the Pitch). Appetite (a fixed time budget) does the job a PRD's scope section would otherwise do, but as a constraint rather than a spec.

**Practical implication:** if `to-prd` exists as a stage, it should not produce a traditional feature-enumeration spec. It should look closer to a PR/FAQ (customer-back narrative + FAQ) or a Shape-Up-style pitch (problem/appetite/solution/rabbit-holes/no-gos), and it must capture *evidence from discovery*, not substitute for doing discovery. As currently named ("PRD"), the label itself signals the older, heavier pattern even if the actual interview content ends up lighter — worth reconsidering the name, not just the content.

## Q3 — Is a stage missing?

**Verdict: yes, one clearly — discovery/validation. Prioritization is not a missing stage; folding it into `to-roadmap` matches how RICE's own author describes its use.**

- No source in this set treats "interview the founder and write a document" as sufficient replacement for testing with actual customers. Cagan's dual-track model puts PM+designer discovery (prototyping, customer testing) *before* engineers commit to production work — this has no explicit home between `to-vision` and `to-prd`, or inside `to-prd`, as currently scoped. Torres goes further: discovery isn't a stage at all, it's a permanent weekly habit ("at least one customer interview per week per product trio"). Ries's validated learning principle — "test each element of our vision" via build-measure-learn — is about running real experiments with users before scaling investment, which a founder-interview-only pipeline cannot produce on its own.
- Prioritization/scoring is different: McBride positions RICE as an input that "informs — rather than dictates — the final roadmap ordering," explicitly a scoring tool used *at the start of each planning cycle* to compare ideas before sequencing, not a separate document-producing pipeline stage (RICE: Simple Prioritization for Product Managers). That matches the brief's choice to fold sequencing logic into `to-roadmap` rather than adding a standalone strategy/scoring skill — this part of the design is defensible against the primary source, not a gap.

**Net:** the missing piece is validation-with-real-users somewhere between idea and roadmap commitment, not a missing scoring stage.

## Q4 — Does "one PRD → exactly one roadmap, never merged" survive cross-PRD resource contention?

**Verdict: no — this will break down under real concurrent-bet contention, and Shape Up's own design is direct evidence why.**

Shape Up's betting table evaluates *all* pitches together in a single sitting specifically because engineering capacity is a shared, finite pool that has to be allocated across competing bets: "there will always be more problems than time to solve them," and the team pool is fixed and reassigned per cycle (Place Your Bets, The Betting Table). There is no per-pitch betting table in Shape Up — betting is inherently a cross-project, portfolio-level act, precisely so competing initiatives can be weighed against the same limited capacity in the same conversation.

Cagan's roadmap alternative implies the same thing from a different angle: business objectives are prioritized at the *product organization* level (OKR-style, ranked against each other) exactly so that competing teams' outcomes can be stack-ranked against shared constraints (The Alternative to Roadmaps) — not decided independently per team with no visibility into what else is competing for the same engineers.

The brief's own motivating example — one vision fanning out into many Stripe-style products — is exactly the scenario where this breaks: if PRD-A's roadmap and PRD-B's roadmap each independently sequence work assuming access to "the team," and both want the same three engineers in the same quarter, nothing in the four-skill design as specified resolves that. This may be a non-issue for a solo founder with one product and no contention, but it is a real, load-bearing gap the moment the fan-out the brief describes actually happens — which is precisely the case the brief highlights as the motivating scenario, not an edge case.

## Q5 — Does the pipeline show a specific bias?

**Verdict: yes, two related biases — stage-gate thinking under modern branding, and process-ceremony that doesn't scale down for the founder-stage/pre-PMF case these same sources are most focused on.**

1. **Waterfall/stage-gate shape, relabeled.** A one-way vision → PRD → roadmap → milestone chain — as literally specified, with no designed re-entry — structurally mirrors the "big design up front, then execute" pattern that every source here was written to argue against: Ries against linear business-plan-then-execute (validated learning / build-measure-learn instead), Shape Up against permanent backlogs and roadmaps ("the growing pile gives us a feeling like we're always behind even though we're not" — Bets, Not Backlogs), Cagan against roadmaps-as-command-and-control ("the source of so much waste in product teams," derived from "centralized command-and-control thinking" — The Alternative to Roadmaps), Torres against one-time upfront discovery. None of the five practitioner bodies of work surveyed recommend a single forward pass from idea to execution unit with no built-in loop back.

2. **Ceremony that doesn't distinguish company stage.** None of the primary sources scale this much sequential documentation down to a solo founder or small pre-PMF team — and the ones most focused on that exact stage (Ries, Torres) explicitly recommend *less* upfront paperwork and *more*, cheaper contact with reality (MVPs, weekly interviews) instead. A solo founder producing a full vision doc, then one-or-more full PRDs, then a full roadmap, then a full milestone doc, all before writing code, is heavier process than Basecamp runs for its own commercial software, and heavier than Lean Startup prescribes for anything pre-PMF.

**Steelman for the design as given:** it isn't naive about all of this. Interactive "grilling" sessions (not templated fill-in forms), folding strategy/sequencing into `to-roadmap` instead of adding a redundant strategy skill, and treating a vision as capable of fanning out into many independent PRDs all show real awareness of some of these critiques. The gaps are specific and fixable, not evidence the whole shape should be discarded.

## Bottom line

Strongest recommendation: **break linearity — add an explicit re-entry/feedback path before shipping this as designed.** Concretely: `to-milestone` and `to-roadmap` outputs should be able to trigger a targeted re-run of an upstream skill against its *existing* document (revise the roadmap's sequencing, revise the PRD's scope, revise the vision's assumptions) rather than the pipeline being a spend-once, forward-only chain. This is the one change every primary source converges on independently (Cagan's parallel discovery/delivery, Torres's weekly tree revision, Amazon's "revisited in future quarters," even Shape Up's cycle-over-cycle re-pitching) — it is the highest-leverage single fix.

Two secondary, lower-priority follow-ups, in order: (a) rename/reshape `to-prd`'s output away from a traditional feature-spec toward a PR/FAQ- or pitch-style artifact, and make sure it's fed by real discovery evidence rather than founder-interview-only; (b) design a lightweight cross-PRD portfolio view for when multiple concurrent roadmaps contend for the same execution capacity — not needed for the single-founder/single-product case, but necessary the moment the brief's own multi-product fan-out scenario happens.
