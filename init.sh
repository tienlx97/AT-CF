#!/usr/bin/env bash
# Session initializer: install → verify environment → start.
# Every agent session runs this before touching code.
set -euo pipefail
cd "$(dirname "$0")"

echo "──► Installing dependencies"
if [ -f package.json ]; then
  if [ -f pnpm-lock.yaml ]; then
    pnpm install --frozen-lockfile
  else
    pnpm install
  fi
fi

echo "──► Auditing harness"
./harness/audit-harness.sh

echo "──► Environment ready. Start the app with your dev command, e.g.:"
echo "    pnpm dev -p 3000"
