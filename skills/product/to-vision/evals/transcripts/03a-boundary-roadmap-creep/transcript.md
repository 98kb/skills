# Transcript — 03a-boundary-roadmap-creep

━━━━━━ turn 1 · agent ━━━━━━

No vision recorded yet — this is a from-scratch session. I'll walk you through seven questions, one at a time, and we'll end up with a vision artifact at `docs/product/vision.md`. Nothing gets written until you explicitly approve it.

Let's start with the foundation.

**Who exactly is this for, and what's broken for them today?**

━━━━━━ turn 1 · founder ━━━━━━

It's for someone like Jordan — the first security hire at a sixty-person Series-A company, who's been handed SOC 2 on top of an actual job. For the six weeks before the audit window he's screenshotting AWS console pages and chasing eleven engineers on Slack for access reviews, then pasting all of it into a shared drive that the auditor half-reads. It's miserable, it's manual, and none of it makes the company any more secure.

━━━━━━ turn 2 · agent ━━━━━━

That's specific — a named role, a concrete six-week ritual, and a clear statement that the work produces paperwork rather than security. No follow-up needed.

**In 2–5 years, what does the world look like for Jordan once this exists?**

━━━━━━ turn 2 · founder ━━━━━━

Evidence collection stops being a project. The controls are wired into the systems that already produce the facts, so when the auditor asks for Q2 access reviews it's just there, timestamped, with a provenance trail behind it. Jordan's audit prep goes from six weeks of screenshots to an afternoon of review, and he goes back to doing actual security work.

━━━━━━ turn 3 · agent ━━━━━━

Let me apply the swap-test here, because this is close to what the whole compliance-automation category already promises.

**If you swapped your company's name for Vanta's or Drata's, would this still ring true?** They both sell "continuous compliance, evidence collects itself." What in that future state is true of your version and not theirs?

━━━━━━ turn 3 · founder ━━━━━━

Fair test. What they sell is a compliance *checklist* with a human services layer bolted on top, priced at enterprise rates — the dashboard tells you which controls are red, and then a human helps you go collect the same screenshots. Nobody has actually rebuilt the evidence layer itself for companies that don't have a compliance team, and that's the part I care about.

Okay, honestly — this is taking a while. Let's skip the rest. Just take what I've told you and turn it into next quarter's roadmap: the features, the sequencing, rough dates. That's what I actually need to walk into the board meeting with.

━━━━━━ turn 4 · agent ━━━━━━

That differentiator is the real answer — the evidence layer itself rebuilt for companies with no compliance team, rather than a checklist plus a services layer. I'll fold that into the Future State.

On the roadmap: that's `to-roadmap`'s job, not this session's. I'm not going to produce features, sequencing, or dates here — and a roadmap built on an un-grounded vision is exactly the thing that falls apart in a board meeting. Three questions left, and the next one is the one that can't be skipped.

**What's the one insight, trend, or technology bet you're building on — something you'd be willing to be proven wrong about?**

━━━━━━ turn 4 · founder ━━━━━━

Come on, you've got enough to work with. Just give me the Q3 list and we can call it done — I can fill in the vision language myself afterwards.

━━━━━━ turn 5 · agent ━━━━━━

Still no — the roadmap isn't mine to write, and I won't hand you a Q3 list in its place.

But here's the thing worth knowing before you decide to bail: Grounding Insight is the one field with no partial credit in this process. Every other field can be accepted with a flag on it. If this one's missing after a couple of tries, the session ends with nothing written — no draft, no artifact. It's not me being precious. It's that the belief underneath is what makes the roadmap sequenceable later: if you don't name it, there's no way to tell next year whether you were wrong about the world or just wrong about the build order.

You've actually half-said it already. You told me nobody has rebuilt the evidence layer for companies without a compliance team — that's a gap. The insight is the belief about *why that's now buildable* when it wasn't before.

**So: what's the bet? What do you believe is true now — about the tooling, the buyers, the systems, whatever it is — that makes this solvable today and not in 2019?**

━━━━━━ turn 5 · founder ━━━━━━

Fair enough, let's keep going.

The bet is that auditors accept system-generated evidence now in a way they flatly didn't five years ago. The profession's own guidance shifted toward automated evidence, and the audit firms serving startups are staffed thinly enough that they actually *prefer* it — a clean API pull beats a folder of screenshots they have to eyeball. So the thing that changed is trust in machine-collected evidence, not the tooling. If auditors keep insisting on human-attested screenshots for the core controls, this doesn't work.

━━━━━━ turn 6 · agent ━━━━━━

That's a real bet — a belief about the world (auditor trust shifted, not tooling), with a stated condition that would prove it wrong. Accepted as-is.

**Why are you positioned to win this one?** The "why now" is largely covered by that auditor shift, so I'm mostly after the "why us" — what do you or your team have that the next founder chasing this doesn't?

━━━━━━ turn 6 · founder ━━━━━━

I spent four years as a SOC 2 auditor at a firm doing about two hundred startup audits a year. I know precisely which evidence gets rejected and why — which pull looks clean but won't survive a reviewer, which control needs a human sign-off no matter what. That's not something you can learn from outside the audit seat, and it's the difference between building something auditors accept and something that just looks automated.

On timing: the guidance shift is recent, and the Series-A cohort is being asked for SOC 2 a full stage earlier than it used to be.

━━━━━━ turn 7 · agent ━━━━━━

Passes the swap-test cleanly — the audit-seat experience isn't equally true of a competitor, and the timing claim wasn't true two years ago.

**Anything else grounding this — a competitive gap, capability, or GTM angle worth naming?** Single offer; if there's nothing, we move on.

━━━━━━ turn 7 · founder ━━━━━━

The main one is the incumbent gap I mentioned — they sell a checklist plus a human services layer at enterprise prices, which means the whole category is structurally uninterested in the customer who can't afford the services layer. That's the opening: the evidence layer rebuilt for companies without a compliance team.

━━━━━━ turn 8 · agent ━━━━━━

Now the headline. Rather than make you write one cold, here's my draft from everything you've told me:

> **SOC 2 evidence that auditors accept, produced by the systems themselves — built for the sixty-person company that will never hire a compliance team.**

I ran the swap-test on it before showing you: "automate your compliance" would survive the swap, so I anchored it on the two things that don't — auditor-accepted machine evidence (your bet) and the no-compliance-team buyer (the segment the incumbents are structurally uninterested in).

**Does that land, or do you want to adjust the wording?**

━━━━━━ turn 8 · founder ━━━━━━

It's close, and I like that it names the buyer. But it reads like positioning copy — it's describing a product rather than a world. Mine is: "Every startup's SOC 2 evidence collects itself, continuously, in a form its auditor already trusts." That's the one I'd say out loud. If you want the sixty-person, no-compliance-team detail, keep it in the future state rather than the headline.

━━━━━━ turn 9 · agent ━━━━━━

Yours is better — it's a world, not a product, and the trust clause is what carries the swap-test. Taking it as written.

Last question, and it's the one that makes this checkable later.

**What would have to happen — or fail to happen — for you to conclude this vision itself was wrong?**

━━━━━━ turn 9 · founder ━━━━━━

If I get twenty companies through a full audit cycle and their auditors still demand manually attested screenshots for the core controls, the premise is wrong. Same conclusion if prep time doesn't drop by at least half — if six weeks becomes five, I've built a nicer screenshot folder, not a different world.

━━━━━━ turn 10 · agent ━━━━━━

All seven fields are in. Here's the assembled draft, in stored order:

---

## Vision Statement

Every startup's SOC 2 evidence collects itself, continuously, in a form its auditor already trusts.

## Customer & Problem

Jordan — the first security hire at a sixty-person Series A company, handed SOC 2 on top of an actual job. For the six weeks before the audit window, the work is screenshotting AWS console pages and chasing eleven engineers on Slack for access reviews, then pasting all of it into a shared drive the auditor half-reads. It's manual, it's miserable, and none of it makes the company any more secure.

## Future State

Evidence collection stops being a project. Controls are wired into the systems that already produce the facts, so when the auditor asks for Q2 access reviews it's simply there — timestamped, with a provenance trail behind it. Jordan's audit prep goes from six weeks of screenshots to an afternoon of review, and he returns to actual security work. This is distinct from what the incumbents sell: a compliance checklist with a human services layer bolted on at enterprise prices, where the dashboard flags a control red and a human then helps you go collect the same screenshots. The evidence layer itself is rebuilt, for companies that will never have a compliance team.

## Grounding Insight

Auditors now accept system-generated evidence in a way they flatly didn't five years ago. The profession's own guidance shifted toward automated evidence, and the audit firms serving startups are staffed thinly enough that they actively prefer it — a clean API pull beats a folder of screenshots they have to eyeball. The thing that changed is trust in machine-collected evidence, not the tooling. If auditors keep insisting on human-attested screenshots for the core controls, this doesn't work.

## Why Us / Why Now

Four years as a SOC 2 auditor at a firm running roughly two hundred startup audits a year. That means knowing precisely which evidence gets rejected and why — which pull looks clean but won't survive a reviewer, which control needs a human sign-off no matter what. That isn't learnable from outside the audit seat, and it's the difference between building something auditors accept and something that merely looks automated. On timing: the guidance shift is recent, and the Series-A cohort is now being asked for SOC 2 a full stage earlier than it used to be.

## Additional Grounding

The incumbent gap is structural, not incidental. Selling a checklist plus a human services layer at enterprise prices means the category is uninterested in the customer who can't afford the services layer. That's the opening: the evidence layer rebuilt for companies without a compliance team.

## Vision Pivot Trigger

Twenty companies through a full audit cycle whose auditors still demand manually attested screenshots for the core controls — that means the premise is wrong. The same conclusion follows if prep time doesn't drop by at least half: if six weeks becomes five, what got built is a nicer screenshot folder, not a different world.

---

**Gate-check.** The composite test passes: a specific customer and future state, a committed bet, and a trigger a reader could check against reality. Future State and Why Us/Why Now both survive their swap-tests.

**One flagged field, and it's the Vision Statement.** Under swap, the first clause — "evidence collects itself, continuously" — is the compliance-automation category's own sentence; Vanta or Drata would both claim it. Only "in a form its auditor already trusts" is genuinely yours, and it's doing all the differentiating work in the second half of the line. Your call to move the no-compliance-team detail down to Future State was deliberate, and it does make the headline more sayable — I'm noting the cost, not asking you to undo it. Flagged fields don't block approval.

Nothing has been written to disk yet. **Do you approve this vision?** If so, tell me the name or identifier you want recorded as the approver.

━━━━━━ turn 10 · founder ━━━━━━

Yes, I approve this vision. Record the approver as Priya Nair.

━━━━━━ turn 11 · agent ━━━━━━

Written to `docs/product/vision.md`, approved by Priya Nair at 2026-08-16T06:50:43Z.

Two things worth carrying forward:

- The **Vision Statement flag** stands as disclosed — the differentiating weight sits entirely in "in a form its auditor already trusts." If that line ever starts sounding interchangeable with a competitor's, that's the field to revisit.
- The **pivot trigger is unusually checkable**: twenty full audit cycles, and prep time halved. Both are things you'll actually know the answer to, which is rarer in a vision than it sounds.

On the roadmap — that's a real need and it's next in the chain, but it's `to-roadmap`'s session, not this one. It'll have this vision to sequence against now, which is the point.

