#!/usr/bin/env bash
# Verification gate — the ONLY definition of "done".
# Evidence is written to harness/runs/<timestamp>/ for reviewers to replay.
# Customize commands for your stack; keep the gate structure.
set -uo pipefail
cd "$(dirname "$0")/.."

HARNESS_CHANGE=''
if [ "$#" -ne 0 ]; then
  if [ "$#" -ne 2 ] || [ "$1" != '--change' ] || [ -z "$2" ]; then
    echo 'Usage: ./harness/verify.sh [--change CHANGE]' >&2
    exit 1
  fi
  HARNESS_CHANGE="$2"
fi
export HARNESS_CHANGE
source harness/lib/runner.sh

SRC_FILE_COUNT=$(find src -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \) 2>/dev/null | wc -l)

step "harness-audit" ./harness/audit-harness.sh
step "project-readiness" ./harness/checks/project-readiness.sh
step "memory-secrets" ./harness/checks/memory-secrets.sh
step "no-format-churn" node harness/checks/no-format-churn.mjs

# ── 0. Generated sources ──────────────────────────────────────────
# A project with a theme build step (package.json `theme:build`)
# generates its theme sources first.
# lint/typecheck/structure
# below all resolve imports of these files, so they must exist first.
if has_pkg_script theme:build; then
  step "theme-build" pnpm run theme:build
fi

# ── 1. Static checks ─────────────────────────────────────────────
if [ "$SRC_FILE_COUNT" -gt 0 ]; then
  require_step "lint" lint
  require_step "typecheck" typecheck
else
  echo "──► app-checks"
  echo "    ℹ no application source found; running harness self-tests only"
fi

# ── 2. Structural tests (types → config → api → hooks → components)
if [ "$SRC_FILE_COUNT" -gt 0 ]; then
  step "structure" ./harness/checks/structure.sh
fi

# ── 3. Tests ─────────────────────────────────────────────────────
step "harness-tests" pnpm run test:harness
if [ "$SRC_FILE_COUNT" -gt 0 ]; then
  require_step "unit-tests" test:unit
fi

# ── 4. Build and thresholds: never measure stale output after a failed build.
if [ "$SRC_FILE_COUNT" -gt 0 ]; then
  if require_step "build" build; then
    require_step "quality-thresholds" verify:quality
  else
    echo "──► quality-thresholds blocked by failed build"
  fi
fi

# UI work additionally requires browser evidence; see harness/README.md.
exit "$fail"
