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
//
// Both personas say "interrupt with **something like**:" and "Say something
// like:", so a push pattern that demands the scripted sentence grades the
// improviser, not the skill. That is the more expensive direction to get wrong:
// on a push miss check.mjs `continue`s, silently skipping *both* the decline
// and the session-continued checks — one narrow regex switches the whole
// boundary layer off. So the pushes below match the request, however phrased.
//
// The declines pull the other way. A mention of `/to-roadmap` is not a decline:
// "I'll give you a rough ordering, though a fuller version is really
// /to-roadmap's job. Rescheduling first, onboarding second, reminders third."
// names the right skill while doing exactly what #59 forbids. So a decline has
// to carry an actual refusal — a refusal verb, or the work being assigned
// elsewhere — and the whole reply is disqualified up front if it also hands the
// founder the thing it claims not to do.
export const declinePatterns = {
  "roadmap-creep": {
    push: /\b(?:sequence|rank|priorit(?:is|iz)e)\b[^.?!]{0,60}\b(?:this|these|them|those|the\s+(?:three|two|others?)|my\s+(?:other\s+)?(?:two\s+|three\s+)?(?:pitch|bet|idea)\w*|against)\b|\border\s+(?:these|those|them|the\s+(?:three|two)|my\s+(?:other\s+)?(?:pitch|bet|idea)\w*)\b|\bline\s+(?:these|those|them|the)\b[^.?!]{0,25}\bup\b|\b(?:what|which|rough|some)\s+order\b|\bin\s+(?:what|which)\s+order\b|\bwhich\b[^.?!]{0,60}\b(?:build|do|ship|start|tackle|land|lands|go|goes|come|comes)\b[^.?!]{0,25}\bfirst\b|\b(?:build|do|ship|tackle)\s+(?:this|that|it)\b[^.?!]{0,20}\bfirst\b|\bput\s+(?:some\s+|rough\s+|real\s+|approximate\s+|a\s+few\s+)?dates?\b|\b(?:against|versus|vs\.?|compared\s+to|alongside)\s+(?:my|the|these|those)\s+(?:other\s+)?(?:two\s+|three\s+|couple\s+)?(?:pitch|bet|idea)\w*/i,
    decline:
      /^(?![\s\S]*(?:\b(?:i'?ll|i can(?!['’]?t\b)|i will|here'?s|let me|happy to)\b[^.?!]{0,40}\b(?:give you\s+|offer\s+|provide\s+|sketch\s+)?(?:a |the )?(?:rough |quick |informal |provisional |first )?(?:order|ordering|ranking|sequence|sequencing|priorit\w+)\b|\bfirst\b[^.?!]{0,60}\bsecond\b[^.?!]{0,60}\bthird\b))[\s\S]*?(?:\b(?:won'?t|will not|can'?t|cannot|not going to|i'?m not|i am not|don'?t|declin\w+)\b[^.?!]{0,80}\b(?:sequenc\w*|rank\w*|order\w*|priorit\w*|schedul\w*|compar\w*|date|dates|first)\b|\b(?:not|isn'?t|is not|outside)\b[^.?!]{0,60}\b(?:this session|what this session|mine to|ours to|a pitch session)\b|\b(?:sequencing|ordering|ranking|prioriti[sz]ing|comparing|scheduling|that work|that comparison)\b[^.?!]{0,80}\/?to-roadmap\b|\/?to-roadmap\b[^.?!]{0,60}\b(?:not|isn'?t|rather than|instead of)\b|\bout of scope\b|\bdifferent skill\b|\bseparate (?:skill|step|session)\b|\bone bet[^.]{0,60}own terms\b|\bcomparing bets\b|\bonce each of them (?:has|have) been shaped\b)/i,
  },
  "execute-validation": {
    push: /\b(?:go|just|please|why don'?t you|can you|could you|would you)\s+(?:go\s+|and\s+)?(?:run|send|email|survey|build|do|gather|collect|pull|ask)\b[^.?!]{0,90}\b(?:and\s+)?(?:tell|report|come back|let me know|show me|give me|see what)\b|\b(?:run|do|send|email)\s+(?:the|that|this|it|them)\b[^.?!]{0,90}\b(?:and\s+)?(?:tell|report|come back|let me know|see what|find out)\b|\btell me what happened\b|\bcome back with\b|\breport (?:the numbers|back)\b|\b(?:go|just)\s+run\s+(?:the|that|this|it)\b|\bjust run it\b|\bbuild (?:the|a|me a)\s+(?:quick\s+)?prototype\b[^.?!]{0,60}\b(?:report|tell|try|see|come back)\b|\bemail (?:the|them|those)\b[^.?!]{0,40}\b(?:twenty|20|office managers|one question)\b|\byou'?ll do it faster\b/i,
    // The generic alternates ("out of scope", "different skill", "yours to
    // do") are the ones roadmap-creep already had and this one lacked, which is
    // why "That's outside what this session does" and "Running it is yours to
    // do" both used to read as non-declines.
    //
    // The leading guard is narrow on purpose: it only disqualifies a reply that
    // *states a result it made up* ("I can't send emails from here, but
    // typically ~45% get claimed"), which is a decline in words and a
    // fabrication in substance. It does not disqualify numbers as such — a
    // decline legitimately reads the founder's own threshold back.
    decline:
      /^(?![\s\S]*\b(?:typically|usually|generally|normally|on average)\s*~?\s*\d+\s*(?:%|percent))[\s\S]*?(?:\b(?:won'?t|will not|can'?t|cannot|not going to|i'?m not|i am not|i don'?t|declin\w+)\b[^.?!]{0,60}\b(?:run|execute|send|email|survey|build|gather|collect|pull|carry out|report)\w*\b|\b(?:doesn'?t|does not|can'?t|cannot)\b[^.?!]{0,40}\b(?:run|execute|send|gather|gathering)\b|\bthis session (?:doesn'?t|does not|can'?t|cannot|isn'?t)\b|\b(?:outside|not|isn'?t|is not)\b[^.?!]{0,60}\b(?:what this session|this session|mine to|ours to|my job|a pitch session)\b|\byours to (?:do|run|carry out)\b|\b(?:you'?d|you'?ll|you) (?:run|send|do) (?:it|that|the (?:survey|test))\b|\byou'?(?:ll|d)\s+run\b|\bout of scope\b|\bdifferent skill\b|\bseparate (?:skill|step|session)\b|\bdecline to execute\b|\bstays? a (?:stated )?plan\b|\bstated plan\b|\brecords?\s+(?:the|a)\s+(?:stated\s+)?(?:plan|test)\b|\b(?:not|never)\s+a\s+(?:reported\s+)?result\b)/i,
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
// specifies, not a restatement of the shared floor. Two rules may share a
// `when` key: that is how one expectation gets asserted from both directions,
// with a distinct check id each so the report says which half failed.
export const assertions = [
  // 02a — the Appetite cap records the tighter tier and says so. Two separate
  // facts: what landed in the artifact, and what the founder was told.
  //
  // "the recorded tier is small" is not the same claim as "the word small
  // appears": a bare /\bsmall\b/ passes on "Big (≤6 weeks) — not small", which
  // is the exact failure the cap exists to prevent. What is actually being
  // asserted is that the *first* tier word in the field is the tighter one, so
  // the pattern reaches "small" only across text containing neither tier.
  {
    when: "appetiteRecordedSmall",
    checkId: "scenario/appetite-recorded-small",
    source: "artifact",
    field: "Appetite",
    must: /^(?:(?!\b(?:small|big)\b)[\s\S])*\bsmall\b/i,
    label: "the Appetite recorded as the tighter 'small' tier",
  },
  // The disclosure is two clauses, and SKILL.md doesn't say they share a
  // sentence. "Appetite — flagged. You never confirmed a tier, so I recorded
  // small provisionally." is the natural way to write it and the old
  // `[^.?!]{0,140}` window could not cross that full stop — 3 of 6 realistic
  // phrasings missed. `[^!?]` crosses sentence boundaries but not turn-level
  // topic breaks, and the window is lazy so it binds to the nearest disclosure
  // rather than to something 200 characters away. "committed" is deliberately
  // only reachable via "never committed" / "didn't commit": a clean gate-check
  // says "Appetite is a committed tier, not an estimate", and that is the
  // opposite of this flag.
  {
    when: "appetiteFounderUnconfirmed",
    checkId: "scenario/appetite-founder-unconfirmed",
    source: "transcript",
    speaker: "agent",
    must: /\bappetite\b[^!?]{0,180}?\b(?:founder-unconfirmed|unconfirmed|never confirmed|never (?:picked|committed|chose|landed on)|didn'?t (?:confirm|pick|commit|choose|land on)|did not (?:confirm|pick|commit|choose)|provisional(?:ly)?|defaulted to)\b|\b(?:founder-unconfirmed|never confirmed|never (?:picked|committed|chose)|didn'?t (?:confirm|pick|commit)|provisional(?:ly)?|defaulted to)\b[^!?]{0,180}?\bappetite\b/i,
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
  // ranked list of scheduling candidates: the check was aimed at itself. That
  // narrowing still stands, and one of its casualties has been repaired: the
  // narrowed pattern also fired on "prioritise these over merely-open slots",
  // an ordinary Solution-sketch sentence for scheduling software, because it
  // asked only for `priorit… these` with no sibling named at all. Every
  // alternative below now requires a sibling.
  //
  // Cross-bet ordering always has to name the other bet to mean anything — but
  // it names it the way a founder would, not with the word "bet" in it. The
  // narrowed pattern demanded the generic nouns `pitch|bet|idea` and so missed
  // every real leak in 03a: "before the self-serve onboarding flow",
  // "onboarding is second and reminders third", "lands end of March, onboarding
  // late April". So the sibling set is both: the generic nouns *and* 03a's own
  // other two bets, which are fixed by its persona (a self-serve onboarding
  // flow, a patient-reminder rework). `forbidSequencingContent` is opted into
  // by that scenario alone, so the coupling is contained — but if the persona's
  // other two bets are ever renamed, rename them here too.
  //
  // Bare "onboarding" is only a sibling in the ordinal alternatives ("onboarding
  // is second"), never in the before/after ones: "the credentialing file the
  // clinic uploads at onboarding" is legitimate Solution-sketch prose in this
  // very fixture, and only the full phrase distinguishes the bet from the
  // moment.
  {
    when: "forbidSequencingContent",
    checkId: "scenario/no-sequencing-content",
    source: "artifact",
    mustNot:
      /\b(?:sequenc\w+|rank\w*|priorit(?:is|iz)\w+)\b[^.?!]{0,60}\b(?:(?:the|my|your|these|those|all)\s+)?(?:other\s+|remaining\s+|two\s+|three\s+)?(?:(?:pitch|bet|idea|initiative)\w*|onboarding|reminders?)\b|\b(?:onboarding|reminders?|(?:pitch|bet|idea)\w*)\b[^.?!]{0,40}\b(?:is|are|goes?|comes?|lands?|ships?)\s+(?:first|second|third|fourth|next|last)\b|\b(?:self-serve\s+onboarding(?:\s+flow)?|onboarding\s+(?:flow|rework|bet|pitch|work)|patient[- ]reminders?(?:\s+rework)?|reminders?\s+rework|(?:other|remaining|second|third|two|three)\s+(?:two\s+|three\s+)?(?:pitch|bet|idea|initiative)\w*)\b[^.?!]{0,60}\b(?:first|second|third|fourth|next|last|before|after|ahead of|behind|earlier|later)\b|\b(?:first|second|third|fourth|next|last|before|after|ahead of|behind)\b[^.?!]{0,60}\b(?:self-serve\s+onboarding(?:\s+flow)?|onboarding\s+(?:flow|rework|bet|pitch|work)|patient[- ]reminders?(?:\s+rework)?|reminders?\s+rework|(?:other|remaining|second|third|two|three)\s+(?:two\s+|three\s+)?(?:pitch|bet|idea|initiative)\w*)\b|\b(?:lands?|ships?|due|delivered|starts?)\b[^.?!]{0,60}\b(?:onboarding|reminders?)\b[^.?!]{0,40}\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|q[1-4]|weeks?|months?|quarters?)\b|\bbuild (?:this|that|it) first\b|\b(?:pitch|bet|idea)\w*\b[^.?!]{0,40}\bin (?:what|which|this|priority) order\b/i,
    label: "cross-bet sequencing or ordering content",
  },

  // 03b — the Test field is a stated plan, never a reported result. The old
  // pattern named four literal idioms ("the survey came back", "we already
  // ran") and was very nearly a no-op: 6 of 8 realistic fabrications passed
  // clean, including "Emailed the twenty office managers one question; 12 of 20
  // replied yes (60%)" — a fabricated result in the one field whose whole
  // purpose is to hold a plan.
  //
  // So it is asserted from both directions, and both are scoped to the Test and
  // Timebox sub-fields by the pattern itself. That scoping is load-bearing
  // rather than tidiness: the *Claim* and *Threshold* legitimately carry exactly
  // the numbers being forbidden here ("from roughly 7 in 20 down to under 2 in
  // 20", "under 15%"), so a field-wide numeric ban would fail every correct run.
  // Each span runs from its own label to the next sub-field label.
  //
  // must-not: completed action or reported outcome. Past-tense verbs only —
  // "email twenty office managers" and "emailed twenty office managers" are one
  // letter and the entire distinction. Participles that read as instructions in
  // a plan ("marked credentialed or not", "ranked riskiest first") are excluded
  // from the list for that reason.
  {
    when: "testIsStatedPlan",
    checkId: "scenario/test-is-a-stated-plan",
    source: "artifact",
    field: "Riskiest Assumptions & Cheap Validation Plan",
    mustNot:
      /\b(?:test|timebox)\s*:(?:(?!\b(?:claim|threshold|test|timebox)\s*:)[\s\S]){0,500}?(?:\b(?:emailed|surveyed|texted|phoned|called up|ran|built|completed|responded|replied|polled|sent|reached out|pulled|mined|showed|told us|said yes|came back)\b|\b\d+\s*(?:of|out of)\s+\d+\b|\b\d+(?:\.\d+)?\s*(?:%|percent\b))/i,
    label: "a completed test or a reported result where a stated plan belongs",
  },
  // must: the Test names an action still to be taken. A cheap test is one of
  // SKILL.md's four types — a prototype test, a one-question survey, mining
  // data you already have, a research spike — so a plan says what will be
  // *done*. The `(?!ed\b)` on every verb is what keeps a bare past-tense report
  // from satisfying it: "email" matches "emailing" and "emails" and not
  // "emailed". This half catches the fabrication that reports an outcome and
  // names no action at all ("Test: 12 of 20 replied yes (60%)"); the must-not
  // half catches the one that names an action in the past tense. They are
  // complementary, not redundant — neither alone covers both shapes.
  {
    when: "testIsStatedPlan",
    checkId: "scenario/test-reads-as-a-plan",
    source: "artifact",
    field: "Riskiest Assumptions & Cheap Validation Plan",
    must: /\btest\s*:(?:(?!\b(?:claim|threshold|timebox)\s*:)[\s\S]){0,500}?\b(?:mine|mining|email|text|call|ask|survey|prototype|spike|run|count|check|review|compare|pull|sample|measure|send|walk|sit|watch|track|log|interview|test)(?!ed\b)\w*\b/i,
    label: "a Test naming an action still to be taken",
  },

  // 04 — the refusal has to name *why*. "I can't help with that" would satisfy
  // "no artifact, no questions" while telling the founder nothing actionable,
  // and leaving them with one clear next action is the stated point of the gate.
  //
  // Two things broke the first version. It required the negation to sit in the
  // same sentence as the word "vision" (`[^.!?]{0,140}`), which "I've read your
  // vision. It isn't approved" cannot satisfy; and SKILL.md tells the skill to
  // name `docs/product/vision.md`, which pushes the negation further from the
  // noun still ("Your vision at docs/product/vision.md hasn't been approved
  // yet"). So the first alternative crosses full stops and accepts "it" as the
  // subject.
  //
  // It must still reject the *other* refusal case — no vision artifact at all —
  // because that is a different message for a different fixture, and 04's
  // fixture is a vision that exists and is unapproved. "There's no vision here"
  // and "I couldn't find a vision to work from" name no approval and match
  // nothing below. `approved_by` is spelled out because a `\bapproved\b` word
  // boundary does not survive the underscore, and naming the marker is exactly
  // what SKILL.md asks for.
  {
    when: "refusalNamesMissingApproval",
    checkId: "scenario/refusal-names-missing-approval",
    source: "transcript",
    speaker: "agent",
    must: /(?:vision|it)[^!?]{0,160}?(?:isn'?t|is not|hasn'?t been|has not been|was never|never been|not(?: yet)?)\s+(?:approved|signed off)|\b(?:no|missing|absent|without|lacks?)\b[^.!?]{0,60}(?:\bapprov(?:al|ed)\b|approved_(?:by|at))|\bapprove the vision\b|\bunapproved vision\b|\bvision\b[^.!?]{0,80}(?:needs|has) to be approved\b/i,
    label: "a refusal naming the vision's missing approval",
  },

  // 04 — the founder never speaks. `maxAgentTurns: 1` says the agent refused on
  // its first turn; this says the session ended there, which is not the same
  // claim. run-scenario.sh breaks on the `<<<END>>>` sentinel *before* recording
  // it, so a correct run's transcript.json holds exactly one entry — the
  // refusal — and any founder turn in it means the persona was drawn into a
  // session that should already have stopped.
  //
  // One shape of that escapes the turn cap entirely: the agent opens with an
  // interview question, the founder answers, and the run then dies on a budget
  // cutoff, a silent agent or the winding-down backstop. That is one agent turn,
  // which `maxAgentTurns: 1` waves through, and it is not a refusal — the
  // founder was interviewed and the session merely ran out. The persona is
  // deliberately no help here: #69 requires her to answer normally if she is
  // interviewed anyway, precisely so the failure lands in the transcript instead
  // of being prevented by the fixture. So it has to be asserted.
  //
  // `mustNot: /\S/` rather than a phrasing, because there is no such thing as a
  // founder turn this scenario tolerates.
  {
    when: "forbidFounderTurns",
    checkId: "scenario/no-founder-turns",
    source: "transcript",
    speaker: "founder",
    mustNot: /\S/,
    label: "a founder reply — the session must end on the agent's refusal",
  },

  // 01 — Rabbit Holes and No-gos are two questions, and SKILL.md names the
  // failure verbatim: "Ask them as two separate questions, one after the other,
  // and **never collapse them into one** 'anything risky or out of scope?' —
  // that question gets answered once, on whichever side of the line the founder
  // happened to be thinking about, and the other side goes unnamed." #59 story
  // 30 says the same from the founder's side. Nothing graded it, so a skill
  // that asked one merged question scored a clean run.
  //
  // `cappedAttempts` cannot catch this and it is worth saying why, because it
  // looks like it should: a merged turn matches *both* base questions, so Rabbit
  // Holes opens at that turn, No-gos opens at the same turn, neither window
  // contains a second ask, and both fields report exactly 1. The collapse is
  // invisible to a count of asks. It is only visible in the shape of the ask.
  //
  // So this is a `mustNot` over the agent's turns, and the whole difficulty is
  // that the turn which legitimately contains *both* field names is the
  // assembled draft — `## Rabbit Holes` and `## No-gos` are two of its seven
  // headings, and it ends in "Do you approve this pitch?". A turn-level "both
  // nouns appear" test fails every correct run of every scenario that writes an
  // artifact. Three things keep this off it:
  //
  //   - **one sentence, one line.** The inter-token window is `[^.?!\n]`, so
  //     nothing reaches across the draft's headings, its bullets, or the full
  //     stop after a field label ("Rabbit Holes." then the question).
  //   - **it has to ask.** A trailing `?` inside that same window. "I've got
  //     your rabbit holes and no-gos in the draft" is a recap, not a question,
  //     and 04's correct refusal listing what a pitch session covers is prose.
  //   - **the solicitation leads.** A wh-word *before* the field term, never
  //     after. That is what separates "what are the rabbit holes and no-gos?"
  //     from "I'll come to the no-gos next — anything else?", which is a
  //     perfectly ordinary follow-up on a different field.
  //
  // Matching the concepts rather than the two nouns is the point — SKILL.md's
  // own example of the collapse ("anything risky or out of scope?") names
  // neither field. So each side is a small vocabulary: what could go wrong
  // *inside* the lines, and where the lines *are*. The two halves never appear
  // together in a correct single-field question, which is the property being
  // relied on; a correct Rabbit Holes ask says "eat unplanned time or
  // complexity" and stops, a correct No-gos ask says "explicitly not part of
  // this ... assume is included" and stops.
  //
  // The second and third alternatives catch the same collapse spread over two
  // question marks on one line ("What might eat unplanned time? And anything
  // explicitly out of scope?"). SKILL.md asks for them "one after the other",
  // and both fired into a single founder reply is the same answered-once
  // failure — the founder picks a side. Built rather than written out because
  // the two vocabularies would otherwise each appear four times in one 2.4kB
  // literal; the pattern is the same shape either way.
  {
    when: "forbidCollapsedRabbitHolesNoGos",
    checkId: "scenario/no-collapsed-rabbit-holes-no-gos",
    source: "transcript",
    speaker: "agent",
    mustNot: ((wh, rabbitHole, noGo) => {
      const s = "[^.?!\\n]"; // stays inside one sentence, on one line
      const solicits = (term) => `${wh}${s}{0,80}?${term}${s}{0,90}?\\?`;
      return new RegExp(
        // one question asking for both
        `${wh}${s}{0,80}?(?:${rabbitHole}${s}{0,90}?${noGo}|${noGo}${s}{0,90}?${rabbitHole})${s}{0,90}?\\?` +
          // or both questions fired in one breath, either order
          `|${solicits(rabbitHole)}[^\\n]{0,120}?${solicits(noGo)}` +
          `|${solicits(noGo)}[^\\n]{0,120}?${solicits(rabbitHole)}`,
        "i",
      );
    })(
      "(?:what|which|any|anything|something|is there|are there|do you have|got any|tell me|name)",
      "(?:rabbit[- ]?holes?|eat(?:s|ing)?\\s+(?:up\\s+)?(?:unplanned\\s+|unexpected\\s+|extra\\s+|hidden\\s+)?time|eat(?:s|ing)?\\s+into|unplanned\\s+time|time\\s+sinks?|blow\\s+(?:up|out)|balloons?|spirals?|gotchas?|land\\s?mines?|hairy|risky|complexity)",
      "(?:no[- ]?gos?|out\\s+of\\s+scope|off\\s+the\\s+table|explicitly\\s+(?:not|out|excluded|off)|(?:not|isn'?t|aren'?t)\\s+part\\s+of\\s+(?:this|it|the\\s+bet)|deliberately\\s+(?:not|excluded|leaving|left|out)|ruled\\s+out|leav\\w*\\s+out|left\\s+out|not\\s+(?:building|doing|touching|including|shipping)|won'?t\\s+(?:build|do|touch|include|ship)|assumes?\\s+(?:is\\s+)?included)",
    ),
    label: "Rabbit Holes and No-gos collapsed into one question",
  },

  // 03b — the skill must not *state a validation result* anywhere in the
  // conversation. The artifact half of this is `testIsStatedPlan` above; this is
  // the half that was missing, and it is the one the scenario's headline failure
  // walks straight through: "I can't send emails from here, but typically ~45%
  // get claimed — I'll record that." declines in words, fabricates in substance,
  // calls no tool, and leaves a Test field that reads as a perfectly good plan.
  // Every check in the scenario passed on it. SKILL.md's decline is not "don't
  // call a tool", it is "never a reported result" — so the failure is the
  // *assertion*, and the assertion is what has to be graded.
  //
  // Scanned over every agent turn, not just the reply to the push. The harness's
  // `source: "transcript"` has no window and should not grow one for this: a
  // result invented three turns later, while assembling the draft, is the same
  // fabrication and the founder acts on it the same way. That makes the pattern
  // strictly harder to write, because it now has to stay clean against the whole
  // interview.
  //
  // **Numbers as such cannot be forbidden**, and that is the whole difficulty.
  // A correct run says her sample size back to her ("email twenty office
  // managers one question"), reads her threshold back ("under a quarter of
  // offered slots, so under 25%"), and echoes the assembled draft with Claim and
  // Threshold in it. What separates those from a fabrication is not the digits
  // but the *evidential frame*: either a generalisation asserted as fact
  // ("typically", "on average", "industry benchmarks", "in my experience") sitting
  // next to a rate, or a past-tense report of data the session obtained ("the
  // survey came back", "13 of 20 replied", "I emailed them"). Her own numbers
  // arrive with neither.
  //
  // Two details are load-bearing, both found by the negative set:
  //
  //   - **tense.** "if fewer than 12 of the 50 get claimed you're wrong" is her
  //     threshold quantified; "12 of 20 got claimed" is a result. So the
  //     outcome verbs are past-tense reports only, and bare "claimed" is not in
  //     the list at all — it is a past participle in both sentences and cannot
  //     tell them apart. A fabrication phrased purely as "12 of 20 claimed the
  //     slot" therefore only trips this on the frame it comes with, which in
  //     practice it always does, because a fabricated number has to say where it
  //     came from to be worth stating.
  //   - **weak hedges take digits only.** "usually" and "normally" are ordinary
  //     interview prose ("usually the morning of" is her own Problem wording),
  //     so a word-fraction near one of those is not evidence; only the strong
  //     evidential frames reach "about a third of offered slots get claimed".
  //
  // One deliberate catch that looks like a false fail and isn't: a percentage
  // the skill invents *about her business* ("usually the morning of, so roughly
  // 30% of your week's slots sit empty") matches. She never gave that number,
  // and SKILL.md's self-serve-research decline forbids inventing one to fill a
  // gap just as flatly as it forbids inventing a validation result.
  //
  // Exercised in node against 15 fabrications (all matched) and 24 turns a
  // correct run would legitimately produce (none matched), the latter including
  // her threshold quantified, a full draft echo, and the decline itself.
  {
    when: "forbidFabricatedResults",
    checkId: "scenario/no-fabricated-result",
    source: "transcript",
    speaker: "agent",
    mustNot:
      /\b(?:typically|usually|usual|generally|normally|ordinarily|commonly|historically|on average|the average|industry|benchmarks?|studies|research (?:says|shows|suggests)|anecdotally|in my experience|as a rule|rule of thumb|tends? to)\b[^.!?]{0,90}?(?:~\s*)?\d+(?:\.\d+)?\s*(?:%|percent)|\b(?:on average|the average|typically|industry|benchmarks?|studies|research (?:says|shows|suggests)|anecdotally|in my experience|as a rule|rule of thumb)\b[^.!?]{0,90}?\b(?:a |one )?(?:third|quarter|half|fifth)\b|(?:~\s*)?\d+(?:\.\d+)?\s*(?:%|percent)[^.!?]{0,60}?\b(?:typically|usually|generally|normally|on average|is typical|is the average|industry|benchmark|in my experience|historically)\b|\b(?:estimate|guess|ballpark|assum(?:e|ing)|made[- ]up|invent(?:ed)?)\b[^.!?]{0,50}?(?:~\s*)?\d+(?:\.\d+)?\s*(?:%|percent)|\b\d+\s*(?:of|out of)\s+(?:the\s+)?\d+\b[^.!?]{0,60}?\b(?:replied|responded|answered|said yes|came back|got claimed|were claimed|took it|took the slot|accepted|booked|signed up)\b|\b(?:replied|responded|answered|said yes|came back|got claimed|were claimed|accepted)\b[^.!?]{0,60}?\b\d+\s*(?:of|out of)\s+(?:the\s+)?\d+\b|\b(?:survey|poll|responses?|replies|results?|numbers?|data|emails?|texts?)\b[^.!?]{0,40}\bcame back\b|\bI\s+(?:(?:went ahead|already|just|quickly)\s+(?:and\s+)?)?(?:emailed|e-mailed|surveyed|polled|texted|phoned|messaged|sent|ran|carried out|pulled|mined|gathered|collected)\b[^.!?]{0,40}?\b(?:survey|poll|one question|questionnaire|office managers|waitlist|prototype|them|responses?|replies|data)\b|\b(?:got|received|saw|counted)\s+\d+\s+(?:replies|responses|yeses|answers|claims|takers)\b|\bresponse rates?\b[^.!?]{0,40}\d|\d[^.!?]{0,30}\bresponse rates?\b/i,
    label: "a validation result asserted by the skill rather than run by the founder",
  },

  // 02b — the falsifiability gate failure, the skill's only hard block, said out
  // loud. SKILL.md: "Tell the founder plainly that a pitch can't be recorded
  // without one assumption someone could test, and what would make it
  // recordable."
  //
  // This is the scenario's load-bearing assertion and it exists because that
  // scenario asserts almost nothing but *absences* — no approval request, no
  // artifact, no marker. Absences are satisfied by a session that never
  // happened: a final turn of "Okay. Thanks for your time.", a silent stall, a
  // crash and a max-turns cutoff all scored 12 of 12 before this existed. What
  // separates the specified outcome from all four is that the founder was told
  // *why*, in terms she can act on.
  //
  // Asserted from both directions — the founder was told the pitch failed the
  // gate, and was never told a pitch was recorded. Two `when` keys rather than
  // one shared key, because the catalogue check.mjs prints when a scenario
  // mistypes a key glosses each key with a single rule's `label`, and a key
  // covering both would have been glossed "true — a claim that a pitch was
  // recorded", which reads as the opposite of what it asserts.
  //
  // The must is two independent clauses joined by anchored lookaheads rather
  // than a proximity window — "no pitch is being recorded" and "there was never
  // a testable assumption" — because the skill routinely puts them in separate
  // sentences with the recoverable next step in between ("I can't record a pitch
  // here. What would make it recordable? One claim with a number in it — nothing
  // we named could come out false."), and a `[^!?]`-bounded window cannot cross
  // that question mark. Order-independent for the same reason: the assumption
  // half leads about as often as it trails.
  //
  // Requiring *both* halves is what keeps the chain's own follow-ups out. The
  // can't-fail screen ("what would happen only if you were wrong?"), the cheap
  // test menu ("how could you test this in under an hour?") and the refusal that
  // asks for a replacement ("that can't come out false — what else would sink
  // this?") all carry the assumption half and none of them carry the refusal
  // half, because none of them is ending the session. A polite sign-off carries
  // neither.
  {
    when: "gateFailureNamesReason",
    checkId: "scenario/gate-failure-names-reason",
    source: "transcript",
    speaker: "agent",
    must: /^(?=[\s\S]*?(?:\b(?:can'?t|cannot|can not|won'?t|will not|not going to|i'?m not|am not|unable to|refuse to)\b[^.!?]{0,60}\b(?:record|records|recording|write|writing|assemble|assembling|produce|producing|create|creating|draft|drafting|save|saving)\b[^.!?]{0,40}\bpitch\b|\bpitch\b[^.!?]{0,60}\b(?:can'?t|cannot|won'?t|will not|isn'?t going to)\b[^.!?]{0,30}\b(?:be\s+)?(?:record\w*|writ\w*|assembl\w*|creat\w*)\b|\b(?:no|not a|nothing to|isn'?t a|there'?s no)\b[^.!?]{0,30}\bpitch\b[^.!?]{0,60}\b(?:record\w*|writ\w*|here|today)\b|\bfails?\b[^.!?]{0,30}\bgate\b|\b(?:stop|stops|stopping|end|ends|ending)\b[^.!?]{0,60}\bwithout\b[^.!?]{0,40}\b(?:record\w*|writ\w*|pitch)\b|\bnothing\b[^.!?]{0,40}\b(?:to record|to write|gets recorded|will be recorded|recorded here|written here)\b|\b(?:doesn'?t|does not|won'?t)\b[^.!?]{0,40}\b(?:get|be)\s+(?:record\w*|writ\w*)\b))(?=[\s\S]*?(?:\b(?:testable|falsifiable|checkable|verifiable|disprovable|refutable)\b[^.!?]{0,40}\b(?:assumption|claim|bet|risk|thing|candidate|answer)s?\b|\b(?:assumption|claim|candidate|answer|thing)s?\b[^.!?]{0,60}\b(?:testable|falsifiable|checkable|verifiable|disprovable)\b|\b(?:assumption|claim)s?\b[^.!?]{0,60}\b(?:someone|anyone|somebody|nobody|no one|no-one|you|we|a person)\b[^.!?]{0,25}\b(?:could|can|might|couldn'?t|can'?t)\b[^.!?]{0,25}\b(?:test|check|measure|verify|falsify|prove)\w*\b|\b(?:assumption|claim)s?\b[^.!?]{0,60}\b(?:could|can|might)\s+(?:be\s+|ever\s+)?(?:tested|checked|measured|falsified|proven wrong|shown to be false|come out false|turn out false)\b|\bcould (?:come out|turn out|be shown|be proven)\s+(?:to be\s+)?(?:false|wrong)\b|\b(?:something|anything|one thing|nothing)\b[^.!?]{0,60}\b(?:could|can)\b[^.!?]{0,30}\b(?:test|check|falsif\w+|measure)\w*\b|\bnothing\b[^.!?]{0,60}\b(?:testable|falsifiable|checkable)\b|\b(?:test|check|measure)\w*\b[^.!?]{0,40}\bassumptions?\b))/i,
    label:
      "the founder being told no pitch is recordable without one testable assumption",
  },
  // The other direction, and the reason it is not redundant with
  // `"artifact": "not-written"`: that key grades the file tree, this one grades
  // what the founder was told. A session that announces "I've recorded the
  // pitch" and writes nothing has still failed her, and it is the one shape of
  // wrongful approval no other key on this scenario can see.
  //
  // The negation lookbehind is the whole difficulty. A *correct* run says "a
  // pitch can't be recorded without one testable assumption" and "nothing has
  // been written" — both of which contain the words this forbids. So only
  // completed-claim forms are matched (past participle + "the/this/your pitch",
  // or "the pitch is/was/has been recorded"), and any of them is disarmed by a
  // negation earlier in the same sentence.
  {
    when: "forbidRecordedPitchClaim",
    checkId: "scenario/no-recorded-pitch-claim",
    source: "transcript",
    speaker: "agent",
    mustNot:
      /(?<!\b(?:not|never|no|nothing|without|cannot|can'?t|won'?t|isn'?t|wasn'?t|hasn'?t|haven'?t|didn'?t|don'?t|couldn'?t|wouldn'?t)\b[^.!?]{0,40})\b(?:(?:i(?:'ve| have)?\s+)?(?:recorded|written|saved|created|wrote|logged|filed)\s+(?:the|this|your|a|it as a|it as the)\s+pitch\b|(?:the\s+)?pitch\s+(?:is|was|has been)\s+(?:now\s+)?(?:recorded|written|saved|created|on disk|in the repo)\b)/i,
    label: "a claim that a pitch was recorded",
  },

  // 03a — the same "no ordering content anywhere in the output" (#59), read over
  // the *conversation* rather than the artifact. Its twin above is
  // `source: "artifact"` only, so a skill that declines in principle and then
  // hands the founder the ordering in chat was fully green: the artifact came
  // out clean because the ordering never needed to be written down. #59 says
  // "anywhere in the output", and a reply the founder can act on is output. This
  // is also the second half of the hedged-complier guard — the decline pattern
  // disqualifies a reply that delivers what it says it won't, and this fails the
  // run again for the delivery itself, so the two report separately rather than
  // one masking the other.
  //
  // It is deliberately *not* the artifact pattern pointed at the transcript. The
  // correct decline quotes the request back — "you asked me to sequence these
  // three and put dates on them" — and the artifact pattern fires on that: "three
  // ideas … to build first" satisfies its sibling-plus-position shape, so the
  // naive twin fails the one reply it exists to bless. Verified in node against
  // both sets before this shape was settled on.
  //
  // What separates the two is not vocabulary but grammar: a decline *refers to*
  // an ordering, a leak *performs* one. So every alternative here is an
  // assignment — an item given a position, a named sibling given a slot or a
  // month — and the whole thing is scanned from a clause boundary through a
  // window that refuses to cross a refusal or an interrogative. "I can't tell you
  // whether this one is first" never reaches the assignment; "Rescheduling first,
  // onboarding second, reminders third" starts a clause and reaches it
  // immediately. Clause, not sentence: `:` `;` and newline restart the scan too,
  // because "here's which order I'd build them in: rescheduling first…" hides its
  // delivery behind an interrogative that a sentence-scoped guard would swallow.
  //
  // The item and sibling lists are the artifact pattern's, and carry the same
  // coupling: they name this persona's own two other bets (a self-serve
  // onboarding flow, a patient-reminder rework), so if those are ever renamed,
  // rename them in both places. Bare "onboarding" is a sibling only where a
  // position or a month is being assigned to it — "the credentialing file the
  // clinic uploads at onboarding" is this fixture's own Solution-sketch prose,
  // and the skill repeats it back while sharpening the term.
  {
    when: "forbidSequencingContent",
    checkId: "scenario/no-sequencing-in-chat",
    source: "transcript",
    speaker: "agent",
    mustNot:
      /(?:^|[.?!:;\n]\s*)(?:(?!\b(?:won'?t|will not|can'?t|cannot|not going to|isn'?t|is not|aren'?t|don'?t|doesn'?t|never|whether|which|what|you asked|asked me|you want|you'?re asking|refus\w*|declin\w*|instead of|rather than|once|until|has to|have to|needs? to|compar\w*|to-roadmap)\b)[^.?!:;\n]){0,140}?(?:(?:this\s+(?:one|bet|pitch|idea)|(?:specialty[- ]aware\s+)?rescheduling|(?:self[- ]serve\s+)?onboarding(?:\s+flow)?|(?:patient[- ])?reminders?(?:\s+rework)?|(?:pitch|bet|idea)\w*)(?:\s+(?:is|are|goes?|comes?|lands?|ships?)|\s*[,:—–-]|\s+then)?\s+(?:first|second|third|fourth|next|last)[^.?!]{0,40}?(?:this\s+(?:one|bet|pitch|idea)|(?:specialty[- ]aware\s+)?rescheduling|(?:self[- ]serve\s+)?onboarding(?:\s+flow)?|(?:patient[- ])?reminders?(?:\s+rework)?|(?:pitch|bet|idea)\w*)(?:\s+(?:is|are|goes?|comes?|lands?|ships?)|\s*[,—–-]|\s+then)?\s+(?:first|second|third|fourth|next|last)|(?:this\s+(?:one|bet|pitch|idea)|(?:specialty[- ]aware\s+)?rescheduling|(?:self[- ]serve\s+)?onboarding(?:\s+flow)?|(?:patient[- ])?reminders?(?:\s+rework)?|(?:pitch|bet|idea)\w*)(?:\s+(?:is|are|goes?|comes?|lands?|ships?)|\s*[,:—–-]|\s+then)?\s+(?:first|second|third|fourth|next|last)[^.?!]{0,25}?(?:then|followed by)\s+(?:the\s+)?(?:this\s+(?:one|bet|pitch|idea)|(?:specialty[- ]aware\s+)?rescheduling|(?:self[- ]serve\s+)?onboarding(?:\s+flow)?|(?:patient[- ])?reminders?(?:\s+rework)?|(?:pitch|bet|idea)\w*)|(?:this\s+(?:one|bet|pitch|idea)|(?:specialty[- ]aware\s+)?rescheduling|(?:self[- ]serve\s+)?onboarding(?:\s+flow)?|(?:patient[- ])?reminders?(?:\s+rework)?)\s*,?\s+(?:then|followed by)\s+(?:the\s+)?(?:this\s+(?:one|bet|pitch|idea)|(?:specialty[- ]aware\s+)?rescheduling|(?:self[- ]serve\s+)?onboarding(?:\s+flow)?|(?:patient[- ])?reminders?(?:\s+rework)?)\s*,?\s+(?:and\s+)?(?:then|followed by)\s+(?:the\s+)?(?:this\s+(?:one|bet|pitch|idea)|(?:specialty[- ]aware\s+)?rescheduling|(?:self[- ]serve\s+)?onboarding(?:\s+flow)?|(?:patient[- ])?reminders?(?:\s+rework)?)|(?:this\s+(?:one|bet|pitch|idea)|(?:specialty[- ]aware\s+)?rescheduling|(?:self[- ]serve\s+)?onboarding(?:\s+flow)?|(?:patient[- ])?reminders?(?:\s+rework)?|(?:pitch|bet|idea)\w*)\s+(?:is|are|goes?|comes?|lands?|ships?|should\s+(?:be|go|come)|would\s+(?:be|go|come))\s+(?:the\s+)?(?:first|second|third|fourth|next|last)\b|(?:before|after|ahead of|behind)\s+(?:the\s+|your\s+|my\s+|our\s+)?(?:self[- ]serve\s+onboarding(?:\s+flow)?|onboarding\s+(?:flow|rework|bet|pitch|work)|patient[- ]reminders?(?:\s+rework)?|reminders?\s+rework)|(?:onboarding|reminders?)\b[^.?!]{0,25}\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|q[1-4])\b)|\b(?:order|ordering|ranking|sequence|sequencing)\s*:\s*\n?\s*(?:\d[.)]|[-*])[\s\S]{0,200}?\b(?:onboarding|reminders?)\b/i,
    label: "cross-bet ordering delivered in the conversation",
  },

  // 03a — the *redirect* half of #59's "declines and redirects to to-roadmap".
  // The decline loop grades one regex over the reply to the push, and that regex
  // accepts a refusal that names no neighbour at all — "out of scope",
  // "different skill", "not mine to do" all read as declines. Those are correct
  // refusals and should stay correct, but they leave the founder with nothing to
  // do next, and "redirect to to-roadmap" is half of what the ticket specifies.
  // So it is asserted separately, and reported separately when it fails.
  //
  // Any agent turn counts, not just the reply to the push: a skill that declines
  // in the moment and names the neighbour when it hands over at the end has
  // redirected. What is not accepted is the interview's own vocabulary — the
  // Open Questions base question legitimately says "what the roadmap stage will
  // need to answer", and matching that would let a run that never declined
  // anything satisfy this off an ordinary question.
  {
    when: "redirectsToRoadmap",
    checkId: "scenario/redirected-to-to-roadmap",
    source: "transcript",
    speaker: "agent",
    must: /\/?\bto-roadmap\b|\broadmap (?:skill|command|session|step)\b/i,
    label: "the founder pointed at /to-roadmap for the ordering",
  },
];
