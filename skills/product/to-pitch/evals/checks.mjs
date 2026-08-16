//
// to-pitch's deterministic-check pattern block.
//
// Every string the shared checker (`evals/harness/check.mjs`) matches against a
// to-pitch transcript or artifact lives here, so it can be tuned when the
// skill's phrasing legitimately changes without touching the harness or another
// skill's suite. The algorithms that consume these patterns — the
// disclosure-window scan, the structural attempt count, the candidate-round
// count, the decline loop — are shared and are not duplicated here.
//
// `to-vision`'s suite banked four false-failure lessons on its first run, and
// all four apply here unchanged. Each one is noted at the pattern it shapes.
// They are load-bearing; read the note before loosening one.
//
// LESSON — SKILL.md gives *example* wordings, not scripts ("adapted at runtime",
// "not a script read aloud", "Run the checks adaptively"). A pattern written
// against one sentence therefore grades a phrasing, not a behaviour. Every
// pattern below is aimed at the *family* of things a competent run would say,
// and is paired with an explicit negative set — the things a competent run says
// that must NOT match. Where the two pull against each other, the shape that
// resolves it is named in the comment.

// A "flag" is the skill naming a field and asserting it is weak.
//
// LESSON — negation guard. A *clean* gate-check reads "No flagged fields —
// Problem, Appetite, Solution sketch and the assumption all pass", which names
// every field in the artifact right beside the word "flagged" and would
// otherwise read as a flag on all of them. `negated` is what stops that, and it
// is why scenario 1's `assertZeroFlags` is a meaningful assertion rather than a
// coin flip.
//
// "unconfirmed" is in the positive set because Appetite's cap has its own
// disclosure wording, straight out of SKILL.md: "the Appetite is recorded as
// small, but you never confirmed that tier". Nothing there says "flagged".
export const flags = {
  positive:
    /(?:flagged\b|flagging\b|is (?:still )?(?:weak|vague|generic|soft)|still (?:fairly )?(?:generic|vague|soft|broad)|remains (?:generic|vague)|hit the cap|founder-unconfirmed|unconfirmed|never confirmed|didn'?t confirm|trimmed (?:it )?to)/i,
  negated:
    /\b(?:no|zero|none|not|without|nothing|non-)\b[^.]{0,40}\b(?:flag|weak|vague|generic|soft|unconfirmed)/i,

  // The single most load-bearing pattern in the suite. It locates the approval
  // request, which gates the whole flag/disclosure block; and under
  // `forbidApprovalRequest` it is the *only* thing standing between a skill that
  // wrongly offers approval (02b's gate failure, 04's refused session) and a
  // fully green run. SKILL.md's "Do you approve this pitch?" is an e.g., so this
  // matches the shape rather than the sentence: a modal + you/I, then some
  // form of "approve", then a question mark — plus the handful of fixed idioms
  // ("ready to approve", "please approve") that carry no modal.
  //
  // Two guards keep it from firing on correct behaviour:
  //
  //   - **the vision guard.** 04's correct refusal *tells the founder to go
  //     approve the vision* ("Would you like to approve the vision and come
  //     back?"), and 01's opening turn reports "vision.md is approved by Dana
  //     Okafor". Both name approval, neither offers it. Any window that reaches
  //     the word "vision" is therefore not a pitch-approval request.
  //   - **the question mark.** "Recording this as approved." is the confirm-back
  //     *after* approval, not a request for it. Requests ask.
  //
  // The windows are `[^.!?]`-bounded, which also makes this markdown-tolerant —
  // "Do you *approve* this pitch?" matches with the emphasis still in place.
  // That matters because check.mjs tests this one pattern against the raw turn
  // text rather than the stripped text (see the emphasis lesson below).
  approvalRequest:
    /\b(?:do|does|would|will|can|could|shall|should|may)\s+(?:you|i)\b(?:(?!\bvision\b)[^.!?]){0,100}\bapprov(?:e|es|al|ed)\b(?:(?!\bvision\b)[^.!?]){0,60}\?|\bare you\s+(?:happy|ready|good|ok(?:ay)?|comfortable)\b(?:(?!\bvision\b)[^.!?]){0,60}\bapprov|\bready to approve\b(?!\s+(?:the\s+|your\s+)?vision)|\bplease approve\b(?!\s+(?:the\s+|your\s+)?vision)|\bis\s+(?:this|it|that|the\s+(?:pitch|draft))\b[^.!?]{0,40}\bapproved\b[^.!?]{0,40}\?|\b(?:i'?ll|i can|i could|happy to)\s+record\b(?:(?!\bvision\b)[^.!?]){0,60}\bas approved\b/i,
};

// The base question that opens each field, in the order SKILL.md asks them —
// Problem, then Appetite *second* (the budget is fixed before the solution is
// shaped), then the rest in document order.
//
// LESSON — count attempts structurally, not by keyword. Attempts on a field are
// the agent turns between that field's base question and the next field's. That
// matters more here than it did for to-vision: the falsifiability chain's three
// checks ("what's X, and what's Y in a number?", "what would prove you wrong?",
// "how could you test this in under an hour?") share no vocabulary with the
// base question *or with each other*, and they spend one shared 2-attempt
// budget that is a different counter from the per-field escalation cap. A
// keyword tally would read them as three unrelated topics and count none of
// them.
//
// LESSON — a field *name* is not a field *question*. These patterns locate the
// window every attempt count is measured inside, so a pattern that also matches
// a passing mention silently shifts the window and every count built on it. An
// earlier draft used bare `/\brabbit holes?\b/`, `/\bno-?gos?\b/` and
// `/\bopen questions?\b/`; graded against the recorded 01 run those matched
// turns [7,10], [8,10] and [4,6,9,10] respectively — the assembled draft's own
// `##` headings, and two turns where the skill merely *parked* something for
// Open Questions. Same list drives `forbidInterviewQuestions` (04), where a
// refusal that helpfully lists what a pitch session would have covered has to
// stay clean. So every field-name alternative below is interrogative: the noun
// close after a question word, and a question mark close after the noun. The
// phrase alternatives ("eat unplanned time", "still unresolved") carry the
// verbatim case and need no such guard.
//
// Each pattern is anchored on wording SKILL.md actually uses, plus alternates
// for the phrasing latitude the skill is explicitly given. Graded against the
// recorded 01 transcript each of these matches exactly one agent turn, except
// Riskiest Assumptions, which correctly matches two — see below.
export const baseQuestions = [
  [
    "Problem",
    /\bspecific pain\b|\bwhat(?:'s| is) the pain\b|\bpain\b[^.?!]{0,80}(?:in (?:their|her|his|your) (?:own )?words|this (?:particular )?bet goes after)|\bwhat (?:problem|pain)\b[^.?!]{0,100}\b(?:solv\w+|goes after|this bet|in (?:their|her|his|your) (?:own )?words)\b[^.?!]{0,60}\?/i,
  ],
  // The two-tier offer is the signature, not the word "appetite" — which the
  // skill legitimately repeats when it frames the Solution sketch ("At a small
  // appetite — two weeks — what are you actually building?"). So the tier
  // alternatives require *both* tiers, or the tier word next to its bound.
  [
    "Appetite",
    /\bwilling to spend\b|\bstop and reassess\b|\bwhich tier\b|\btwo[- ]weeks?\b[^.?!]{0,80}\bsix\b[^.?!]{0,60}\?|\b(?:small|big)\b[^.?!]{0,40}\b(?:two[- ]weeks?|six weeks?)\b[^.?!]{0,60}\b(?:big|small)\b/i,
  ],
  [
    "Solution sketch",
    /\b(?:what|which)\b[^.?!]{0,40}\b(?:are you|you'?re|you'?d be|do you)\b[^.?!]{0,20}\bbuild(?:ing)?\b|\bat a (?:small|big) appetite\b/i,
  ],
  // Deliberately just the "sink" phrasing. SKILL.md opens this field with "the
  // one thing that, if it turned out to be false, would sink this?" and asks
  // for each replacement candidate with "what else, then, would sink this if it
  // turned out to be false?" — so one match is one candidate, which is exactly
  // what candidateRounds counts. Against the recorded 01 run this matches agent
  // turns [4,6], and both are wanted: turn 6 is the replacement re-ask.
  //
  // What must NOT match is the chain's three follow-up steps. Two of them are
  // safe by vocabulary — quantification and cheap-test share no words with
  // this. The can't-fail screen is the dangerous one, because it re-uses the
  // founder's own phrase: "what would you see only if the thing you say would
  // sink this really did?" scored a spurious 4th opening on 02b, whose entire
  // point is that the count is exactly 3. Two things separate a solicitation
  // from that: a solicitation asks *for* something ("what's the one thing…",
  // "what else…", "anything else…") and ends in a question mark shortly after
  // "would sink"; a chain follow-up refers back to what the founder already
  // said. Hence the interrogative lead, the trailing `?`, and the tempered
  // window that refuses to cross "you say / you said / you see / you named".
  // "the whole bet" is in the target list because "sink the whole bet" is an
  // ordinary way to say it.
  [
    "Riskiest Assumptions & Cheap Validation Plan",
    /\b(?:what|which|anything|something|is there|tell me|name)\b(?:(?!\byou(?:'?d| would| will| can)? (?:say|said|see|saw|named|gave|mention|mentioned|call|called|think)\b|\bthe thing you\b)[^.?!]){0,90}\bwould sink\s+(?:this|it|that|the\s+(?:idea|bet|thing|whole\s+(?:thing|bet|idea)))\b[^.?!]{0,80}\?/i,
  ],
  [
    "Rabbit Holes",
    /\beat unplanned time\b|\bunplanned time or complexity\b|\b(?:what|which|any|anything|where)\b[^.?!]{0,40}\brabbit holes?\b[^.?!]{0,60}\?/i,
  ],
  [
    "No-gos",
    /\bexplicitly not part of this\b|\bassume is included\b|\b(?:explicitly|deliberately) (?:not part of|out of scope|excluded)\b|\bassum\w+\b[^.?!]{0,40}\b(?:is included|in scope|part of this)\b|\b(?:what|which|any|anything)\b[^.?!]{0,40}\bno-?gos?\b[^.?!]{0,60}\?/i,
  ],
  [
    "Open Questions",
    /\bstill unresolved\b|\bstill (?:open|outstanding)\b[^.?!]{0,60}\?|\broadmap stage\b[^.?!]{0,60}\?|\b(?:what|which|any|anything)\b[^.?!]{0,40}\bopen questions?\b[^.?!]{0,60}\?/i,
  ],
];

// The `/domain-modeling` "sharpen fuzzy language" move, which SKILL.md fires
// *independently* of every escalation path — "it's independent of, and can fire
// alongside or apart from, any other sharpness handling elsewhere in this
// document". `attemptsOn()` counts every `?`-bearing turn inside a field
// window, so without this a mandated sharpening reads as an escalation:
// confirmed live in the 01 run, where the Solution sketch scored 2 asks off a
// first-try-clean answer because "the file arrives at onboarding" is SKILL.md's
// own worked example of an overloaded term.
//
// The move's characteristic form is a *term* being named and precise
// alternatives being proposed — "You said 'the practice' — do you mean the
// clinic as an organization, or the person running it?" Matching only the
// disambiguation half would swallow ordinary re-asks that happen to offer a
// choice (Appetite's "small, or big?"), so both halves are required: a
// reference to the founder's own wording (you said / that word / one word / the
// term) *and* an offer of alternatives. `[^!?]` rather than `[^.?!]` because
// the quoted term routinely ends in a full stop before the question begins:
// `you said the file arrives "at onboarding." Do you mean…`.
//
// The harness treats this pattern's absence as "exclude nothing", so a miss
// costs an inflated attempt count, not a wrong verdict.
export const sharpeningQuestion =
  /\b(?:you\s+(?:said|used|called it|mentioned|wrote)|one word|a word|the word|that\s+(?:word|term|phrase)|your\s+(?:word|term|phrase))\b(?:[^!?]){0,220}?\b(?:do you mean|did you mean|which (?:of (?:those|these)|sense|one)|means?\s+(?:two|more than one)\s+things?)\b|\b(?:what|which) do you mean by\b|\b(?:could|might|can) mean\b[^!?]{0,140}?\bor\b[^!?]{0,80}\?/i;

// LESSON — match the persona's *imperative*, not its topic. A loose topic match
// once picked the wrong turn entirely in to-vision's suite and graded the reply
// to an unrelated question. Both pushes below are recognised by what the
// founder is *telling the agent to do* — sequence these, run that survey — not
// by the fact that sequencing or surveys came up.
export const declinePatterns = {
  "roadmap-creep": {
    push: /(sequence (?:this|these|it|them) against|rank (?:these|them|the three)|which (?:one )?(?:to|should i) build first|tell me which to build first|priorit(?:ise|ize) (?:this|these|them)|put (?:some |rough )?dates on|order (?:these|them|my pitches))/i,
    decline:
      /(to-roadmap'?s job|that'?s\s+\/?to-roadmap|\/to-roadmap\b|not (?:what )?this session|isn'?t (?:what )?this session|out of scope|different skill|separate (?:skill|step|session)|(?:won'?t|can'?t|not going to|i'?m not going to) (?:sequence|order|rank|priorit(?:ise|ize)|compare|hand you|give you|produce)|(?:isn'?t|is not|not) (?:mine|ours|this session'?s) to (?:write|do|decide|give)|one bet[^.]{0,60}own terms|comparing bets|once each of them (?:has|have) been shaped)/i,
  },
  "execute-validation": {
    push: /((?:go|just) run (?:the|that|this|it)\b|run (?:the|that|it)[^.]{0,60}(?:and )?(?:tell|report|come back|let me know)|build (?:the|a) prototype and (?:report|tell)|tell me what happened|come back with (?:what|the numbers)|email the (?:twenty|20|clinic))/i,
    decline:
      /((?:won'?t|can'?t|not going to|i'?m not going to|i don'?t) (?:run|execute|go run|build|gather|carry out|send)|(?:doesn'?t|does not) run (?:tests|surveys|the test)|this session (?:doesn'?t|does not|can'?t)|decline to execute|stays? a (?:stated )?plan|stated plan|records? (?:the |a )?plan|never a reported result|you'?(?:d|ll) run (?:it|the (?:survey|test)))/i,
  },
};

// to-roadmap's field vocabulary must not leak into a pitch — the exact mirror
// of the way to-vision keeps *pitch* vocabulary out of a vision (#15, #47).
//
// Two of the four terms have innocent everyday uses in a pitch conversation,
// and a naive word-boundary pattern on either would fail every correct run:
//
//   "moves"      — an ordinary English verb. "The schedule rebuilds itself when
//                  a therapist moves a slot" is a pitch sentence, not a leak.
//                  Scoped to a `## Moves` section, the same way to-vision scopes
//                  the bare word "Problem" to `## Problem`.
//
//   "thresholds" — the falsifiability chain elicits a **threshold** for every
//                  single assumption, and `**Threshold:**` is a literal line in
//                  SKILL.md's artifact template. A bare /\bthreshold\b/ would
//                  fail all four scenarios that write an artifact. Only the full
//                  phrase "Evidence Threshold" is to-roadmap's.
//
// "Strategic Frame" and "Target Check-in" are multi-word and have no innocent
// reading, so those match as phrases.
export const forbiddenVocabulary = {
  when: "forbidRoadmapVocabulary",
  checkId: "scenario/no-roadmap-vocabulary",
  label: "to-roadmap vocabulary",
  terms: [
    { term: "Strategic Frame", re: /\bstrategic frames?\b/i },
    { term: "Moves (as its own section)", re: /^##\s*moves\s*$/im },
    { term: "Evidence Threshold", re: /\bevidence thresholds?\b/i },
    { term: "Target Check-in", re: /\btarget check-?ins?\b/i },
    { term: "Check-ins (as its own section)", re: /^##\s*(?:target )?check-?ins?\s*$/im },
  ],
};

// Whether any assumption survived to the artifact at all is the whole point of
// 02b, so a scenario can assert it either way by name.
export const fieldPresence = [
  {
    when: "riskiestAssumptions",
    field: "Riskiest Assumptions & Cheap Validation Plan",
    checkId: "scenario/riskiest-assumptions",
  },
];

// Each surviving assumption is recorded as four explicit parts. SKILL.md: "an
// assumption missing its threshold, test, or timebox isn't a shorter
// assumption, it's an unfinished one" — so this is a presence test per item,
// not per field. Markdown is stripped by the harness before matching (see the
// emphasis lesson below), which is what lets `**Claim:**` match /claim\s*:/.
export const fieldItems = [
  {
    when: "assumptionItems",
    field: "Riskiest Assumptions & Cheap Validation Plan",
    checkId: "scenario/assumption-item",
    itemPattern: /^[ \t]*\d+\.\s+/,
    subfields: [
      { label: "claim", re: /\bclaim\s*:/i },
      { label: "threshold", re: /\bthreshold\s*:/i },
      { label: "test", re: /\btest\s*:/i },
      { label: "timebox", re: /\btimebox\s*:/i },
    ],
  },
];

// LESSON — strip markdown before matching. The harness does this for every
// prose match, including the ones below; the skill emphasises heavily
// ("**Threshold:**", "*before* we shape the solution"), which silently broke
// naive word-boundary patterns the first time a suite of this shape ran.
//
// Named must / must-not assertions, each opted into by a scenario setting its
// `when` key. Everything here is a fact about the *outcome* a scenario
// specifies, not a restatement of the shared floor.
export const assertions = [
  // 02a — the Appetite cap records the tighter tier and says so. Two separate
  // facts: what landed in the artifact, and what the founder was told.
  {
    when: "appetiteRecordedSmall",
    checkId: "scenario/appetite-recorded-small",
    source: "artifact",
    field: "Appetite",
    must: /\bsmall\b/i,
    label: "the Appetite recorded as the tighter 'small' tier",
  },
  {
    when: "appetiteFounderUnconfirmed",
    checkId: "scenario/appetite-founder-unconfirmed",
    source: "transcript",
    speaker: "agent",
    must: /\bappetite\b[^.?!]{0,140}(?:founder-unconfirmed|unconfirmed|never confirmed|didn'?t confirm|provisional|you didn'?t (?:pick|commit))|(?:founder-unconfirmed|never confirmed|didn'?t confirm|provisionally record)[^.?!]{0,140}\bappetite\b/i,
    label: "the Appetite disclosed as founder-unconfirmed",
  },

  // 03a — "no ordering content anywhere in the output" (#59). Scoped to
  // orderings *of bets against each other*, which is what to-roadmap owns.
  // Deliberately not matching bare quarters or dates: an assumption's timebox
  // is legitimately "by the end of Q3", and a pattern that failed on that would
  // fail correct runs of every other scenario too.
  //
  // Nor does it match ordering *within* the one bet. A Solution sketch saying
  // "ship the suggestion strip first, then add auto-booking", or a Problem
  // naming who decides "in what order" slots surface, is describing the shape
  // of this bet — not ranking it against another. An earlier draft matched both
  // and would have false-failed 03a in particular, whose whole subject is a
  // ranked list of scheduling candidates: the check was aimed at itself.
  // Cross-bet ordering always has to name the other bets to mean anything, so
  // that is what these alternatives require.
  {
    when: "forbidSequencingContent",
    checkId: "scenario/no-sequencing-content",
    source: "artifact",
    mustNot:
      /\bsequenc(?:e|es|ed|ing)\s+(?:this|these|them|the\s+(?:pitches|bets|ideas|work))\b|\bpriorit(?:is|iz)(?:e|ed|ation)\s+(?:this|these|them|against)\b|\bbuild (?:this|that|it) first\b|\b(?:first|second|third|next|then|after|before|alongside)\b[^.?!]{0,60}\b(?:other|another|second|third|remaining)\s+(?:(?:two|three|four|\d+)\s+)?(?:pitch|bet|idea)e?s?\b|\b(?:pitch|bet|idea)e?s?\b[^.?!]{0,40}\bin (?:what|which|this|priority) order\b/i,
    label: "cross-bet sequencing or ordering content",
  },

  // 03b — the test field is a stated plan, never a reported result. Narrow on
  // purpose: it names *outcomes being reported*, not tests being planned, so a
  // correct "email twenty office managers one question by Friday" cannot trip
  // it while "the survey came back at 40%" cannot escape it.
  {
    when: "testIsStatedPlan",
    checkId: "scenario/test-is-a-stated-plan",
    source: "artifact",
    field: "Riskiest Assumptions & Cheap Validation Plan",
    mustNot:
      /\b(?:results?|responses?|replies) (?:came back|showed|indicated|were)\b|\bwe (?:already )?(?:ran|surveyed|tested|asked)\b|\b\d+\s*(?:%|percent) of (?:respondents|those|the people)\b|\bthe (?:survey|test|prototype) (?:found|showed|came back|told us)\b/i,
    label: "a reported validation result where a stated plan belongs",
  },

  // 04 — the refusal has to name *why*. "I can't help with that" would satisfy
  // "no artifact, no questions" while telling the founder nothing actionable,
  // and leaving them with one clear next action is the stated point of the gate.
  {
    when: "refusalNamesMissingApproval",
    checkId: "scenario/refusal-names-missing-approval",
    source: "transcript",
    speaker: "agent",
    must: /(vision[^.!?]{0,140}(?:isn'?t|is not|hasn'?t been|has not been|not(?: yet)?) approved|(?:no|missing|absent|without)[^.!?]{0,60}approval marker|approve the vision (?:first|before)|unapproved vision|vision[^.!?]{0,80}(?:needs|has) to be approved)/i,
    label: "a refusal naming the vision's missing approval",
  },
];
