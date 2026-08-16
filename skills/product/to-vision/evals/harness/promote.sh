#!/usr/bin/env bash
#
# Promote a scratch run into the committed graded-transcript record.
#
#   ./promote.sh <scenario-id> [...]
#   ./promote.sh --all
#
# evals/runs/ is scratch and gitignored; evals/transcripts/ is the checked-in
# evidence that the suite was actually run and what it produced. Promotion drops
# the raw stream-json (large, machine-specific) and keeps the transcript, the
# artifact, and both halves of the grade.
#
set -euo pipefail

HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EVALS_DIR="$(cd "$HARNESS_DIR/.." && pwd)"

if [[ "${1:-}" == "--all" ]]; then
  mapfile -t SCENARIOS < <(cd "$EVALS_DIR/scenarios" && ls -d */ | tr -d /)
else
  SCENARIOS=("$@")
fi

if [[ ${#SCENARIOS[@]} -eq 0 ]]; then
  echo "usage: promote.sh <scenario-id> [...] | --all" >&2
  exit 2
fi

for scenario in "${SCENARIOS[@]}"; do
  src="$EVALS_DIR/runs/$scenario"
  dst="$EVALS_DIR/transcripts/$scenario"
  if [[ ! -d "$src" ]]; then
    echo "skip $scenario — no run at $src" >&2
    continue
  fi
  mkdir -p "$dst"
  for f in transcript.md transcript.json toolcalls.json artifact.md \
           deterministic.json judge.json run.json workspace-files.txt; do
    [[ -f "$src/$f" ]] && cp "$src/$f" "$dst/$f"
  done
  echo "promoted $scenario → transcripts/$scenario"
done

node "$HARNESS_DIR/summarize.mjs" transcripts || true
