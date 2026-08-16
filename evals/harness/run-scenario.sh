#!/usr/bin/env bash
#
# Run one eval scenario end to end, for any skill wired to this harness.
#
#   ./run-scenario.sh <evals-dir|eval.config.json> <scenario-id>
#   ./run-scenario.sh <evals-dir|eval.config.json> <scenario-id> --seed-only
#
# Drives two separate Claude Code sessions against each other:
#
#   SUT     — a session in a throwaway workspace with only the skill under test
#             installed, started with the literal slash command from the config
#             (these skills are disable-model-invocation, so that is the only
#             way in).
#   FOUNDER — a session whose system prompt is the scenario's persona fixture,
#             with no tools, replying as the founder.
#
# Writes to <evals>/runs/<scenario-id>/:
#   transcript.md    human-readable conversation
#   transcript.json  structured turns, consumed by check.mjs
#   toolcalls.json   every tool the SUT invoked, for the composition check
#   artifact.md      the produced artifact — the one workspace file matching
#                    config.artifact.path, which is a glob (see artifact.mjs)
#   run.json         run metadata
#   raw/             raw stream-json from each SUT turn
#
# --seed-only builds the SUT workspace — the skill plus this scenario's seeded
# upstream fixtures — prints where it is, and stops before the first model call.
# It leaves the workspace behind instead of cleaning it up, which is the only way
# to inspect what a session would have started from without paying for a session.
#
set -euo pipefail

SEED_ONLY=0
POSITIONAL=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --seed-only) SEED_ONLY=1 ;;
    *) POSITIONAL+=("$1") ;;
  esac
  shift
done
CONFIG_ARG="${POSITIONAL[0]-}"
SCENARIO="${POSITIONAL[1]-}"
if [[ -z "$CONFIG_ARG" || -z "$SCENARIO" ]]; then
  echo "usage: run-scenario.sh <evals-dir|eval.config.json> <scenario-id> [--seed-only]" >&2
  exit 2
fi

HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -d "$CONFIG_ARG" ]]; then
  EVALS_DIR="$(cd "$CONFIG_ARG" && pwd)"
  CONFIG="$EVALS_DIR/eval.config.json"
else
  CONFIG="$(cd "$(dirname "$CONFIG_ARG")" && pwd)/$(basename "$CONFIG_ARG")"
  EVALS_DIR="$(dirname "$CONFIG")"
fi
if [[ ! -f "$CONFIG" ]]; then
  echo "no eval.config.json at $CONFIG" >&2
  exit 2
fi

SKILL_DIR="$(cd "$EVALS_DIR/.." && pwd)"
SCENARIO_DIR="$EVALS_DIR/scenarios/$SCENARIO"

if [[ ! -d "$SCENARIO_DIR" ]]; then
  echo "unknown scenario '$SCENARIO' — expected $SCENARIO_DIR" >&2
  exit 2
fi

cfg() { jq -r "$1" "$CONFIG"; }

SKILL="$(cfg '.skill')"
SLASH_COMMAND="$(cfg '.slashCommand')"
ARTIFACT_PATH="$(cfg '.artifact.path')"
FINISHED_WHEN="$(cfg '.founder.finishedWhen // "it has told you the artifact is written or recorded, or that the session is ending or closing, or if it is no longer asking you anything and is only acknowledging you"')"
mapfile -t SUT_ALLOWED_TOOLS < <(cfg '(.sut.allowedTools // ["Read","Write","Edit","Glob","Grep"])[]')

# Everything the founder session is denied, minus whatever this skill's config
# legitimately allows the SUT. `--allowed-tools` on its own does not deny the
# rest — it grants; a run that passed only an allowlist still executed `date -u`
# and `ls` through Bash with is_error:false. So the denial has to be spelled
# out, exactly as run_founder already spells it out.
SUT_DISALLOWED_TOOLS=()
for candidate in Bash Read Write Edit Glob Grep WebFetch WebSearch Task NotebookEdit TodoWrite Skill; do
  allowed=0
  for t in "${SUT_ALLOWED_TOOLS[@]}"; do
    [[ "$t" == "$candidate" ]] && allowed=1 && break
  done
  [[ "$allowed" -eq 0 ]] && SUT_DISALLOWED_TOOLS+=("$candidate")
done

MODEL="${EVAL_MODEL:-opus}"
MAX_TURNS="${EVAL_MAX_TURNS:-40}"
BUDGET="${EVAL_MAX_BUDGET_USD:-10}"
OUT_DIR="${EVAL_OUT_DIR:-$EVALS_DIR/runs/$SCENARIO}"

# Throwaway workspace for the SUT. Deliberately outside this repo so the SUT
# inherits none of its CLAUDE.md, settings, or vendored skills — the only skill
# it can see is the one under test.
WORKSPACE="$(mktemp -d -t "$SKILL-eval-XXXXXX")"
FOUNDER_CWD="$(mktemp -d -t "$SKILL-founder-XXXXXX")"
cleanup() { rm -rf "$WORKSPACE" "$FOUNDER_CWD"; }
trap cleanup EXIT

mkdir -p "$WORKSPACE/.claude/skills/$SKILL"
cp "$SKILL_DIR/SKILL.md" "$WORKSPACE/.claude/skills/$SKILL/SKILL.md"

# Seed the workspace with whatever the skill needs to already exist — for a
# mid-pipeline skill, the approved upstream artifact it reads before it will
# start (#61). Which fixtures those are for *this* scenario is seeds.mjs's
# answer: the skill's config-level default, overridden per destination by
# anything the scenario's expect.json declares. The merge rule lives there and
# not here, so the checker's stray-write exemption and this loop can never
# disagree about what was seeded.
SEEDS="$(node "$HARNESS_DIR/seeds.mjs" "$CONFIG" "$SCENARIO")"
while IFS=$'\t' read -r seed_from seed_to; do
  [[ -z "$seed_from" ]] && continue
  mkdir -p "$WORKSPACE/$(dirname "$seed_to")"
  cp "$seed_from" "$WORKSPACE/$seed_to"
  echo "seeded     : $seed_to ← $seed_from"
done <<<"$SEEDS"

if [[ "$SEED_ONLY" -eq 1 ]]; then
  rm -rf "$FOUNDER_CWD"
  trap - EXIT
  echo "skill      : $SKILL"
  echo "scenario   : $SCENARIO"
  echo "workspace  : $WORKSPACE (kept — --seed-only, no session run)"
  exit 0
fi

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR/raw"

SUT_SID="$(node -e 'console.log(crypto.randomUUID())')"
FOUNDER_SID="$(node -e 'console.log(crypto.randomUUID())')"

echo "skill      : $SKILL"
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

# The SUT gets a narrow allowlist from the config — exactly the file tools that
# skill's session legitimately needs — *and* an explicit denylist of everything
# else, because an allowlist alone grants without denying and a live run proved
# it: with only `--allowed-tools` the session ran `date -u` and `ls` through
# Bash and got real output back.
#
# The denial does not replace the grading. A denied call is still emitted as a
# `tool_use` block into the raw stream, so toolcalls.json still records it and
# check.mjs still fails `floor/no-research-tools` or `scenario/forbidden-tool:X`
# on it. The composition checks therefore keep grading intent; what changes is
# that a skill reaching for Bash no longer gets to *have* the answer, which
# matters for the scenario whose whole subject is a skill that must not go and
# run the founder's validation for her.
#
# Note that a tool the config allows is never denied here even when a scenario
# forbids it — 04 forbids Write and Edit, which every other scenario needs, and
# the point there is to catch the reach, not to make it impossible.

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
    --disallowed-tools "${SUT_DISALLOWED_TOOLS[@]}" \
    --output-format stream-json --verbose \
    --max-budget-usd "$BUDGET") >"$raw" 2>"$OUT_DIR/raw/turn-$turn.err" || true

  # Every assistant text block of the turn, in order, not just the last one.
  # `.result` holds only the final block, so any prose the agent emitted
  # *before* a tool call was dropped from transcript.md and transcript.json —
  # and a decline or a refusal is exactly that shape: "I'm not going to run
  # that. Let me re-read what you have." then a Read. The checker was grading a
  # conversation the founder never had, with the declines cut out of it.
  #
  # This changes two things at once, deliberately: what the founder sees next
  # (run_founder is handed this string) and what check.mjs reads.
  local text
  text="$(jq -rs '[.[] | select(.type=="assistant") | .message.content[]?
                  | select(.type=="text") | .text | select(. != "")]
                 | join("\n\n")' <"$raw")"
  # A turn that produced only tool calls has no text block; fall back to the
  # result envelope rather than reporting silence, which the caller reads as
  # "the agent has stopped".
  if [[ -z "${text//[[:space:]]/}" ]]; then
    text="$(jq -rs '[.[] | select(.type=="result") | .result // ""] | last // ""' <"$raw")"
  fi
  printf '%s\n' "$text"
}

# The persona is reminded of the stop rule on every turn rather than once in the
# system prompt. Relying on the system prompt alone let a run degenerate into a
# polite closing loop — the agent had plainly finished, and the founder kept
# saying "understood" instead of emitting the sentinel.
#
# What counts as "finished" is the one skill-specific sentence in this prompt,
# so it comes from the config: a to-vision session ends differently from a
# to-pitch one that failed its assumption gate.
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
if $FINISHED_WHEN. Do not thank it, do
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

  agent_text="$(run_sut "${next_msg:-$SLASH_COMMAND}" "$turn")"
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

# Where the artifact landed is artifact.mjs's answer, not a `[[ -f ]]` test:
# config.artifact.path is a glob, because a to-pitch session picks its own slug
# at runtime and no config can name the path in advance. Resolving it here in
# bash — with globstar, or find -path — would be a second copy of the matching
# rule, and the checker's stray-write exemption uses the first one.
ARTIFACT_MATCHES=()
mapfile -t ARTIFACT_MATCHES < <(node "$HARNESS_DIR/artifact.mjs" "$CONFIG" "$WORKSPACE")

case "${#ARTIFACT_MATCHES[@]}" in
  0)
    ARTIFACT_STATE=none
    echo "artifact   : none"
    ;;
  1)
    ARTIFACT_STATE=written
    cp "$WORKSPACE/${ARTIFACT_MATCHES[0]}" "$OUT_DIR/artifact.md"
    echo "artifact   : written (${ARTIFACT_MATCHES[0]})"
    ;;
  *)
    # Two files matching one skill's artifact pattern means the session produced
    # two artifacts where it may produce one. Copying either would hide that, so
    # copy neither: workspace-files.txt already lists both, and check.mjs fails
    # floor/artifact-unique on exactly this.
    ARTIFACT_STATE=ambiguous
    echo "artifact   : AMBIGUOUS — ${#ARTIFACT_MATCHES[@]} files match $ARTIFACT_PATH" >&2
    printf '             %s\n' "${ARTIFACT_MATCHES[@]}" >&2
    ;;
esac

# Any file the SUT wrote outside its own artifact — a stray glossary, a roadmap,
# a CONTEXT.md — is itself a finding, so record the whole tree. Seeded fixtures
# show up here too; check.mjs knows which paths were seeded and exempts them.
(cd "$WORKSPACE" && find . -type f -not -path './.claude/*' | sort) \
  >"$OUT_DIR/workspace-files.txt"

jq -n \
  --arg scenario "$SCENARIO" \
  --arg model "$MODEL" \
  --arg ended "$ended" \
  --argjson turns "$turn" \
  --arg artifact "$ARTIFACT_STATE" \
  '{scenario:$scenario, model:$model, turns:$turns, endedBecause:$ended, artifact:$artifact}' \
  >"$OUT_DIR/run.json"

echo
echo "done — $turn turns, ended: $ended"
