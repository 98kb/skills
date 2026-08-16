#!/usr/bin/env bash
#
# Run one to-vision eval scenario end to end.
#
#   ./run-scenario.sh <scenario-id>
#
# Drives two separate Claude Code sessions against each other:
#
#   SUT     — a session in a throwaway workspace with only the to-vision skill
#             installed, started with the literal `/to-vision` slash command
#             (the skill is disable-model-invocation, so that is the only way
#             in).
#   FOUNDER — a session whose system prompt is the scenario's persona fixture,
#             with no tools, replying as the founder.
#
# Writes to evals/runs/<scenario-id>/:
#   transcript.md    human-readable conversation
#   transcript.json  structured turns, consumed by check.mjs
#   toolcalls.json   every tool the SUT invoked, for the composition check
#   artifact.md      the produced docs/product/vision.md, if any
#   run.json         run metadata
#   raw/             raw stream-json from each SUT turn
#
set -euo pipefail

SCENARIO="${1:-}"
if [[ -z "$SCENARIO" ]]; then
  echo "usage: run-scenario.sh <scenario-id>" >&2
  exit 2
fi

HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EVALS_DIR="$(cd "$HARNESS_DIR/.." && pwd)"
SKILL_DIR="$(cd "$EVALS_DIR/.." && pwd)"
SCENARIO_DIR="$EVALS_DIR/scenarios/$SCENARIO"

if [[ ! -d "$SCENARIO_DIR" ]]; then
  echo "unknown scenario '$SCENARIO' — expected $SCENARIO_DIR" >&2
  exit 2
fi

MODEL="${EVAL_MODEL:-opus}"
MAX_TURNS="${EVAL_MAX_TURNS:-40}"
BUDGET="${EVAL_MAX_BUDGET_USD:-10}"
OUT_DIR="${EVAL_OUT_DIR:-$EVALS_DIR/runs/$SCENARIO}"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR/raw"

# Throwaway workspace for the SUT. Deliberately outside this repo so the SUT
# inherits none of its CLAUDE.md, settings, or vendored skills — the only skill
# it can see is the one under test.
WORKSPACE="$(mktemp -d -t to-vision-eval-XXXXXX)"
FOUNDER_CWD="$(mktemp -d -t to-vision-founder-XXXXXX)"
cleanup() { rm -rf "$WORKSPACE" "$FOUNDER_CWD"; }
trap cleanup EXIT

mkdir -p "$WORKSPACE/.claude/skills/to-vision"
cp "$SKILL_DIR/SKILL.md" "$WORKSPACE/.claude/skills/to-vision/SKILL.md"

SUT_SID="$(node -e 'console.log(crypto.randomUUID())')"
FOUNDER_SID="$(node -e 'console.log(crypto.randomUUID())')"

echo "scenario   : $SCENARIO"
echo "model      : $MODEL"
echo "workspace  : $WORKSPACE"
echo "output     : $OUT_DIR"
echo

: >"$OUT_DIR/transcript.md"
printf '# Transcript — %s\n\n' "$SCENARIO" >>"$OUT_DIR/transcript.md"

TURNS_JSON="$OUT_DIR/.turns.jsonl"
: >"$TURNS_JSON"

record_turn() { # speaker, text, turn
  jq -n --arg speaker "$1" --arg text "$2" \
    '{speaker:$speaker, text:$text}' >>"$TURNS_JSON"
  # A distinctive rule, not a markdown heading — agent turns quote draft
  # artifacts containing their own `##` headings, which would otherwise be
  # indistinguishable from turn boundaries when reading the transcript.
  printf '━━━━━━ turn %s · %s ━━━━━━\n\n%s\n\n' "$3" "$1" "$2" >>"$OUT_DIR/transcript.md"
}

# Backstop for a conversation that has plainly wound down but never produced the
# sentinel: two consecutive short agent turns that ask nothing.
stalled=0
is_winding_down() { # text -> 0 if short and question-free
  local t="$1"
  [[ "${#t}" -lt 240 && "$t" != *"?"* ]]
}

# The SUT gets a narrow allowlist — exactly the file tools a vision session
# legitimately needs. Anything else (WebSearch in scenario 3b, Skill, Task) is
# denied non-interactively, but the *attempt* is still emitted as a tool_use
# block into the raw stream, so check.mjs can see the skill reaching for a tool
# it shouldn't. The composition check therefore catches intent, not just effect.
SUT_ALLOWED_TOOLS=(Read Write Edit Glob Grep)

run_sut() { # message -> stdout: assistant text
  local msg="$1" turn="$2" raw="$OUT_DIR/raw/turn-$turn.jsonl"
  local -a resume=()
  if [[ "$turn" -eq 1 ]]; then
    resume=(--session-id "$SUT_SID")
  else
    resume=(--resume "$SUT_SID")
  fi
  (cd "$WORKSPACE" && claude -p "$msg" \
    "${resume[@]}" \
    --model "$MODEL" \
    --allowed-tools "${SUT_ALLOWED_TOOLS[@]}" \
    --output-format stream-json --verbose \
    --max-budget-usd "$BUDGET") >"$raw" 2>"$OUT_DIR/raw/turn-$turn.err" || true
  jq -rs '[.[] | select(.type=="result") | .result // ""] | last // ""' <"$raw"
}

# The persona is reminded of the stop rule on every turn rather than once in the
# system prompt. Relying on the system prompt alone let a run degenerate into a
# polite closing loop — the agent had plainly finished, and the founder kept
# saying "understood" instead of emitting the sentinel.
founder_prompt() { # agent text -> stdout: wrapped prompt
  cat <<EOF
The agent said:

$1

---

Reply as the founder, in character, in prose. Follow your persona's behavioural
rules exactly — including any field you are instructed to stay vague on, or to
never answer at all. Those rules outrank being helpful to the agent.

STOP RULE — check this first, every single turn: if the agent has finished, say
nothing else and reply with exactly <<<END>>> on its own. The agent has finished
if it has told you the vision is written or recorded, or that the session is
ending / closing / cannot continue without a grounding insight, or if it is no
longer asking you anything and is only acknowledging you. Do not thank it, do
not sign off, do not say "understood" — emit <<<END>>> instead.
EOF
}

run_founder() { # message -> stdout: founder text
  local msg="$1" turn="$2"
  local -a resume=()
  if [[ "$turn" -eq 1 ]]; then
    resume=(--session-id "$FOUNDER_SID")
  else
    resume=(--resume "$FOUNDER_SID")
  fi
  # The persona is re-appended on *every* turn, not just the first. Passing it
  # only at session start silently lost it on resume: an early run watched the
  # hard-blocked persona forget it was forbidden a grounding insight, hand over
  # a good one, and then invent a founder name out of nowhere.
  (cd "$FOUNDER_CWD" && claude -p "$(founder_prompt "$msg")" \
    "${resume[@]}" \
    --append-system-prompt "$(cat "$SCENARIO_DIR/persona.md")" \
    --model "$MODEL" \
    --disable-slash-commands \
    --disallowed-tools Bash Read Write Edit Glob Grep WebFetch WebSearch Task NotebookEdit TodoWrite Skill \
    --output-format json \
    --max-budget-usd "$BUDGET" 2>/dev/null | jq -r '.result // ""') || true
}

turn=1
ended="max-turns"
while [[ "$turn" -le "$MAX_TURNS" ]]; do
  echo "── turn $turn ─────────────────────────────"

  agent_text="$(run_sut "${next_msg:-/to-vision}" "$turn")"
  if [[ -z "${agent_text//[[:space:]]/}" ]]; then
    echo "  (agent returned nothing — ending)"
    ended="agent-silent"
    break
  fi
  record_turn agent "$agent_text" "$turn"
  printf '  agent   : %.100s...\n' "$(echo "$agent_text" | tr '\n' ' ')"

  if is_winding_down "$agent_text"; then
    stalled=$((stalled + 1))
    if [[ "$stalled" -ge 2 ]]; then
      echo "  (agent wound down without a sentinel — ending)"
      ended="conversation-stalled"
      break
    fi
  else
    stalled=0
  fi

  founder_text="$(run_founder "$agent_text" "$turn")"
  if [[ "$founder_text" == *"<<<END>>>"* ]]; then
    echo "  founder : <<<END>>>"
    ended="founder-sentinel"
    break
  fi
  if [[ -z "${founder_text//[[:space:]]/}" ]]; then
    echo "  (founder returned nothing — ending)"
    ended="founder-silent"
    break
  fi
  record_turn founder "$founder_text" "$turn"
  printf '  founder : %.100s...\n' "$(echo "$founder_text" | tr '\n' ' ')"

  next_msg="$founder_text"
  turn=$((turn + 1))
done

jq -s '.' "$TURNS_JSON" >"$OUT_DIR/transcript.json"
rm -f "$TURNS_JSON"

jq -rs '[.[] | select(.type=="assistant") | .message.content[]?
        | select(.type=="tool_use") | {name, input}]' \
  "$OUT_DIR"/raw/turn-*.jsonl >"$OUT_DIR/toolcalls.json"

if [[ -f "$WORKSPACE/docs/product/vision.md" ]]; then
  cp "$WORKSPACE/docs/product/vision.md" "$OUT_DIR/artifact.md"
  echo "artifact   : written"
else
  echo "artifact   : none"
fi

# Any file the SUT wrote outside docs/product/vision.md — a stray glossary, a
# roadmap, a CONTEXT.md — is itself a finding, so record the whole tree.
(cd "$WORKSPACE" && find . -type f -not -path './.claude/*' | sort) \
  >"$OUT_DIR/workspace-files.txt"

jq -n \
  --arg scenario "$SCENARIO" \
  --arg model "$MODEL" \
  --arg ended "$ended" \
  --argjson turns "$turn" \
  --arg artifact "$([[ -f "$OUT_DIR/artifact.md" ]] && echo written || echo none)" \
  '{scenario:$scenario, model:$model, turns:$turns, endedBecause:$ended, artifact:$artifact}' \
  >"$OUT_DIR/run.json"

echo
echo "done — $turn turns, ended: $ended"
