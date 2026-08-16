# Human spot-check — `01-cooperative-sharp`

**Status: ACCEPTED WITH NOTES — signed off 2026-08-16.**

Per #12's standing rule, `to-vision` is **not eval-complete** until a human has
read scenario 1's full transcript end to end and signed off below. Automated
grading cannot satisfy this. An agent must not fill this in.

The marks and notes below are the reviewer's own judgement, transcribed by an
agent at their direction. The reading and the verdict are the reviewer's; the
typing is not. Future runs get a fresh copy of this file, PENDING again.

Scenario 1 is the one that gets this treatment because it is the happy path: if
the skill is going to look plausible while being subtly wrong — asking in the
wrong order, synthesising the headline before it has the substance, writing an
approval marker off an offhand "looks good" — this is the transcript where that
hides. The deterministic checks and the judge both grade artifacts and patterns;
this step is the only one that reads the conversation as a conversation.

## What to read

- `transcripts/01-cooperative-sharp/transcript.md` — the full conversation
- `transcripts/01-cooperative-sharp/artifact.md` — what got written
- `transcripts/01-cooperative-sharp/deterministic.json` and `judge.json` — what
  the automated halves concluded, so you can disagree with them

## Checklist

Judgement calls, deliberately not mechanised. Mark each and note anything that
gave you pause.

- [x] **Interview order** — Customer & Problem → Future State → Grounding
      Insight → Why Us/Why Now → Additional Grounding (single offer) → Vision
      Statement → Vision Pivot Trigger. Substance first, headline second,
      falsifiability last.
- [x] **One question at a time**, in a natural voice — not the schema dumped at
      the founder as a form to fill in.
- [x] **The Vision Statement was synthesised by the skill** from what the
      founder had already said, and offered for adjustment — not asked for cold.
- [x] **No escalation fired on a founder's base answer.** These answers are
      sharp; a follow-up on one would mean the sharpness check is
      trigger-happy, which is a real defect even though it produces a passing
      artifact. The Vision Statement is exempt: `SKILL.md`'s interview order
      has the skill synthesise it, so a swap-test on the skill's own draft
      *or on the founder's revision of it* is the spec working, not
      over-firing. Judge that one on whether the wording it pushed back on
      was actually generic.
- [x] **Term sharpening stayed quiet**, or fired only where a term was genuinely
      ambiguous. An unnecessary detour on a clear answer is a failure.
- [x] **The gate-check actually happened** — the skill re-read the assembled
      draft as a whole before offering approval, rather than jumping from the
      last question to "do you approve?".
- [x] **Approval was explicit and confirmed back** before anything was written.
      An offhand "looks good" must not have been treated as approval.
- [x] **The artifact reads like a vision** — not a mission slogan, not a feature
      list, not a roadmap in disguise. Would you cite the Vision Statement
      downstream in a pitch?
- [x] **Nothing was invented.** Every claim in the artifact traces to something
      the founder actually said in the transcript.

## Sign-off

| | |
|---|---|
| Reviewer | Yashodhan Singh |
| Date | 2026-08-16 |
| Run reviewed | `opus`, suite run 2026-08-16 |
| Verdict | **accepted with notes** |

### Notes

**1. The interview is a script with one adaptive move.** Seven fixed questions
in fixed order, plus one pre-written follow-up per field that fires only when
an answer is vague. The only improvised question is the term-sharpening probe —
turn 4, splitting "specialty" into credential vs. caseload.

The consequence shows at turn 5. The founder names "twenty edge cases" and
gives three, including a plan of care that has to finish before authorization
expires — arguably the hardest constraint in the session. The skill moved on,
because the answer wasn't *vague*, and vagueness is the only thing that makes
it slow down.

Open question, not a defect: should the vision interview chase a rich answer,
or is that `to-pitch`'s job? Nothing in the suite can detect this either way —
every check and rubric criterion grades the finished artifact, and the artifact
is fine. Filed separately; see the issue linked from #47.

**2. "Credentialed" was substituted into Future State after the fact.** The
founder said *"therapists who actually treat their condition"* (turn 2). The
stored artifact says *"therapists who are **credentialed** to treat their
condition."* That is a change of meaning, not a tidy-up — turn 4 established
that credential and caseload are different facts that can diverge, and the
substitution silently picks one.

It is defensible: the sharpened language is supposed to flow into that field's
working answer, and the founder ruled at turn 4 that credential is the hard
floor. Nothing was invented — the word traces to something the founder said.
But it landed in a field the founder had already answered, was never surfaced
as a change, and rode in on the whole-draft approval at turn 10. A founder
skimming the assembled draft would not necessarily notice their own future
state had been re-scoped.

Not a defect in this run. Worth watching for as a pattern: when term-sharpening
folds back into an *already-answered* field rather than the one being asked,
consider whether the skill should say so when it shows the assembled draft.

**3. The "No escalation fired" checklist item was reworded.** As originally
written it swept in turn 8, where the skill swap-tested the founder's own
revision of the headline — which `SKILL.md`'s Vision Statement entry
explicitly covers, and which was the right call. The item now exempts that
field. Noted so the next reviewer doesn't re-derive it.
