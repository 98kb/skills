# Human spot-check — `01-cooperative-sharp`

**Status: PENDING — not yet performed.**

Per #12's standing rule, `to-vision` is **not eval-complete** until a human has
read scenario 1's full transcript end to end and signed off below. Automated
grading cannot satisfy this. An agent must not fill this in.

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

- [ ] **Interview order** — Customer & Problem → Future State → Grounding
      Insight → Why Us/Why Now → Additional Grounding (single offer) → Vision
      Statement → Vision Pivot Trigger. Substance first, headline second,
      falsifiability last.
- [ ] **One question at a time**, in a natural voice — not the schema dumped at
      the founder as a form to fill in.
- [ ] **The Vision Statement was synthesised by the skill** from what the
      founder had already said, and offered for adjustment — not asked for cold.
- [ ] **No escalation fired.** This founder's answers are sharp; a follow-up
      here would mean the sharpness check is trigger-happy, which is a real
      defect even though it produces a passing artifact.
- [ ] **Term sharpening stayed quiet**, or fired only where a term was genuinely
      ambiguous. An unnecessary detour on a clear answer is a failure.
- [ ] **The gate-check actually happened** — the skill re-read the assembled
      draft as a whole before offering approval, rather than jumping from the
      last question to "do you approve?".
- [ ] **Approval was explicit and confirmed back** before anything was written.
      An offhand "looks good" must not have been treated as approval.
- [ ] **The artifact reads like a vision** — not a mission slogan, not a feature
      list, not a roadmap in disguise. Would you cite the Vision Statement
      downstream in a pitch?
- [ ] **Nothing was invented.** Every claim in the artifact traces to something
      the founder actually said in the transcript.

## Sign-off

| | |
|---|---|
| Reviewer | _(name)_ |
| Date | _(YYYY-MM-DD)_ |
| Run reviewed | _(run.json `model` + suite run date)_ |
| Verdict | _(accepted / accepted with notes / rejected)_ |

### Notes

_(What gave you pause, what you'd change in the skill, anything the automated
grading missed or got wrong.)_
