#!/usr/bin/env bash
# Shared agent memory travels with Git, so it must never carry secrets (ADR-0004):
#   .engram/ — Engram `engram sync` export: manifest + gzipped JSONL chunks
set -euo pipefail
cd "$(dirname "$0")/../.."

SECRET_PATTERN='-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{20,}'
found=0

if [ -d .engram ]; then
  while IFS= read -r -d '' file; do
    case "$file" in
      *.gz) content=$(gzip -dc -- "$file") || { echo "Unreadable memory chunk: $file"; found=1; continue; } ;;
      *) content=$(cat -- "$file") ;;
    esac
    if grep -En -- "$SECRET_PATTERN" <<<"$content" | sed "s|^|$file:|"; then
      found=1
    fi
  done < <(find .engram -type f \( -name '*.gz' -o -name '*.json' -o -name '*.jsonl' \) -print0)
fi

if [ "$found" -ne 0 ]; then
  echo "Potential secret found in shared memory. Remove it (engram: delete the observation, re-export) and rotate it before committing."
  exit 1
fi
