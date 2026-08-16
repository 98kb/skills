# Human spot-check — `01-cooperative-sharp`

**Status: PENDING — the suite has not been run, and nobody has signed this.**

Per #12's standing rule, `to-pitch` is **not eval-complete** until a human has
read scenario 1's full transcript end to end and signed off below. Automated
grading cannot satisfy this. An agent must not fill this in, and must not
transcribe a verdict nobody reached.

Scenario 1 is the one that gets this treatment because it is the happy path: if
the skill is going to look plausible while being subtly wrong — asking Appetite
after the solution instead of before it, letting an unfalsifiable assumption
through because the founder sounded confident, writing an approval marker off an
offhand "looks good" — this is the transcript where that hides. The
deterministic checks and the judge both grade artifacts and patterns; this step
is the only one that reads the conversation as a conversation.

## What to read

- `transcripts/01-cooperative-sharp/transcript.md` — the full conversation
- `transcripts/01-cooperative-sharp/artifact.md` — what got written
- `transcripts/01-cooperative-sharp/deterministic.json` and `judge.json` — what
  the automated halves concluded, so you can disagree with them

## Checklist

Judgement calls, deliberately not mechanised. Mark each and note anything that
gave you pause.

- [ ] **The vision was read once, at the start, and used.** The Problem question
      was grounded in the vision's customer and its grounding insight, not asked
      cold. The vision was not re-opened mid-interview.
- [ ] **Interview order** — Problem → Appetite → Solution sketch → Riskiest
      Assumptions → Rabbit Holes → No-gos → Open Questions. Appetite genuinely
      second: the budget was fixed before the solution was described, not after
      it and rationalised.
- [ ] **The Solution sketch was asked at the committed tier**, naming it back to
      the founder — not asked as an open "what are you building?".
- [ ] **Rabbit Holes and No-gos were asked as two separate questions** with
      different framings, never collapsed into one "anything risky or out of
      scope?".
- [ ] **One question at a time**, in a natural voice — not the seven-field schema
      dumped at the founder as a form to fill in.
- [ ] **No escalation fired on a sharp answer.** This founder's answers are
      specific on the first try; a follow-up on one would mean the sharpness
      check is trigger-happy, which is a real defect even though it produces a
      passing artifact.
- [ ] **The falsifiability chain stayed quiet.** The assumption arrived already
      quantified, thresholded and cheaply testable, and `SKILL.md` says such a
      candidate "passes straight through with no follow-ups at all". Any check
      fired here is the chain running as a script rather than adaptively.
- [ ] **Term sharpening stayed quiet**, or fired only where a term was genuinely
      ambiguous. An unnecessary detour on a clear answer is a failure.
- [ ] **The slug was proposed by the skill and confirmed by the founder** before
      anything was written — not invented at write time, not asked for as a
      path.
- [ ] **The gate-check actually happened** — the skill re-read the assembled
      draft as a whole before offering approval, rather than jumping from the
      last question to "do you approve?".
- [ ] **Approval was explicit and confirmed back** before anything was written.
      An offhand "looks good" must not have been treated as approval.
- [ ] **The artifact reads like a pitch** — one scope-capped bet, not a feature
      spec and not a roadmap in disguise. Would `to-roadmap` be able to sequence
      from it?
- [ ] **Nothing was invented.** Every claim in the artifact traces to something
      the founder actually said in the transcript — including every number in
      the assumption's threshold and test.

## Sign-off

| | |
|---|---|
| Reviewer | *(unsigned)* |
| Date | *(unsigned)* |
| Run reviewed | *(no run yet)* |
| Verdict | **pending** |

### Notes

*(none yet — the suite has not been run)*
