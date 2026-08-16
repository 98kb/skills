#!/usr/bin/env bash
#
# Run the whole to-vision eval suite: every scenario, both halves of the grade.
#
#   ./run-all.sh              # all five scenarios
#   ./run-all.sh 01-cooperative-sharp 02b-evasive-hard-blocked
#
# Writes evals/runs/summary.json and prints a per-scenario table. Exits non-zero
# if any scenario failed, so this can gate CI.
#
set -uo pipefail

HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EVALS_DIR="$(cd "$HARNESS_DIR/.." && pwd)"

if [[ $# -gt 0 ]]; then
  SCENARIOS=("$@")
else
  mapfile -t SCENARIOS < <(cd "$EVALS_DIR/scenarios" && ls -d */ | tr -d /)
fi

mkdir -p "$EVALS_DIR/runs"

for scenario in "${SCENARIOS[@]}"; do
  echo
  echo "═══ $scenario ═══════════════════════════════════════════"
  "$HARNESS_DIR/run-scenario.sh" "$scenario"
  # check.mjs must run before judge.mjs: it records the disclosed flag set the
  # judge needs to decide which rubric failures are excused.
  node "$HARNESS_DIR/check.mjs" "$scenario" || true
  node "$HARNESS_DIR/judge.mjs" "$scenario" || true
done

echo
echo "═══ suite summary ═══════════════════════════════════════"
node "$HARNESS_DIR/summarize.mjs" runs
