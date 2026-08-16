//
// The expect.json contract: which keys a scenario may declare, and the rule
// that every declared key must actually grade something.
//
// The suite's convention has always been the first half of this — "an
// expectation omitted from expect.json is not asserted". What nothing enforced
// is the second half: an expectation *present* in expect.json must assert.
// Four shapes of silent no-op were all in the tree at once, and all four read
// as assertions in review:
//
//   "cappedAttempts": {}            iterates zero times
//   "declines": []                  loops over nothing
//   "mandatoryFieldsPresent": false takes the trivially-true branch
//   "outcome": "gate-failed"        a value no code path reads
//
// That is how a scenario whose whole point is "the skill must refuse" scored
// 11 of 12 against an empty transcript. So the rule now is: a declared key that
// registers no check is a hard error, and a key deliberately meaning "not
// asserted" must be *absent* — not present-and-empty, not `false`.
//
// The other half is symmetric and cheaper: an **unrecognised** key is also a
// hard error. A key no check reads is either a typo or an expectation left
// behind by a feature that was removed, and both look exactly like an assertion
// to a reviewer.
//
// check.mjs attributes every check it registers to the key that asked for it
// and hands the tally here. Which means the enforcement is real rather than a
// second, drifting list of "keys that ought to do something".

// Keys the checker never reads. Some are identity and provenance, some are
// consumed by another harness entry point (seeds.mjs, judge.mjs,
// summarize.mjs). Enumerated rather than allowed by default, because the whole
// point is that an unknown key is a finding.
export const METADATA_KEYS = {
  id: "scenario id; matches the directory name",
  category: "grouping label for the suite table",
  title: "one line stating the scenario's specified outcome",
  source: "the ticket or spec section this scenario comes from",
  notes: "free prose — the place to say something that is not an assertion",
  workspace: "seed overrides, merged per destination by seeds.mjs",
  humanSpotCheckRequired: "judge.mjs routes this run to a human",
  diagnostic: "summarize.mjs reports but does not gate this scenario",
  diagnosticQuestion: "what a diagnostic scenario exists to answer",
};

// Keys check.mjs reads, each of which must register at least one check.
// The text is what a scenario author sees when they misspell one.
export const ASSERTING_KEYS = {
  outcome: 'only "approved" asserts — it requires an explicit approval request',
  artifact: '"written" | "not-written" — whether the artifact exists',
  approvalMarker: '"present" | "absent" — the approved_by/approved_at pair',
  approverName: "who approved_by must name; also asserts the timestamp is ISO 8601",
  upstreamResolvesTo: "where the artifact's one-hop upstream pointer must land",
  mandatoryFieldsPresent: "true — every mandatory `##` section is present and the artifact exists",
  flaggedFields: "non-empty list of fields the skill must disclose as weak before asking for approval",
  assertZeroFlags: "true — the skill disclosed no weak field at all",
  forbidApprovalRequest: "true — approval must never be offered",
  cappedAttempts: "non-empty { field: follow-ups } — each field asked exactly 1 + follow-ups times",
  candidateRounds: "{ field, candidates, maxAttemptsPerCandidate } — replacement rounds inside one field",
  forbidInterviewQuestions: "true — no base question was asked at all",
  forbidTools: "non-empty list of tool names the session must not call",
  declines: "non-empty list of declinePatterns names from checks.mjs",
  maxAgentTurns: "integer — at most this many agent turns, and at least one",
  minAgentTurns: "integer — at least this many agent turns",
};

// Keys whose *value* is a closed vocabulary. A typo in one of these reads as
// the opposite assertion rather than as an error: `"artifact": "writen"` is not
// `"written"`, so it silently asserts that no artifact was produced.
export const VALUE_RULES = {
  outcome: {
    allowed: ["approved"],
    hint:
      'Only "approved" grades anything — it registers the "approval was' +
      ' explicitly requested" check. Every other outcome is asserted through the' +
      " keys that can actually see it: `artifact`, `approvalMarker`," +
      " `forbidApprovalRequest`, `maxAgentTurns`, and a checks.mjs transcript" +
      " assertion naming the reason the founder was given. Put the prose" +
      ' description in "title" or "notes".',
  },
  artifact: { allowed: ["written", "not-written"] },
  approvalMarker: { allowed: ["present", "absent"] },
};

// Every key this suite recognises as asserting, including the ones the *skill*
// declares. A skill's checks module names its own expect.json keys — the `when`
// of a vocabulary rule, a field-presence rule, a named assertion, a field-items
// rule — so the recognised set cannot be a constant.
export function recognisedAssertingKeys(checks) {
  const known = new Map(Object.entries(ASSERTING_KEYS));
  const add = (key, what) => {
    if (key) known.set(key, `${what} (declared by this skill's checks.mjs)`);
  };
  if (checks.forbiddenVocabulary) {
    add(checks.forbiddenVocabulary.when, `true — ${checks.forbiddenVocabulary.label} must not appear`);
  }
  for (const r of checks.fieldPresence ?? []) add(r.when, `"present" | "absent" — ${r.field}`);
  for (const r of checks.assertions ?? []) add(r.when, `true — ${r.label}`);
  for (const r of checks.fieldItems ?? []) add(r.when, `{ count } — items inside ${r.field}`);
  return known;
}

// `registered` is a Map of expect.json key → how many checks it registered
// against this run. Returns human-readable errors; an empty array means the
// scenario's expectations are all live.
export function validateExpectations({ expected, checks, registered }) {
  const asserting = recognisedAssertingKeys(checks);
  const errors = [];

  for (const key of Object.keys(expected)) {
    if (key in METADATA_KEYS) continue;
    if (!asserting.has(key)) {
      errors.push(
        `unrecognised key "${key}" — no check reads it. It is a typo, or an` +
          ` expectation left behind by a removed feature; either way it reads as` +
          ` an assertion and is not one. Delete it, or move the prose into "notes".`,
      );
      continue;
    }

    const rule = VALUE_RULES[key];
    if (rule && !rule.allowed.includes(expected[key])) {
      errors.push(
        `"${key}": ${JSON.stringify(expected[key])} is not one of ` +
          rule.allowed.map((v) => JSON.stringify(v)).join(", ") +
          (rule.hint ? `. ${rule.hint}` : "."),
      );
      continue;
    }

    if (!registered.get(key)) {
      errors.push(
        `"${key}": ${JSON.stringify(expected[key])} registered no check —` +
          ` it grades nothing while reading as an assertion. An expectation` +
          ` omitted from expect.json is not asserted, so say "not asserted" by` +
          ` leaving the key out; \`{}\`, \`[]\` and \`false\` do not say it.` +
          ` (${asserting.get(key)})`,
      );
    }
  }

  return errors;
}

// Printed after the error list, so a scenario author who mistyped a key can see
// the whole vocabulary without opening this file.
export function keyCatalogue(checks) {
  const asserting = recognisedAssertingKeys(checks);
  const line = ([k, v]) => `    ${k.padEnd(26)} ${v}`;
  return (
    "  asserting keys (each must register a check):\n" +
    [...asserting.entries()].map(line).join("\n") +
    "\n  metadata keys (never assert):\n" +
    Object.entries(METADATA_KEYS).map(line).join("\n")
  );
}
