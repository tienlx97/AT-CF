#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."

SOURCE_COUNT=0
if [ -d src ]; then
  SOURCE_COUNT=$(find src -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \) | wc -l)
fi
if [ -f .harness-template ]; then
  if [ "$SOURCE_COUNT" -gt 0 ]; then
    echo "Application source exists but .harness-template is still present."
    echo "Delete the marker and replace all project placeholders."
    exit 1
  fi
  echo "Template source mode: application-specific placeholders are allowed."
  exit 0
fi

PLACEHOLDER_PATTERN='PROJECT_DESCRIPTION|YYYY-MM-DD|\[What |\[Describe |\[e\.g\.|\[x\]|<name>|<timestamp>'
FOUND=0
for f in AGENTS.md docs/architecture.md harness/GOLDEN_RULES.md \
  harness/PROGRESS.md harness/quality-grades.json openspec/project.md; do
  [ -f "$f" ] || continue
  MATCHES=$(grep -En "$PLACEHOLDER_PATTERN" "$f" || true)
  if [ -n "$MATCHES" ]; then
    echo "$MATCHES" | sed "s|^|$f:|"
    FOUND=1
  fi
done
if [ "$FOUND" -eq 1 ]; then
  echo "Project placeholders remain. Replace them before verification can pass."
  exit 1
fi
