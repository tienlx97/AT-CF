#!/usr/bin/env bash
# Explicit files work across the supported Node versions (directory args do not).
set -euo pipefail
cd "$(dirname "$0")/.."
mapfile -d '' files < <(find src -type f \( -name '*.test.js' -o -name '*.test.mjs' -o -name '*.test.cjs' \) -print0 | sort -z)
if [ "${#files[@]}" -eq 0 ]; then
  echo 'No application tests found under src/' >&2
  exit 1
fi
node --import ./harness/register-node-alias.mjs --test "${files[@]}" "$@"
