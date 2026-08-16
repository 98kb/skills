#!/usr/bin/env node
//
// Deterministic checks for one eval run, for any skill wired to this harness.
//
//   node check.mjs <evals-dir|eval.config.json> <scenario-id>
//
// Mechanical and judgment-free, per ADR 0003 — the other half of the grade is
// the LLM judge (judge.mjs + rubric.md). Everything here is a structural or
// string-level test over the run directory produced by run-scenario.sh.
//
// The split between this file and the per-skill checks module is deliberate:
// the *algorithms* are shared (they were never skill-specific — only the
// strings they match were), while the regexes and vocabulary lists live in the
// skill's own module so tuning one skill's phrasing cannot break another's.
//
// Reads  <evals>/scenarios/<scenario-id>/expect.json
//        <run-dir>/{run,transcript,toolcalls}.json, artifact.md
// Writes <run-dir>/deterministic.json
// Exits  0 if every check passed, 1 otherwise.
//
// <run-dir> is <evals>/runs/<scenario-id> unless EVAL_OUT_DIR overrides it.
// Pointing EVAL_OUT_DIR at a committed transcripts/<scenario-id> re-grades a
// recorded run, which is how this harness is regression-tested without paying
// for a fresh suite.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, posix } from "node:path";
import { artifactMatches, isPattern, pathMatcher } from "./artifact.mjs";
import { loadChecks, loadConfig, requireArgs, runDirFor } from "./config.mjs";
import { seedsFor } from "./seeds.mjs";

const [, , configArg, scenario] = process.argv;
requireArgs("check.mjs", configArg, scenario);

const config = loadConfig(configArg);
const checks = await loadChecks(config);

const runDir = runDirFor(config, scenario);
const scenarioDir = join(config.scenariosDir, scenario);
if (!existsSync(runDir)) {
  console.error(`no run found at ${runDir} — run run-scenario.sh first`);
  process.exit(2);
}

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const readText = (p) => (existsSync(p) ? readFileSync(p, "utf8") : null);

const expected = readJson(join(scenarioDir, "expect.json"));
const transcript = readJson(join(runDir, "transcript.json"));
const toolcalls = readJson(join(runDir, "toolcalls.json"));
const artifact = readText(join(runDir, "artifact.md"));
const workspaceFiles = (readText(join(runDir, "workspace-files.txt")) ?? "")
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

const results = [];
const check = (id, layer, ok, detail) =>
  results.push({ id, layer, pass: Boolean(ok), detail });

let disclosedFlags = [];

const agentTurns = transcript.filter((t) => t.speaker === "agent");

// ── artifact parsing ────────────────────────────────────────────────────────

const STORED_FIELD_ORDER = config.artifact.storedFieldOrder;
const MANDATORY_FIELDS = config.artifact.mandatoryFields;
const ALLOWED_FRONTMATTER = config.artifact.allowedFrontmatter;

function parseArtifact(md) {
  if (md === null) return null;
  const fm = {};
  let body = md;
  const m = md.match(/^---\n([\s\S]*?)\n---\n?/);
  if (m) {
    for (const line of m[1].split("\n")) {
      const kv = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
      if (kv) fm[kv[1]] = kv[2].trim();
    }
    body = md.slice(m[0].length);
  }
  const headings = [...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((h) => h[1]);
  const sections = {};
  for (let i = 0; i < headings.length; i++) {
    const start = body.indexOf(`## ${headings[i]}`);
    const end =
      i + 1 < headings.length
        ? body.indexOf(`## ${headings[i + 1]}`)
        : body.length;
    sections[headings[i]] = body
      .slice(start + `## ${headings[i]}`.length, end)
      .trim();
  }
  return { frontmatter: fm, headings, sections, body };
}

const parsed = parseArtifact(artifact);

// Normalise spacing around a slash in a field name — "Why Us/Why Now" vs
// "Why Us / Why Now" is the one place a spec's own prose tends to vary.
const normField = (s) => s.replace(/\s*\/\s*/g, " / ").trim();

// ── shared floor 1 — approval-marker state (#9) ─────────────────────────────

// An expectation that is *omitted* from expect.json is not asserted. Ordinary
// scenarios name every outcome; a diagnostic scenario (see the skill's evals
// README) deliberately leaves the contested ones out, so only the invariants
// that hold whichever way the open design question lands are checked.

{
  const fm = parsed?.frontmatter ?? {};
  const hasMarker = Boolean(fm.approved_by && fm.approved_at);
  if (expected.approvalMarker !== undefined) {
    const want = expected.approvalMarker === "present";
    check(
      "floor/approval-marker",
      "floor",
      hasMarker === want,
      `expected approval marker ${expected.approvalMarker}, found ${
        hasMarker ? "present" : "absent"
      }${hasMarker ? ` (approved_by=${fm.approved_by})` : ""}`,
    );
  }

  if (expected.artifact !== undefined) {
    const wantArtifact = expected.artifact === "written";
    check(
      "floor/artifact-written",
      "floor",
      (artifact !== null) === wantArtifact,
      `expected artifact ${expected.artifact}, found ${
        artifact === null ? "none" : "written"
      }`,
    );
  }

  // Every workspace file that is the graded artifact. With a literal path this
  // can never exceed one, so the uniqueness check below is only registered when
  // the configured path is actually a pattern — an assertion that cannot fail
  // is noise in a report, not reassurance.
  const matched = artifactMatches(config, workspaceFiles);
  if (isPattern(config.artifact.path)) {
    check(
      "floor/artifact-unique",
      "floor",
      matched.length <= 1,
      matched.length <= 1
        ? `${matched.length} file matches ${config.artifact.path}`
        : `${matched.length} files match ${config.artifact.path}: ${matched.join(", ")}` +
          " — one session may produce at most one artifact",
    );
  }

  // The one-hop pointer back to the artifact this session read (#7). Asserted
  // only where a scenario names what it must resolve to, because the pipeline's
  // root artifact has nothing above it to point at. Resolved relative to the
  // artifact's own directory, which is the whole reason the pointer is stored
  // as a relative path rather than an absolute one.
  if (expected.upstreamResolvesTo !== undefined) {
    const key = config.artifact.upstreamKey;
    const pointer = fm[key];
    const from = matched.length === 1 ? posix.dirname(matched[0].replace(/^\.\//, "")) : null;
    const resolved =
      pointer && from ? posix.normalize(posix.join(from, pointer)) : null;
    check(
      "floor/upstream-pointer",
      "floor",
      resolved === expected.upstreamResolvesTo,
      pointer === undefined
        ? `frontmatter has no ${key} key — the upstream pointer is mandatory`
        : from === null
          ? `cannot resolve ${key}: ${matched.length} files match the artifact path`
          : `${key}: ${pointer} from ${from}/ resolves to ${resolved}, expected ${expected.upstreamResolvesTo}`,
    );
  }

  if (hasMarker && expected.approverName) {
    check(
      "floor/approver-identity",
      "floor",
      fm.approved_by.includes(expected.approverName),
      `approved_by "${fm.approved_by}" should name ${expected.approverName}`,
    );
    check(
      "floor/approval-timestamp",
      "floor",
      /^\d{4}-\d{2}-\d{2}T[\d:.]+/.test(fm.approved_at),
      `approved_at "${fm.approved_at}" should be an ISO 8601 timestamp`,
    );
  }

  // A never-revised artifact omits the revision pair entirely (SKILL.md).
  if (parsed) {
    const unknown = Object.keys(fm).filter(
      (k) => !ALLOWED_FRONTMATTER.includes(k),
    );
    check(
      "floor/frontmatter-keys",
      "floor",
      unknown.length === 0,
      unknown.length ? `unexpected frontmatter keys: ${unknown.join(", ")}` : "only spec'd keys present",
    );
    const emptyKeys = Object.entries(fm)
      .filter(([, v]) => v === "" || v === "null")
      .map(([k]) => k);
    check(
      "floor/no-empty-frontmatter",
      "floor",
      emptyKeys.length === 0,
      emptyKeys.length
        ? `keys written empty instead of omitted: ${emptyKeys.join(", ")}`
        : "no empty frontmatter values",
    );
  }
}

// ── shared floor 2 — composition compliance (#6, #18) ───────────────────────

{
  const names = toolcalls.map((t) => t.name);

  // These skills embed grilling and domain-modeling; they invoke nothing (#18).
  const skillCalls = names.filter((n) => n === "Skill");
  check(
    "floor/no-skill-invocations",
    "floor",
    skillCalls.length === 0,
    skillCalls.length
      ? `${skillCalls.length} Skill tool call(s) — composition is embed-only`
      : "no Skill tool calls",
  );

  const subagents = names.filter((n) => n === "Task" || n === "Agent");
  check(
    "floor/no-subagents",
    "floor",
    subagents.length === 0,
    subagents.length ? `spawned ${subagents.length} subagent(s)` : "no subagents",
  );

  // Automated research is out of scope for these runtime skills (#47, story 30).
  const research = names.filter((n) => n === "WebSearch" || n === "WebFetch");
  check(
    "floor/no-research-tools",
    "floor",
    research.length === 0,
    research.length
      ? `used research tools: ${[...new Set(research)].join(", ")}`
      : "no research tools used",
  );

  // The pipeline skills never read or write CONTEXT.md / CONTEXT-MAP.md (story 27).
  const contextTouches = toolcalls.filter((t) =>
    JSON.stringify(t.input ?? {}).match(/CONTEXT(-MAP)?\.md/),
  );
  check(
    "floor/never-touches-context-md",
    "floor",
    contextTouches.length === 0,
    contextTouches.length
      ? `${contextTouches.length} tool call(s) referenced CONTEXT.md/CONTEXT-MAP.md`
      : "CONTEXT.md untouched",
  );

  // The sharpening's only output is better field prose — no glossary artifact,
  // no roadmap, no stray CONTEXT.md. Seeded upstream fixtures are exempt: they
  // were in the workspace before the session started, so their presence is not
  // evidence the SUT wrote anything. The exemption set is resolved the same way
  // run-scenario.sh resolved what to copy — config default merged with this
  // scenario's override — so seeding a fixture can never read as a stray write.
  //
  // Matched as globs rather than compared as strings, because to-pitch's
  // artifact path carries a runtime-chosen slug. A literal path compiles to a
  // pattern matching exactly itself, so this is the same test it always was for
  // every skill whose path has no wildcard in it.
  const allowed = [
    config.artifact.path,
    ...config.artifact.additionalPaths,
    ...seedsFor(config, scenario).map((s) => s.to),
  ].map(pathMatcher);
  const strayFiles = workspaceFiles.filter((f) => !allowed.some((m) => m(f)));
  check(
    "floor/no-stray-artifacts",
    "floor",
    strayFiles.length === 0,
    strayFiles.length
      ? `wrote files beyond the ${config.skill} artifact: ${strayFiles.join(", ")}`
      : "no stray files written",
  );
}

// ── shared floor 3 — artifact fields match the configured schema ────────────

if (parsed) {
  const headings = parsed.headings.map(normField);
  const known = STORED_FIELD_ORDER.map(normField);

  const extras = headings.filter((h) => !known.includes(h));
  check(
    "floor/no-extra-fields",
    "floor",
    extras.length === 0,
    extras.length ? `unexpected sections: ${extras.join(", ")}` : "no extra sections",
  );

  const missing = MANDATORY_FIELDS.map(normField).filter(
    (f) => !headings.includes(f),
  );
  check(
    "floor/mandatory-fields-present",
    "floor",
    expected.mandatoryFieldsPresent ? missing.length === 0 : true,
    missing.length ? `missing mandatory: ${missing.join(", ")}` : "all mandatory fields present",
  );

  const present = known.filter((f) => headings.includes(f));
  const inOrder = headings.filter((h) => known.includes(h));
  check(
    "floor/stored-field-order",
    "floor",
    JSON.stringify(present) === JSON.stringify(inOrder),
    `stored order should be ${present.join(" → ")}, found ${inOrder.join(" → ")}`,
  );

  const empty = headings.filter((h) => !(parsed.sections[h] ?? "").trim());
  check(
    "floor/no-empty-sections",
    "floor",
    empty.length === 0,
    empty.length ? `empty sections: ${empty.join(", ")}` : "no empty sections",
  );
}

// ── scenario layer — flags ──────────────────────────────────────────────────

// Markdown emphasis is stripped before every prose match below. These skills
// bold and italicise heavily ("has to be *your* belief"), which silently broke
// naive word-boundary patterns the first time this suite ran.
const plain = (s) => s.replace(/[*_`]+/g, "");

// The patterns themselves are the skill's, not the harness's: `flags.positive`
// names a field and asserts it is weak, `flags.negated` guards against a clean
// gate-check ("Gate-check: no flagged fields") reading as a flag on every field
// it names, and `flags.approvalRequest` finds the moment approval was asked for.
const FLAG_POSITIVE = checks.flags?.positive;
const FLAG_NEGATED = checks.flags?.negated;
const APPROVAL_REQUEST = checks.flags?.approvalRequest;

// A disclosure names the flag first ("Two flagged fields, before you decide:")
// and the fields after it, in separate paragraphs — so matching per-paragraph
// misses it. Instead: find where the disclosure starts, then treat any field
// named from there to the end of the turn as flagged.
function flagMentions(text, field) {
  const flat = plain(text);
  const sentences = flat.split(/(?<=[.!:?])\s+|\n/);
  let offset = 0;
  let disclosureAt = -1;
  for (const s of sentences) {
    if (FLAG_POSITIVE.test(s) && !FLAG_NEGATED.test(s)) {
      disclosureAt = offset;
      break;
    }
    offset += s.length + 1;
  }
  if (disclosureAt === -1) return false;

  // Within the disclosure, the skill labels each weak field at the head of its
  // own paragraph ("Future State — generic. It fails the swap-test..."). Requiring
  // the name near the paragraph start keeps a passing mention inside another
  // field's critique ("your Vision Statement partly rescues this") from reading
  // as a flag on that field.
  const alt = field.replace(/\s*\/\s*/g, "\\s*/\\s*").replace(/&/g, "(?:&|and)");
  const re = new RegExp(alt, "i");
  return flat
    .slice(disclosureAt)
    .split(/\n\s*\n/)
    .some((p) => {
      const m = re.exec(p);
      return m !== null && m.index <= 40;
    });
}

if (APPROVAL_REQUEST) {
  const expectedFlags = expected.flaggedFields ?? [];
  const approvalIdx = transcript.findIndex(
    (t) => t.speaker === "agent" && APPROVAL_REQUEST.test(t.text),
  );

  if (expected.outcome === "approved") {
    check(
      "scenario/approval-requested",
      "scenario",
      approvalIdx !== -1,
      approvalIdx === -1
        ? "no explicit approval request found in the transcript"
        : `approval requested at turn index ${approvalIdx}`,
    );
  }

  if (expected.forbidApprovalRequest) {
    check(
      "scenario/approval-never-offered",
      "scenario",
      approvalIdx === -1,
      approvalIdx === -1
        ? "approval was never offered, as required"
        : `approval was offered at turn index ${approvalIdx} — must not be`,
    );
  }

  for (const field of expectedFlags) {
    const disclosedBefore = transcript
      .slice(0, approvalIdx === -1 ? transcript.length : approvalIdx + 1)
      .some((t) => t.speaker === "agent" && flagMentions(t.text, field));
    check(
      `scenario/flag-disclosed:${field}`,
      "scenario",
      disclosedBefore,
      disclosedBefore
        ? `"${field}" disclosed as weak at or before the approval request`
        : `"${field}" was never disclosed as weak before approval was requested`,
    );
  }

  // Every field the skill disclosed as flagged at or before the approval
  // request. Recorded for judge.mjs, which excuses a failing rubric criterion
  // only when its field was flagged here — approving with disclosed flags is a
  // legitimate outcome (#17), approving with an undisclosed weakness is not.
  disclosedFlags = STORED_FIELD_ORDER.filter((f) =>
    transcript
      .slice(0, approvalIdx === -1 ? transcript.length : approvalIdx + 1)
      .some((t) => t.speaker === "agent" && flagMentions(t.text, f)),
  );

  // Only the cooperative/sharp scenario asserts zero flags — #19 specifies that
  // for that founder alone. A boundary-testing scenario is graded on whether it
  // declined, not on whether the artifact came out flag-free.
  if (expected.assertZeroFlags) {
    check(
      "scenario/no-spurious-flags",
      "scenario",
      disclosedFlags.length === 0,
      disclosedFlags.length
        ? `flagged fields that should have been sharp: ${disclosedFlags.join(", ")}`
        : "no fields flagged, as expected",
    );
  }
}

// ── scenario layer — escalation caps ────────────────────────────────────────

// Attempts on a field are counted structurally, not by keyword frequency:
// find where the skill opens the field with its base question, then count the
// agent turns that still ask something before it opens the *next* field. That
// survives escalations being worded as swap-tests (which share no vocabulary
// with the base question) and stops incidental later mentions of a field name
// from inflating the count — the two ways a keyword tally got this wrong.
// The base-question patterns are the skill's; the counting is not.
const BASE_QUESTIONS = checks.baseQuestions ?? [];

// Every agent turn that asks a given field's base question. Normally one; a
// field whose items can be refused and replaced (to-pitch's Riskiest
// Assumptions) re-asks it once per candidate, which is what candidateRounds
// below counts.
function baseQuestionTurns(field) {
  const order = BASE_QUESTIONS.findIndex(([f]) => f === field);
  if (order === -1) return null;
  const re = BASE_QUESTIONS[order][1];
  return agentTurns.flatMap((t, i) => (re.test(plain(t.text)) ? [i] : []));
}

// Where a field's run of turns ends: the first later turn that opens any
// subsequent field, or the end of the conversation if the session stopped here.
function fieldWindowEnd(field, opensAt) {
  const order = BASE_QUESTIONS.findIndex(([f]) => f === field);
  for (let i = opensAt + 1; i < agentTurns.length; i++) {
    const text = plain(agentTurns[i].text);
    if (BASE_QUESTIONS.slice(order + 1).some(([, re]) => re.test(text))) return i;
  }
  return agentTurns.length;
}

function attemptsOn(field) {
  const opens = baseQuestionTurns(field);
  if (opens === null || opens.length === 0) return null;
  const opensAt = opens[0];
  return agentTurns
    .slice(opensAt, fieldWindowEnd(field, opensAt))
    .filter((t) => t.text.includes("?")).length;
}

for (const [field, cap] of Object.entries(expected.cappedAttempts ?? {})) {
  const asks = attemptsOn(field);
  // `cap` is the number of *follow-ups* allowed, so a field that hit the cap
  // was asked exactly cap + 1 times: the base question plus its follow-ups.
  // SKILL.md pins this (#56); every capped field on record lands on 3. Asserted
  // exactly rather than as a range, so this now also catches the skill giving
  // up early — not just a runaway loop.
  const want = cap + 1;
  const ok = asks === want;
  check(
    `scenario/escalation-cap:${field}`,
    "scenario",
    ok,
    asks === null
      ? `"${field}" base question never found in the transcript`
      : `"${field}" pressed ${asks}× (want exactly ${want} — base + ${cap} follow-ups)`,
  );
}

// ── scenario layer — candidate rounds inside one field ──────────────────────

// Some fields don't escalate on the founder's answer, they *replace* it: a
// to-pitch Riskiest Assumption that fails the falsifiability chain is refused
// outright and a fresh candidate asked for, with a fresh budget. That is a
// second, differently-shaped budget sitting inside one field, and the per-field
// escalation cap above cannot express it.
//
// It is counted the same structurally-not-by-keyword way, and for a sharper
// reason: the chain's three checks ("what's X, and what's Y in a number?",
// "what would prove you wrong?", "how could you test this in under an hour?")
// share no vocabulary at all with the base question or with each other, so any
// keyword tally of "attempts" would read them as three unrelated topics. What
// is countable is the base question recurring — that is the skill looping back
// for a replacement — and the total asks inside the field's window.
{
  const rounds = expected.candidateRounds;
  if (rounds) {
    const opens = baseQuestionTurns(rounds.field);
    check(
      "scenario/candidate-rounds",
      "scenario",
      opens !== null && opens.length === rounds.candidates,
      opens === null
        ? `"${rounds.field}" has no base question declared in checks.mjs`
        : `"${rounds.field}" opened ${opens.length}× (want exactly ${rounds.candidates}` +
          ` — the first candidate plus ${rounds.candidates - 1} replacement round(s))`,
    );

    if (opens && opens.length) {
      const ceiling = rounds.candidates * (1 + rounds.maxAttemptsPerCandidate);
      const asks = agentTurns
        .slice(opens[0], fieldWindowEnd(rounds.field, opens[0]))
        .filter((t) => t.text.includes("?")).length;
      check(
        "scenario/candidate-attempt-budget",
        "scenario",
        asks <= ceiling,
        `"${rounds.field}" asked ${asks} question(s) across all candidates` +
          ` (ceiling ${ceiling} — ${rounds.candidates} candidates ×` +
          ` base + ${rounds.maxAttemptsPerCandidate} attempts)`,
      );
    }
  }
}

// ── scenario layer — no interview at all ────────────────────────────────────

// A session refused at its upstream gate must ask nothing, not ask politely.
// Expressed against the skill's own base questions rather than a generic "did
// it use a question mark", because a refusal legitimately asks things like
// "would you like me to explain what's missing?" — what must not appear is an
// *interview* question.
if (expected.forbidInterviewQuestions) {
  const asked = BASE_QUESTIONS.filter(([, re]) =>
    agentTurns.some((t) => re.test(plain(t.text))),
  ).map(([f]) => f);
  check(
    "scenario/no-interview-questions",
    "scenario",
    asked.length === 0,
    asked.length
      ? `interview questions were asked despite the refusal: ${asked.join(", ")}`
      : "no interview question was asked, as required",
  );
}

// ── scenario layer — tools the scenario forbids outright ────────────────────

// The floor already bans Skill, subagents and research tools everywhere. This
// is for a scenario whose whole point is a tool that is otherwise merely
// unused — to-pitch's execute-the-validation push, where reaching for anything
// that *runs* something is the failure being probed.
for (const name of expected.forbidTools ?? []) {
  const used = toolcalls.filter((t) => t.name === name);
  check(
    `scenario/forbidden-tool:${name}`,
    "scenario",
    used.length === 0,
    used.length ? `${used.length} ${name} call(s)` : `no ${name} calls`,
  );
}

// ── scenario layer — boundary declines ──────────────────────────────────────

// The push patterns match the persona's *imperative*, not its topic. A loose
// topic match picked the wrong turn entirely: "the auditor asks for Q2 access
// reviews" in a Future State answer read as the roadmap push, so the check
// graded the reply to an unrelated question.
const DECLINE_PATTERNS = checks.declinePatterns ?? {};

for (const decline of expected.declines ?? []) {
  const { push, decline: declineRe } = DECLINE_PATTERNS[decline];
  const pushIdx = transcript.findIndex(
    (t) => t.speaker === "founder" && push.test(plain(t.text)),
  );
  check(
    `scenario/boundary-push-happened:${decline}`,
    "scenario",
    pushIdx !== -1,
    pushIdx === -1
      ? "the persona never made the boundary push — scenario did not exercise its case"
      : `boundary push at turn index ${pushIdx}`,
  );
  if (pushIdx === -1) continue;

  const reply = transcript
    .slice(pushIdx + 1)
    .find((t) => t.speaker === "agent");
  check(
    `scenario/declined:${decline}`,
    "scenario",
    reply && declineRe.test(plain(reply.text)),
    reply
      ? declineRe.test(plain(reply.text))
        ? "the skill declined and redirected"
        : "the skill's reply to the push did not decline"
      : "no agent reply followed the push",
  );

  // Declines are conversational, not session-ending — the interview resumes.
  const resumed = transcript.slice(pushIdx + 1).filter((t) => t.speaker === "agent").length;
  check(
    `scenario/session-continued:${decline}`,
    "scenario",
    resumed >= 2,
    `${resumed} agent turn(s) after the push — the session must continue, not end`,
  );
}

// ── scenario layer — neighbouring skills' vocabulary must not leak ──────────

// Each pipeline skill has a downstream neighbour whose field names must not
// appear in its artifact (#15, #47). Which terms those are, which expect.json
// key gates the check, and what the check is called are all the skill's to
// declare — the leak test itself is the same everywhere.
const VOCAB = checks.forbiddenVocabulary;
if (VOCAB && expected[VOCAB.when] && parsed) {
  const leaked = VOCAB.terms.filter((v) => v.re.test(artifact)).map(
    (v) => v.term,
  );
  check(
    VOCAB.checkId,
    "scenario",
    leaked.length === 0,
    leaked.length
      ? `${VOCAB.label} leaked into the ${config.skill} artifact: ${leaked.join(", ")}`
      : `no ${VOCAB.label} in the artifact`,
  );
}

// ── scenario layer — presence of a named field ──────────────────────────────

// A scenario can assert that one particular field did or did not survive to the
// artifact — for to-vision, whether a Grounding Insight ever surfaced. The
// skill declares which fields are assertable this way and under which
// expect.json key; the presence test is shared.
for (const rule of checks.fieldPresence ?? []) {
  if (expected[rule.when] === undefined) continue;
  const value = parsed?.sections?.[rule.field] ?? null;
  const wantPresent = expected[rule.when] === "present";
  const isPresent = Boolean(value && value.trim().length > 0);
  check(
    rule.checkId,
    "scenario",
    isPresent === wantPresent,
    `expected ${rule.field} ${expected[rule.when]}, found ${
      isPresent ? "present" : "absent"
    }`,
  );
}

// ── scenario layer — named must / must-not assertions ───────────────────────

// The general form of "this scenario's correct outcome shows up as *this* text
// being present, or *that* text being absent". The skill declares a catalogue
// of them by name; a scenario opts into one by setting its `when` key true. The
// pattern is the skill's, the scan is not.
//
// `source: "artifact"` matches one `##` section, or the whole body when `field`
// is omitted. `source: "transcript"` matches turns by the named speaker: `must`
// means at least one turn matches, `mustNot` means none does.
for (const rule of checks.assertions ?? []) {
  if (!expected[rule.when]) continue;

  let haystacks;
  if (rule.source === "transcript") {
    haystacks = transcript
      .filter((t) => t.speaker === (rule.speaker ?? "agent"))
      .map((t) => plain(t.text));
  } else if (!parsed) {
    haystacks = null;
  } else {
    haystacks = [plain(rule.field ? (parsed.sections[rule.field] ?? "") : parsed.body)];
  }

  if (haystacks === null) {
    check(rule.checkId, "scenario", false, `no artifact to check ${rule.label} against`);
    continue;
  }
  if (rule.must) {
    const hit = haystacks.some((h) => rule.must.test(h));
    check(
      rule.checkId,
      "scenario",
      hit,
      hit ? `found ${rule.label}` : `did not find ${rule.label}`,
    );
  }
  if (rule.mustNot) {
    const hit = haystacks.some((h) => rule.mustNot.test(h));
    check(
      rule.checkId,
      "scenario",
      !hit,
      hit
        ? `found ${rule.label}, which must not appear`
        : `${rule.label} did not appear, as required`,
    );
  }
}

// ── scenario layer — items inside a field, and their sub-fields ─────────────

// A field whose value is a list of structured items rather than prose: a
// to-pitch Riskiest Assumption is recorded as claim / threshold / test /
// timebox, and one missing its threshold "isn't a shorter assumption, it's an
// unfinished one" (SKILL.md). The skill declares how an item starts and which
// sub-fields each must carry; a scenario says how many items it expects.
for (const rule of checks.fieldItems ?? []) {
  const want = expected[rule.when];
  if (want === undefined) continue;
  const section = parsed?.sections?.[rule.field] ?? null;
  if (section === null) {
    check(rule.checkId, "scenario", false, `${rule.field} is absent from the artifact`);
    continue;
  }

  const starts = [...section.matchAll(new RegExp(rule.itemPattern.source, "gm"))].map(
    (m) => m.index,
  );
  const items = starts.map((s, i) => section.slice(s, starts[i + 1] ?? section.length));

  if (want.count !== undefined) {
    check(
      `${rule.checkId}:count`,
      "scenario",
      items.length === want.count,
      `${rule.field} holds ${items.length} item(s), expected ${want.count}`,
    );
  }

  const incomplete = items.flatMap((item, i) => {
    const plainItem = plain(item);
    const missing = rule.subfields
      .filter((s) => !s.re.test(plainItem))
      .map((s) => s.label);
    return missing.length ? [`item ${i + 1} missing ${missing.join(", ")}`] : [];
  });
  check(
    `${rule.checkId}:subfields`,
    "scenario",
    items.length > 0 && incomplete.length === 0,
    items.length === 0
      ? `${rule.field} holds no recognisable items`
      : incomplete.length
        ? incomplete.join("; ")
        : `all ${items.length} item(s) carry ${rule.subfields.map((s) => s.label).join(" / ")}`,
  );
}

// ── report ──────────────────────────────────────────────────────────────────

const failed = results.filter((r) => !r.pass);
const report = {
  scenario,
  passed: failed.length === 0,
  counts: { total: results.length, passed: results.length - failed.length, failed: failed.length },
  disclosedFlags,
  results,
};
writeFileSync(join(runDir, "deterministic.json"), JSON.stringify(report, null, 2) + "\n");

console.log(`\ndeterministic checks — ${scenario}\n`);
for (const r of results) {
  console.log(`  ${r.pass ? "PASS" : "FAIL"}  ${r.id.padEnd(42)} ${r.detail}`);
}
console.log(
  `\n  ${report.counts.passed}/${report.counts.total} passed${
    failed.length ? ` — ${failed.length} FAILED` : ""
  }\n`,
);

process.exit(failed.length === 0 ? 0 : 1);
