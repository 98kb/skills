# Shared eval harness

One driver, graded per skill. `harness/` holds the session driver, the
deterministic checker, the LLM-judge runner, the summarizer, and the
`run-all`/`promote` wrappers; `fixtures/` holds the upstream artifacts a
mid-pipeline skill's session starts from. Each skill keeps only its own
scenarios, rubric, config, and pattern block under
`skills/<area>/<skill>/evals/`.

Extracted from `to-vision`'s suite in #60. It lives at the repo root rather than
under `skills/product/` because it is not `product`'s to own — nothing in it
knows what a vision or a pitch is.

Grading semantics are ADR 0003's, unchanged by the extraction: mechanical checks
and judged content quality are separate mechanisms and are never blended.

## Wiring a skill in

Add `skills/<area>/<skill>/evals/eval.config.json`. The schema is documented in
full, with the reasoning for each key, at the top of `harness/config.mjs`. The
short version:

```json
{
  "skill": "to-vision",
  "slashCommand": "/to-vision",
  "artifact": {
    "path": "docs/product/vision.md",
    "additionalPaths": [],
    "storedFieldOrder": ["Vision Statement", "..."],
    "optionalFields": ["Additional Grounding"],
    "allowedFrontmatter": ["approved_by", "approved_at", "..."]
  },
  "workspace": { "seed": [{ "from": "evals/fixtures/vision-approved.md", "to": "docs/product/vision.md" }] },
  "sut": { "allowedTools": ["Read", "Write", "Edit", "Glob", "Grep"] },
  "founder": { "finishedWhen": "it has told you the vision is written or recorded, ..." },
  "checksModule": "checks.mjs",
  "judge": {
    "artifactLabel": "product vision artifact",
    "swapTestSubject": "vision",
    "criterionFields": { "1": ["Customer & Problem"], "...": [] }
  }
}
```

Then add `checks.mjs` beside it exporting the skill's pattern block —
`flags`, `baseQuestions`, `declinePatterns`, `forbiddenVocabulary`,
`fieldPresence`, `assertions`, `fieldItems`. All are optional; a check whose
patterns are absent simply does not run. See
`skills/product/to-vision/evals/checks.mjs` for a worked example with the
false-failure lessons annotated, and `skills/product/to-pitch/evals/checks.mjs`
for `assertions` (must / must-not over an artifact section or the transcript)
and `fieldItems` (structured items and their required sub-fields).

`sharpeningQuestion` is optional and consumed by the attempt counter — see
"Counting attempts" below. Absent means "exclude nothing", which is how every
suite behaved before it existed.

This list is the contract `evals/harness/check.mjs` consumes; a new export kind
means editing the checker and this line together.

The division is deliberate: `eval.config.json` holds plain data, `checks.mjs`
holds the regexes and vocabulary lists that cannot survive a round trip through
JSON. Anything structural — how a disclosure window is scanned, how attempts
are counted, how a decline is graded — is shared and must not be copied into a
skill's module.

## What a scenario may expect

An expectation **omitted** from `expect.json` is not asserted. That has always
been the convention. The other half is now enforced: an expectation **present**
in `expect.json` must assert. A declared key that registers no check is a hard
error, and so is a key no check reads.

```
$ node evals/harness/check.mjs $E 04-upstream-gate-refusal
expect.json contract — 04-upstream-gate-refusal

  ✗ "cappedAttempts": {} registered no check — it grades nothing while reading
    as an assertion. An expectation omitted from expect.json is not asserted, so
    say "not asserted" by leaving the key out; `{}`, `[]` and `false` do not say it.
```

`check.mjs` exits **3** on a contract violation and writes no verdict, because a
verdict computed from expectations that do not assert what they appear to is
worse than no verdict at all. (0 = every check passed, 1 = some check failed,
2 = the run or config is unusable.)

Four shapes of silent no-op were in the tree at once and all four read as
assertions in review: `"cappedAttempts": {}` iterates zero times, `"declines":
[]` loops over nothing, `"mandatoryFieldsPresent": false` takes the
trivially-true branch, and `"outcome": "gate-failed"` is a value no code path
reads. That is how a scenario whose whole subject is a refusal scored 11 of 12
against an *empty transcript*.

The rule is "registered at least one check", not "is not empty" — the two are
different questions and only one of them matters. `"assumptionItems": {}` is a
live expectation: `{}` skips only the item-count check while the sub-field check
still grades every item.

The catalogue lives in `harness/expectations.mjs`, and `check.mjs` prints it
whenever a key is rejected. The keys the harness itself reads:

| key | asserts |
| --- | --- |
| `outcome` | only `"approved"` asserts anything — that approval was explicitly requested |
| `artifact` | `"written"` \| `"not-written"` |
| `approvalMarker` | `"present"` \| `"absent"` — the `approved_by`/`approved_at` pair |
| `approverName` | who `approved_by` must name, and that `approved_at` is ISO 8601 |
| `upstreamResolvesTo` | where the artifact's one-hop `upstream` pointer must land |
| `mandatoryFieldsPresent` | `true` — every mandatory `##` section is present, and an artifact exists at all |
| `flaggedFields` | non-empty list of fields disclosed as weak before approval was asked for |
| `assertZeroFlags` | `true` — no field was disclosed as weak |
| `forbidApprovalRequest` | `true` — approval was never offered |
| `cappedAttempts` | non-empty `{ field: follow-ups }` — each field asked exactly `1 + follow-ups` times |
| `candidateRounds` | `{ field, candidates, maxAttemptsPerCandidate }` — replacement rounds inside one field |
| `forbidInterviewQuestions` | `true` — no base question was asked at all |
| `forbidTools` | non-empty list of tool names the session must not call |
| `declines` | non-empty list of `declinePatterns` names from `checks.mjs` |
| `maxAgentTurns` | integer — at most this many agent turns, **and at least one** |
| `minAgentTurns` | integer — at least this many agent turns |

Plus whatever the skill's `checks.mjs` declares as a `when` key on a
`forbiddenVocabulary`, `fieldPresence`, `assertions` or `fieldItems` rule.

Metadata keys, which never assert and are read by other entry points:
`id`, `category`, `title`, `source`, `notes`, `workspace`,
`humanSpotCheckRequired`, `diagnostic`, `diagnosticQuestion`. **`notes` is the
place to put prose** — a sentence describing an outcome nothing grades belongs
there, not in a key shaped like an assertion.

Two consequences worth stating plainly:

- **A non-approved outcome has no single key.** `"outcome": "gate-failed"` is
  rejected. State it through the keys that can actually see it — `artifact`,
  `approvalMarker`, `forbidApprovalRequest`, `maxAgentTurns` — plus a transcript
  assertion from `checks.mjs` naming the reason the founder was given. Without
  that last one, a silent stall, a crash and a max-turns cutoff are
  indistinguishable from the outcome the scenario specifies.
- **A key must be dropped when the scenario makes it inert.** `approverName` on
  a scenario expecting no approval, or the vocabulary-leak key on a scenario
  expecting no artifact, now fails rather than grading nothing.

### Saying "the skill told the founder why"

There is no bespoke key for this and there should not be one. `checks.mjs`
declares the phrasing as an ordinary `assertions` rule over the transcript, and
the scenario opts in by name:

```js
{
  when: "gateFailureNamesReason",
  checkId: "scenario/gate-failure-names-reason",
  source: "transcript",
  speaker: "agent",
  must: /…/,
  label: "the founder being told the pitch failed the assumption gate",
}
```

`source: "transcript"` matches turns by the named speaker (`must` = at least one
turn matches, `mustNot` = none does); `source: "artifact"` matches one `##`
section, or the whole body when `field` is omitted. Markdown emphasis is
stripped before every match.

## Counting attempts

Attempts on a field are counted structurally: find where the skill opens the
field with its base question, then count the agent turns that still ask
something before it opens the *next* field. Three things shape that count, and
each was a false grade first.

**Sharpening questions are not escalations.** These skills are told to stop and
pin down an overloaded term before grading an answer, and the personas hand them
bait that triggers exactly that. Counting the sharpening move as a follow-up
made a first-try-clean answer read as two attempts in a live run. Export
`sharpeningQuestion` from `checks.mjs` and any turn matching it is excluded from
the count; omit it and nothing is excluded.

**An ambiguous window is an error, not a number.** The algorithm assumes each
base question marks one moment. Verified against a real run: a bare
`/\bopen questions?\b/` matched four agent turns, two of them belonging to an
earlier field, so that field's window closed in the middle of itself. When a
field's own pattern matches more than once, or a *later* field's pattern matches
more than once inside the span being measured, the check fails and names the
turns — a wrong number that looks right is the failure mode the structural count
exists to avoid. The field named by `candidateRounds` is exempt, because the
scenario has declared how many times it opens.

**Candidate budgets are per candidate.** `candidateRounds` registers one
`scenario/candidate-attempt-budget:N` per *expected* candidate, each counting
the asks in that candidate's own stretch (`opens[i]` → `opens[i+1]`, the last
one closing at the next field or the end of the conversation) against
`1 + maxAttemptsPerCandidate`. An aggregate ceiling is arithmetic, not the rule:
`SKILL.md` gives one budget per item, so 7 asks on candidate 1 and 1 each on
candidates 2 and 3 is a runaway loop that an aggregate of 9 waves through. The
aggregate also had no headroom in the direction that mattered — the field graded
this way is the last one the skill asks, so nothing later closes the window, it
ran to the end of the transcript, and one closing question tipped a
fully-correct run over.

## Negative controls

A scenario says what correct behaviour looks like. Nothing here ever asked the
other question — *would this scenario fail if the skill misbehaved?* — and when
it was finally asked the answer was no, repeatedly: an empty transcript scored
11 of 12 against a scenario whose whole subject is a refusal, and a run where
the skill offered approval to a founder it must never offer approval to scored
12 of 12.

A negative control is a synthetic run that is **deliberately wrong**, together
with the check ids it must trip. The runner builds each one into a temp run
directory, grades it with the real `check.mjs` against the scenario's real
`expect.json`, and asserts every named check actually reported failure.

```bash
node evals/harness/negative-control.mjs $E                        # whole suite
node evals/harness/negative-control.mjs $E 04-upstream-gate-refusal
```

Zero model calls, whole suite in seconds. `run-all.sh` runs it **before** the
first model call and stops if it fails, because a suite whose controls do not
trip is not a suite that passed, it is a suite that cannot fail.
`EVAL_SKIP_NEGATIVE_CONTROLS=1` forces past it.

### The file

`scenarios/<scenario-id>/negative-controls/<name>.json`. One control per file;
the file name is the control's name in the report.

```json
{
  "description": "the skill offers approval to the founder it must never offer approval to",
  "mustFail": ["scenario/approval-never-offered", "scenario/max-agent-turns"],

  "transcript": [
    { "speaker": "agent",   "text": "What's the specific pain, in her own words?" },
    { "speaker": "founder", "text": "Scheduling is a mess." },
    { "speaker": "agent",   "text": "Right. Do you **approve** this pitch?" }
  ],

  "toolcalls": [
    { "name": "Write", "input": { "file_path": "docs/product/pitches/x/pitch.md" } }
  ],

  "artifact": "---\nupstream: ../../vision.md\n---\n\n## Problem\n\n…\n",
  "workspaceFiles": ["./docs/product/vision.md", "./docs/product/pitches/x/pitch.md"],

  "run": { "endedBecause": "max-turns" }
}
```

| key | type | meaning |
| --- | --- | --- |
| `mustFail` | string[] | **required, non-empty.** Check ids that must report `pass: false`. A control naming no check asserts nothing and is rejected. |
| `description` | string | optional; printed beside the control in the report |
| `transcript` | `{speaker,text}[]` | becomes `transcript.json`. `speaker` is `"agent"` or `"founder"`. Default `[]`. |
| `toolcalls` | `{name,input}[]` | becomes `toolcalls.json`. Default `[]`. |
| `artifact` | string | becomes `artifact.md`. Omit it entirely to model a run that produced no artifact. |
| `workspaceFiles` | string[] | becomes `workspace-files.txt`. See the default below. |
| `run` | object | merged over the generated `run.json` — set `endedBecause`, `turns`, `model` when a check reads them. |

**`workspaceFiles` default.** Omitted, it is the scenario's seeded destinations
(resolved by the same `seeds.mjs` merge the driver uses) plus, when `artifact`
is present, the config's `artifact.path` with `*` replaced by `control` and `?`
by `x` — a glob path has no literal spelling until a session picks its slug, and
a control has no session. Spell the list out when a control is *about* the file
tree: a stray write, two artifacts, a missing seed.

`run.json` is generated with `turns` = the number of agent turns and
`endedBecause` = `"founder-sentinel"`, so a control only names `run` when it is
about how the session ended.

**Two ways a control is rejected**, both non-zero exits:

- a check under `mustFail` **passed** — the run was built to break it and did not
- a check under `mustFail` was **never registered** — the id is wrong, or the
  `expect.json` key that would register it is missing. An unregistered check
  cannot fail, so the control proves nothing. This is the failure mode that
  matters most: it is the same one the scenarios themselves had.

Controls are graded through `check.mjs`'s CLI, not by importing it, so there is
no second grading path to drift from the one that produces real verdicts. They
grade against the scenario's **real** `expect.json` — a control cannot override
expectations, because "these expectations catch this" is the whole claim.

## Finding the artifact when the skill picks the path

`artifact.path` is read as a **glob**, not a literal. `to-vision` writes to one
fixed path and every artifact used to look like that; `to-pitch` is the first
that doesn't. A pitch lives at `docs/product/pitches/<slug>/pitch.md` where the
slug is derived at runtime from the founder's own Problem and Solution sketch,
proposed by the skill and confirmed by them — so the harness cannot know it in
advance, and shouldn't: one vision fanning out into several pitches is the point,
and a fixed path would collapse them.

```json
"artifact": { "path": "docs/product/pitches/*/pitch.md" }
```

A path with no wildcard compiles to a pattern matching exactly itself, which is
why `"docs/product/vision.md"` keeps behaving as it always did and no existing
config needed touching. There is deliberately no second `pathGlob` key: one key
answering one question is fewer things to keep in sync than two that must be
mutually exclusive.

Supported wildcards are `*` and `?`, and **neither crosses a `/`**. `**` is
absent rather than half-implemented — the `a/**/b` must also match `a/b` rule is
exactly the kind of thing that silently mis-matches once and is never noticed.
`additionalPaths` and seeded destinations go through the same matcher, so a
stray-write exemption can be a pattern too.

**More than one match is a finding, not a choice.** A session that produced two
pitches has broken the one-run-one-bet rule, and picking one to grade would hide
it. So nothing chooses: `run-scenario.sh` records `artifact: "ambiguous"` in
`run.json` and copies nothing, and `check.mjs` fails `floor/artifact-unique`,
which is where a finding belongs because `check.mjs` is what produces the
verdict. That check is registered only when the configured path actually
contains a wildcard — with a literal path it could never fire, and an assertion
that cannot fail is noise in a report rather than reassurance.

The matching rule lives in one place, `harness/artifact.mjs`, which the bash
driver reaches as a CLI and the checker as an import — the same arrangement as
`seeds.mjs`, for the same reason. Resolving it in `find -path` on one side and JS
on the other is how the driver's idea of where the artifact is drifts from the
checker's stray-write exemption.

A mid-pipeline artifact also carries a one-hop `upstream` pointer. Name the
frontmatter key in `artifact.upstreamKey` (default `"upstream"`) and a scenario
asserts where it must land with `"upstreamResolvesTo": "docs/product/vision.md"`;
the checker resolves the stored relative path from the artifact's own directory.
A root artifact like a vision has nothing above it, omits the assertion, and the
check does not run.

## Seeding the workspace with upstream artifacts

`to-vision` is the pipeline root and starts from an empty workspace. Every skill
after it opens its session by reading the artifact upstream of it, so its
scenarios need that artifact already on disk before the first turn (#61).

**Where a seed is declared — two levels that compose.** `eval.config.json`'s
`workspace.seed` is the skill's default: what most of its scenarios need in
place. A scenario departs from that default in its own `expect.json`, using the
same shape:

```json
{
  "id": "04-upstream-gate-refusal",
  "workspace": {
    "seed": [{ "from": "evals/fixtures/vision-unapproved.md", "to": "docs/product/vision.md" }]
  }
}
```

The two lists are merged **by destination, and the scenario wins**. So the
refusal scenario above names the same `to` as the config default and swaps the
fixture under it; every other scenario inherits the approved vision by saying
nothing, and a scenario that declares no seed at all behaves exactly as it did
before any of this existed.

There is deliberately no syntax for *removing* a config-level seed. A suite that
needs some scenarios to start empty should leave the config default out and
declare the seed per scenario.

**Where fixtures live.** `from` resolves against the **repo root**, not the
skill's evals directory, so shared pipeline material can be named directly:
`evals/fixtures/vision-approved.md` and `evals/fixtures/vision-unapproved.md`.
An upstream artifact belongs to neither end of the hop — the vision `to-pitch`,
`to-roadmap` and `to-milestone` all interview against is one file, not three
divergent copies written by whoever needed one first. The two variants differ in
exactly one thing, the `approved_by`/`approved_at` frontmatter pair, because
that is the only thing an upstream-gate scenario discriminates on; any other
difference would confound it. Both are Dana Okafor's PT-clinic vision, taken
verbatim from `to-vision`'s recorded `01-cooperative-sharp` artifact, so the
fixture and that founder's persona agree.

A fixture that genuinely is one skill's own is still nameable — just spell it in
full: `skills/product/<skill>/evals/fixtures/...`.

**Seeded files are not stray writes.** They land in `workspace-files.txt` like
anything else, and `check.mjs` exempts exactly the destinations that were
seeded, resolved by the same merge — so seeding a fixture never reads as the
skill having written it, and a stray write beside a seeded fixture is still
caught.

The merge rule lives in one place, `harness/seeds.mjs`, which both the bash
driver (as a CLI) and the checker (as an import) go through. It was tempting to
let `run-scenario.sh` do it in `jq`; two copies of one rule is exactly how the
driver's idea of what was seeded drifts from the checker's.

## Running

Every entry point takes the skill's evals directory (or its `eval.config.json`)
as its first argument.

```bash
H=evals/harness; E=skills/product/to-vision/evals

$H/run-all.sh         $E                      # whole suite, both grades
$H/run-scenario.sh    $E 01-cooperative-sharp # one conversation
node $H/check.mjs     $E 01-cooperative-sharp # deterministic half
node $H/judge.mjs     $E 01-cooperative-sharp # LLM-judge half
node $H/summarize.mjs $E transcripts          # roll up, exit 1 on any failure
$H/promote.sh         $E --all                # scratch run → committed evidence

node $H/negative-control.mjs $E               # can these scenarios fail? (free)

$H/run-scenario.sh    $E 01-cooperative-sharp --seed-only
node $H/seeds.mjs     $E 01-cooperative-sharp
node $H/artifact.mjs  $E /path/to/a/workspace  # which files are the artifact
```

`negative-control.mjs` is the only one of these that costs nothing and the only
one that answers "would this suite notice". Run it on every change to a
scenario, a pattern, or this harness.

`--seed-only` builds the SUT workspace — the skill plus this scenario's seeded
fixtures — prints where it is, and stops before the first model call, leaving the
workspace behind instead of cleaning it up. It touches no run directory. That is
how you inspect what a session would have started from without paying for a
session; `seeds.mjs` on its own answers the narrower question of which fixtures
a scenario resolved to, and `artifact.mjs` the question of which file in a
workspace the grader would treat as the artifact.

Requires `claude`, `node` (≥18) and `jq`. Knobs: `EVAL_MODEL` (default `opus`),
`EVAL_JUDGE_MODEL`, `EVAL_MAX_TURNS` (40), `EVAL_MAX_BUDGET_USD` (10),
`EVAL_OUT_DIR`, `EVAL_SKIP_NEGATIVE_CONTROLS`.

## What the SUT can and cannot do

The SUT session is given the config's `allowedTools` **and** an explicit denial
of everything else. An allowlist alone grants without denying: a run passing
only `--allowed-tools` executed `date -u` and `ls` through Bash and got real
output back, while the driver's comment claimed otherwise. The denial mirrors
what `run_founder` has always done.

Denial does not replace grading. A denied call is still emitted as a `tool_use`
block into the raw stream, so `toolcalls.json` records it and the composition
checks still fail on it — intent is graded, not just effect. And a tool the
config allows is never denied here even when a scenario forbids it: an
upstream-gate scenario forbids `Write` and `Edit`, which every other scenario
needs, and the point there is to catch the reach, not to make it impossible.

**Every assistant text block of a turn is captured, in order.** The driver used
to record only the last one, which meant any prose emitted *before* a tool call
was dropped from `transcript.md` and `transcript.json` — and a decline or a
refusal is exactly that shape ("I'm not going to run that. Let me re-read what
you have." then a `Read`). The checker was grading a conversation with the
declines cut out of it. Note this changes two things at once: what the founder
sees on the next turn, and what `check.mjs` reads.

## Regression-testing the harness itself

Two cheap bars, and they answer different questions. **Negative controls** ask
whether the checks can fail; run `node evals/harness/negative-control.mjs $E`
first, because it is free and it is the one a green suite cannot substitute for.
**Re-grading the committed transcripts** asks whether the checks still agree
with themselves: they are recorded real runs, and re-grading them must reproduce
their recorded verdicts exactly. A full suite run costs real money and hours of
model calls, so neither of these is optional before asking for one.

```bash
E=$PWD/skills/product/to-vision/evals
T=$(mktemp -d) && cp -r "$E/transcripts/." "$T/"
for s in $(ls "$E/scenarios"); do
  EVAL_OUT_DIR="$T/$s" node evals/harness/check.mjs "$E" "$s" >/dev/null
  diff "$E/transcripts/$s/deterministic.json" "$T/$s/deterministic.json"
done
```

Copy first — `check.mjs` writes `deterministic.json` into the run directory it
is pointed at, and the committed evidence is not something to overwrite. If a
verdict changes, that is the finding; do not edit the transcript to match.

Compare **verdicts**, not bytes. Three `detail` strings in `02a` (×2) and `02b`
(×1) already differ from their committed form — `"pressed 3× (cap 2, tolerated
2–3)"` against `"pressed 3× (want exactly 3 — base + 2 follow-ups)"`. That drift
predates the extraction: #56 re-worded the message after those transcripts were
recorded, and the same three lines differ when the pre-extraction checker on
`main` is run against them. So a bare `diff` reports three hunks on a clean
tree. What must hold is every check's id and pass/fail, the counts, and the
disclosed-flag set.

One count also differs from the committed form, deliberately.
`04-unclear-but-honest` used to register `floor/mandatory-fields-present` as an
unconditional PASS even though that scenario omits the key — a check that could
not fail, registered for an expectation nobody made, which is the exact shape
the expect.json contract exists to remove. It is gone, and that scenario's total
is 13 rather than 14. Every id, pass flag and disclosed-flag set is otherwise
identical across all six.

**This re-grade is a substitute for a live re-run, and a weaker bar.** #60 asked
for `to-vision`'s suite to be re-run against the extracted harness; re-grading
recorded transcripts was done instead, because a live run is real money and the
maintainer's spend to authorise. It proves the *checker* is unchanged against
real recorded conversations. It cannot prove the *driver* — workspace
construction, the turn loop, transcript capture — still behaves, because none of
that executes. A live `run-all.sh` remains the only thing that closes that gap.
