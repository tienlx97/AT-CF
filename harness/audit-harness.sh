#!/usr/bin/env bash
# Audits that the harness itself is intact (the 5 subsystems:
# instructions, state, verification, scope, lifecycle) plus the
# OpenAI-standard layers: docs map, structural rules, entropy management.
set -uo pipefail
cd "$(dirname "$0")/.."

ok=0; bad=0
check() {
  if eval "$2"; then echo "✔ $1"; ok=$((ok+1)); else echo "✘ $1"; bad=$((bad+1)); fi
}

echo "── Instructions (map, not manual) ──"
check "AGENTS.md exists"                     "[ -f AGENTS.md ]"
check "AGENTS.md is a map (≤ 120 lines)"     "[ \$(wc -l < AGENTS.md) -le 120 ]"
check "CLAUDE.md exists"                     "[ -f CLAUDE.md ]"
check "docs/architecture.md exists"          "[ -f docs/architecture.md ]"
check "docs/adr/ exists"                     "[ -d docs/adr ]"
check "openspec/project.md exists"           "[ -f openspec/project.md ]"

echo "── State ──"
check "harness/PROGRESS.md exists"           "[ -f harness/PROGRESS.md ]"
check "PROGRESS.md fits a session (≤ 2000 lines; node harness/progress-rotate.mjs)" "[ \$(wc -l < harness/PROGRESS.md) -le 2000 ]"
check "agent harness ADR exists (ADR-0004)"  "[ -f docs/adr/0004-deepseek-harness.md ]"
check "dsh project overlay exists"           "[ -f harness/dsh/project.cordis.patch.yml ]"
check "Engram local DB is never tracked"     "! git ls-files --error-unmatch .engram/engram.db >/dev/null 2>&1"
check "task workflow skill exists"           "[ -f .agents/skills/project-task/SKILL.md ]"
check "openspec/changes/ exists"             "[ -d openspec/changes ]"
check "openspec/archive/ exists"             "[ -d openspec/archive ]"

echo "── Verification (mechanical constraints) ──"
check "harness/verify.sh executable"         "[ -x harness/verify.sh ]"
check "structural rules present"             "[ -f harness/structure.rules.cjs ]"
check "GOLDEN_RULES.md exists"               "[ -f harness/GOLDEN_RULES.md ]"
check "harness self-tests exist"             "[ -f harness/tests/structure-rules.test.cjs ]"
check "readiness check executable"           "[ -x harness/checks/project-readiness.sh ]"
check "memory secret check executable"       "[ -x harness/checks/memory-secrets.sh ]"
check "test:harness npm script exists"       "node -e 'const p=require(\"./package.json\"); process.exit(p.scripts?.[\"test:harness\"] ? 0 : 1)'"

check "gate runner and evidence writer present" "[ -f harness/lib/runner.sh ] && [ -f harness/lib/evidence.mjs ]"
check "gate failure-path tests exist" "[ -f harness/tests/runner.test.cjs ]"
check "gate shell syntax valid" "bash -n harness/verify.sh && bash -n harness/lib/runner.sh && bash -n harness/checks/structure.sh && bash -n harness/test-unit.sh"
check "gate operating guide exists" "[ -f harness/README.md ]"
check "no CRLF committed (Windows and WSL gate must see the same bytes)" "! git ls-files --eol | grep -qE '^i/(crlf|mixed)'"
check "Windows bridges present (Git Bash runner, WSL gate)" "[ -f harness/sh.mjs ] && [ -f harness/verify-wsl.mjs ] && [ -f harness/lib/windows.mjs ]"
case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*)
    # Git Bash has no flock; the gate itself runs in WSL (node harness/verify-wsl.mjs).
    check "WSL available for the Windows gate" "command -v wsl.exe >/dev/null" ;;
  *)
    check "timeout and lock tools available" "command -v timeout >/dev/null && command -v flock >/dev/null" ;;
esac

check "task workflow implementation and tests exist" "[ -f harness/task.mjs ] && [ -f harness/lib/workflow.mjs ] && [ -f harness/tests/workflow.test.cjs ]"
check "harness design and ADR exist" "[ -f docs/harness-design.md ] && [ -f docs/adr/0003-task-aware-harness.md ]"

echo "── Entropy management ──"
check "harness/ENTROPY.md exists"            "[ -f harness/ENTROPY.md ]"
check "quality-grades.json exists"           "[ -f harness/quality-grades.json ]"

echo "── Scope ──"
check "change template has tasks.md"         "[ -f openspec/changes/_template/tasks.md ]"
check "change template has proposal.md"      "[ -f openspec/changes/_template/proposal.md ]"
check "change template has design.md"        "[ -f openspec/changes/_template/design.md ]"
check "change template has specs/"           "[ -d openspec/changes/_template/specs ]"

echo "── Lifecycle ──"
check "init.sh exists and executable"        "[ -x init.sh ]"

echo
echo "$ok passed, $bad failed"
[ "$bad" -eq 0 ]
