#!/usr/bin/env node
//
// Deterministic checks for one to-vision eval run.
//
//   node check.mjs <scenario-id>
//
// Mechanical and judgment-free, per ADR 0003 — the other half of the grade is
// the LLM judge (judge.sh + rubric.md). Everything here is a structural or
// string-level test over the run directory produced by run-scenario.sh.
//
// Reads  evals/runs/<scenario-id>/{run,transcript,toolcalls}.json, artifact.md
// Writes evals/runs/<scenario-id>/deterministic.json
// Exits  0 if every check passed, 1 otherwise.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HARNESS = dirname(fileURLToPath(import.meta.url));
const EVALS = dirname(HARNESS);

const scenario = process.argv[2];
if (!scenario) {
  console.error("usage: check.mjs <scenario-id>");
  process.exit(2);
}

const runDir = process.env.EVAL_OUT_DIR ?? join(EVALS, "runs", scenario);
const scenarioDir = join(EVALS, "scenarios", scenario);
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
const founderTurns = transcript.filter((t) => t.speaker === "founder");
const agentText = agentTurns.map((t) => t.text).join("\n\n");

// ── artifact parsing ────────────────────────────────────────────────────────

const STORED_FIELD_ORDER = [
  "Vision Statement",
  "Customer & Problem",
  "Future State",
  "Grounding Insight",
  "Why Us / Why Now",
  "Additional Grounding",
  "Vision Pivot Trigger",
];
const MANDATORY_FIELDS = STORED_FIELD_ORDER.filter(
  (f) => f !== "Additional Grounding",
);
const ALLOWED_FRONTMATTER = [
  "approved_by",
  "approved_at",
  "revised_at",
  "revision_reason",
];

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

// Normalise the Why Us / Why Now heading, whose spacing around the slash is the
// one place the spec's own prose varies ("Why Us/Why Now" vs "Why Us / Why Now").
const normField = (s) => s.replace(/\s*\/\s*/g, " / ").trim();

// ── shared floor 1 — approval-marker state (#9) ─────────────────────────────

// An expectation that is *omitted* from expect.json is not asserted. Ordinary
// scenarios name every outcome; a diagnostic scenario (see README) deliberately
// leaves the contested ones out, so only the invariants that hold whichever way
// the open design question lands are checked.

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

  // A never-revised vision omits the revision pair entirely (SKILL.md).
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

  // to-vision embeds grilling and domain-modeling; it invokes nothing (#18).
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

  // Automated research is out of scope for the runtime skill (#47, story 30).
  const research = names.filter((n) => n === "WebSearch" || n === "WebFetch");
  check(
    "floor/no-research-tools",
    "floor",
    research.length === 0,
    research.length
      ? `used research tools: ${[...new Set(research)].join(", ")}`
      : "no research tools used",
  );

  // to-vision never reads or writes CONTEXT.md / CONTEXT-MAP.md (story 27).
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

  // The sharpening's only output is better field prose — no glossary artifact.
  const strayFiles = workspaceFiles.filter(
    (f) => f !== "./docs/product/vision.md",
  );
  check(
    "floor/no-stray-artifacts",
    "floor",
    strayFiles.length === 0,
    strayFiles.length
      ? `wrote files beyond the vision artifact: ${strayFiles.join(", ")}`
      : "no stray files written",
  );
}

// ── shared floor 3 — artifact fields match the #15 schema ───────────────────

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

// Markdown emphasis is stripped before every prose match below. The skill
// bolds and italicises heavily ("has to be *your* belief"), which silently
// broke naive word-boundary patterns.
const plain = (s) => s.replace(/[*_`]+/g, "");

// A "flag" is the skill naming a field and asserting it is weak. The negation
// guard matters more than it looks: a clean gate-check reads "Gate-check: no
// flagged fields", which names every field beside the word "flagged".
const FLAG_POSITIVE =
  /(?:flagged\b|flagging\b|is (?:still )?(?:weak|vague|generic)|still (?:fairly )?(?:generic|vague|soft)|remains (?:generic|vague)|hit the cap)/i;
const FLAG_NEGATED =
  /\b(?:no|zero|none|not|without|nothing|non-)\b[^.]{0,40}\b(?:flag|weak|vague|generic)/i;

const APPROVAL_REQUEST =
  /\b(do you approve|approve this vision|are you happy to approve|ready to approve|would you like to approve|please approve)\b/i;

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

{
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

  // Only scenario 1 asserts zero flags — #19 specifies that for the
  // cooperative/sharp founder alone. A boundary-testing scenario is graded on
  // whether it declined, not on whether the artifact came out flag-free.
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
const BASE_QUESTIONS = [
  ["Customer & Problem", /who exactly is this for/i],
  ["Future State", /what does the world look like|2\s*[–-]\s*5 years/i],
  ["Grounding Insight", /one insight, trend, or technology bet/i],
  ["Why Us / Why Now", /why is now the moment|positioned to win/i],
  ["Additional Grounding", /anything else grounding this/i],
  ["Vision Statement", /say it in one line|amazon[- ]headline|headline version/i],
  ["Vision Pivot Trigger", /conclude this vision itself was wrong|fail to happen/i],
];

function attemptsOn(field) {
  const order = BASE_QUESTIONS.findIndex(([f]) => f === field);
  if (order === -1) return null;
  const opensAt = agentTurns.findIndex((t) =>
    BASE_QUESTIONS[order][1].test(plain(t.text)),
  );
  if (opensAt === -1) return null;

  // The first later turn that opens any subsequent field ends this field's run.
  let endsAt = agentTurns.length;
  for (let i = opensAt + 1; i < agentTurns.length; i++) {
    const text = plain(agentTurns[i].text);
    if (BASE_QUESTIONS.slice(order + 1).some(([, re]) => re.test(text))) {
      endsAt = i;
      break;
    }
  }
  return agentTurns
    .slice(opensAt, endsAt)
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

// ── scenario layer — boundary declines ──────────────────────────────────────

// The push patterns match the persona's *imperative*, not its topic. A loose
// topic match picked the wrong turn entirely: "the auditor asks for Q2 access
// reviews" in a Future State answer read as the roadmap push, so the check
// graded the reply to an unrelated question.
const DECLINE_PATTERNS = {
  "roadmap-creep": {
    push: /(turn (?:this|it) into[^.]{0,40}roadmap|next quarter'?s roadmap|give me the q[1-4]|skip the rest)/i,
    decline:
      /(not (?:what )?this session|isn'?t (?:what )?(?:this|a vision)|out of scope|to-roadmap'?s job|that'?s\s+\/?to-roadmap|not going to produce|won'?t produce|can'?t (?:do|build|produce|give you) (?:a |the )?(?:roadmap|features)|stay(?:ing)? (?:in|on) (?:vision|scope)|different skill|separate (?:skill|step))/i,
  },
  "self-serve-research": {
    push: /(research my competitors|figure out (?:what )?the market trend|pull the market|do a quick search)/i,
    decline:
      /(going to decline|i'?m not going to (?:go )?(?:research|invent|fabricate|pull)|won'?t (?:go )?research|can'?t (?:go )?research|has to be your|your own belief|needs to come from you|not mine to invent|(?:won'?t|can'?t|not going to) (?:make (?:that )?up|fabricate))/i,
  },
};

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

// ── scenario layer — to-pitch vocabulary must not leak (#15, #47) ───────────

if (expected.forbidPitchVocabulary && parsed) {
  // "Problem" is excluded as a bare word: it is legitimately half of the
  // "Customer & Problem" field name. It is only a leak as its own section.
  const PITCH_VOCAB = [
    { term: "Problem (as its own section)", re: /^##\s*Problem\s*$/im },
    { term: "Appetite", re: /\bappetite\b/i },
    { term: "Solution sketch", re: /\bsolution sketch(?:es)?\b/i },
    { term: "Riskiest Assumption", re: /\briskiest assumptions?\b/i },
    { term: "Rabbit Hole", re: /\brabbit holes?\b/i },
    { term: "No-go", re: /\bno-?gos?\b/i },
    { term: "Open Question", re: /\bopen questions?\b/i },
  ];
  const leaked = PITCH_VOCAB.filter((v) => v.re.test(artifact)).map(
    (v) => v.term,
  );
  check(
    "scenario/no-pitch-vocabulary",
    "scenario",
    leaked.length === 0,
    leaked.length
      ? `to-pitch vocabulary leaked into the vision: ${leaked.join(", ")}`
      : "no to-pitch vocabulary in the artifact",
  );
}

// ── scenario layer — grounding insight presence ─────────────────────────────

if (expected.groundingInsight !== undefined) {
  const gi = parsed?.sections?.["Grounding Insight"] ?? null;
  const wantPresent = expected.groundingInsight === "present";
  const isPresent = Boolean(gi && gi.trim().length > 0);
  check(
    "scenario/grounding-insight",
    "scenario",
    isPresent === wantPresent,
    `expected Grounding Insight ${expected.groundingInsight}, found ${
      isPresent ? "present" : "absent"
    }`,
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
