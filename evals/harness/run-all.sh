#!/usr/bin/env bash
#
# Run a skill's whole eval suite: every scenario, both halves of the grade.
#
#   ./run-all.sh <evals-dir|eval.config.json>
#   ./run-all.sh <evals-dir> 01-cooperative-sharp 02b-evasive-hard-blocked
#
# Writes <evals>/runs/summary.json and prints a per-scenario table. Exits
# non-zero if any scenario failed, so this can gate CI.
#
# Negative controls run first, before a single model call. They cost nothing and
# they answer the question a suite run cannot: would these scenarios notice if
# the skill misbehaved? A suite whose controls do not trip is not a suite that
# passed, it is a suite that cannot fail — so this stops rather than spending
# hours and real money producing a green report nobody should believe.
# EVAL_SKIP_NEGATIVE_CONTROLS=1 forces past it, for the case where you are
# knowingly mid-repair on the controls themselves.
#
set -uo pipefail

CONFIG_ARG="${1:-}"
if [[ -z "$CONFIG_ARG" ]]; then
  echo "usage: run-all.sh <evals-dir|eval.config.json> [scenario-id ...]" >&2
  exit 2
fi
shift

HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -d "$CONFIG_ARG" ]]; then
  EVALS_DIR="$(cd "$CONFIG_ARG" && pwd)"
else
  EVALS_DIR="$(cd "$(dirname "$CONFIG_ARG")" && pwd)"
fi

if [[ $# -gt 0 ]]; then
  SCENARIOS=("$@")
else
  mapfile -t SCENARIOS < <(cd "$EVALS_DIR/scenarios" && ls -d */ | tr -d /)
fi

mkdir -p "$EVALS_DIR/runs"

if [[ "${EVAL_SKIP_NEGATIVE_CONTROLS:-0}" != "1" ]]; then
  echo "═══ negative controls ═══════════════════════════════════"
  if ! node "$HARNESS_DIR/negative-control.mjs" "$EVALS_DIR" "${SCENARIOS[@]}"; then
    echo "negative controls failed — refusing to spend a suite run on scenarios" >&2
    echo "that cannot fail. Fix them, or set EVAL_SKIP_NEGATIVE_CONTROLS=1." >&2
    exit 2
  fi
fi

for scenario in "${SCENARIOS[@]}"; do
  echo
  echo "═══ $scenario ═══════════════════════════════════════════"
  "$HARNESS_DIR/run-scenario.sh" "$EVALS_DIR" "$scenario"
  # check.mjs must run before judge.mjs: it records the disclosed flag set the
  # judge needs to decide which rubric failures are excused.
  node "$HARNESS_DIR/check.mjs" "$EVALS_DIR" "$scenario" || true
  node "$HARNESS_DIR/judge.mjs" "$EVALS_DIR" "$scenario" || true
done

echo
echo "═══ suite summary ═══════════════════════════════════════"
node "$HARNESS_DIR/summarize.mjs" "$EVALS_DIR" runs
