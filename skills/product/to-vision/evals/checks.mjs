//
// to-vision's deterministic-check pattern block.
//
// Every string the shared checker (`evals/harness/check.mjs`) matches against a
// to-vision transcript or artifact lives here, in one place, so it can be tuned
// when the skill's phrasing legitimately changes without touching the harness
// or any other skill's suite. The algorithms that consume these patterns —
// disclosure-window scanning, structural attempt counting, the decline loop —
// are shared and are not duplicated here.
//
// Three lessons from the first suite run are baked into the patterns below,
// because each one produced a false failure against a skill that had behaved
// correctly. They are load-bearing; read the note before loosening one.

// A "flag" is the skill naming a field and asserting it is weak.
//
// The negation guard matters more than it looks: a clean gate-check reads
// "Gate-check: no flagged fields", which names every field beside the word
// "flagged" and would otherwise read as a flag on all of them.
export const flags = {
  positive:
    /(?:flagged\b|flagging\b|is (?:still )?(?:weak|vague|generic)|still (?:fairly )?(?:generic|vague|soft)|remains (?:generic|vague)|hit the cap)/i,
  negated:
    /\b(?:no|zero|none|not|without|nothing|non-)\b[^.]{0,40}\b(?:flag|weak|vague|generic)/i,
  approvalRequest:
    /\b(do you approve|approve this vision|are you happy to approve|ready to approve|would you like to approve|please approve)\b/i,
};

// The base question that opens each field. Attempts are counted as the agent
// turns between a field's base question and the next field's, so this list must
// stay in the order the skill asks them. Keyword tallies were tried first and
// got it wrong twice: escalations are worded as swap-tests sharing no
// vocabulary with the base question, and incidental later mentions of a field
// name inflate the count.
export const baseQuestions = [
  ["Customer & Problem", /who exactly is this for/i],
  ["Future State", /what does the world look like|2\s*[–-]\s*5 years/i],
  ["Grounding Insight", /one insight, trend, or technology bet/i],
  ["Why Us / Why Now", /why is now the moment|positioned to win/i],
  ["Additional Grounding", /anything else grounding this/i],
  ["Vision Statement", /say it in one line|amazon[- ]headline|headline version/i],
  ["Vision Pivot Trigger", /conclude this vision itself was wrong|fail to happen/i],
];

// Boundary pushes match the persona's *imperative*, not its topic. A loose
// topic match picked the wrong turn entirely: "the auditor asks for Q2 access
// reviews" in a Future State answer read as the roadmap push, so the check
// graded the reply to an unrelated question.
export const declinePatterns = {
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

// to-pitch's field vocabulary must not leak into a vision (#15, #47).
//
// "Problem" is excluded as a bare word: it is legitimately half of the
// "Customer & Problem" field name. It is only a leak as its own section.
export const forbiddenVocabulary = {
  when: "forbidPitchVocabulary",
  checkId: "scenario/no-pitch-vocabulary",
  label: "to-pitch vocabulary",
  terms: [
    { term: "Problem (as its own section)", re: /^##\s*Problem\s*$/im },
    { term: "Appetite", re: /\bappetite\b/i },
    { term: "Solution sketch", re: /\bsolution sketch(?:es)?\b/i },
    { term: "Riskiest Assumption", re: /\briskiest assumptions?\b/i },
    { term: "Rabbit Hole", re: /\brabbit holes?\b/i },
    { term: "No-go", re: /\bno-?gos?\b/i },
    { term: "Open Question", re: /\bopen questions?\b/i },
  ],
};

// Whether the Grounding Insight ever surfaced is the whole point of 02b, so a
// scenario can assert it either way by name.
export const fieldPresence = [
  {
    when: "groundingInsight",
    field: "Grounding Insight",
    checkId: "scenario/grounding-insight",
  },
];
