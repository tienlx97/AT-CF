// Windows bridges for the Bash gate (ADR-0004). Agents on Windows (dsh runs
// PowerShell) must never reach `bash` through PATH: in PowerShell it resolves to
// C:\Windows\System32\bash.exe, i.e. WSL, against a different Node and checkout.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

/** Git for Windows layout: <root>/mingw64/libexec/git-core → <root>/bin/bash.exe. */
export function gitBashFromExecPath(execPath) {
  const normalized = execPath.trim().replace(/\\/g, '/').replace(/\/+$/, '');
  if (!/\/(mingw64|mingw32|clangarm64)\/libexec\/git-core$/i.test(normalized)) return null;
  return join(dirname(dirname(dirname(normalized))), 'bin', 'bash.exe');
}

export function resolveBash({ platform = process.platform, run = execFileSync, exists = existsSync } = {}) {
  if (platform !== 'win32') return 'bash';
  const candidate = gitBashFromExecPath(run('git', ['--exec-path'], { encoding: 'utf8' }));
  if (!candidate || !exists(candidate)) {
    throw new Error('Git Bash not found next to git.exe. Install Git for Windows (with Bash); do not use WSL bash.exe.');
  }
  return candidate;
}

const SAFE_CHANGE = /^[a-z0-9][a-z0-9._-]*$/i;
const quote = (value) => `'${String(value).replace(/'/g, `'\\''`)}'`;
const DEFAULT_GATE = '"$HOME/.harness-gate/ANH-TU-COFFEE"';
const gateExpression = (gateDir) => (gateDir ? quote(gateDir) : DEFAULT_GATE);

/** Copies the run directory the gate script recorded back into the Windows checkout. */
export function wslCollectScript({ repo, gateDir }) {
  return [
    'set -euo pipefail',
    `REPO=${quote(repo)}; GATE=${gateExpression(gateDir)}`,
    'RUN="$(cat "$GATE/.git/harness-run" 2>/dev/null || true)"',
    '[ -n "$RUN" ] && [ -d "$GATE/harness/runs/$RUN" ] || exit 0',
    'mkdir -p "$REPO/harness/runs" && cp -r "$GATE/harness/runs/$RUN" "$REPO/harness/runs/"',
    'printf "%s" "$RUN"',
  ].join('\n');
}

/**
 * Bash run inside WSL by verify-wsl.mjs. The gate clone is dedicated: it is only
 * reset when it carries the marker file this script created.
 */
export function wslGateScript({ repo, gateDir, patchFile, change }) {
  if (change !== undefined && !SAFE_CHANGE.test(change)) throw new Error(`Invalid change name: ${change}`);
  const verify = change ? `./harness/verify.sh --change ${quote(change)}` : './harness/verify.sh';
  return [
    'set -euo pipefail',
    'export PATH="$HOME/.local/node/bin:$PATH"',
    'command -v node >/dev/null && command -v pnpm >/dev/null || { echo "WSL needs Node + pnpm under ~/.local/node (harness/README.md)." >&2; exit 3; }',
    `REPO=${quote(repo)}; GATE=${gateExpression(gateDir)}; PATCH=${quote(patchFile)}`,
    // The Windows checkout under /mnt is owned by another uid; trust it for this read only.
    'SAFE=(-c "safe.directory=$REPO" -c "safe.directory=$REPO/.git")',
    'if [ ! -d "$GATE/.git" ]; then',
    '  [ ! -e "$GATE" ] || { echo "$GATE exists but is not a gate clone; refusing to touch it." >&2; exit 3; }',
    '  mkdir -p "$(dirname "$GATE")" && git "${SAFE[@]}" clone -q --no-checkout "$REPO" "$GATE" && touch "$GATE/.git/harness-gate"',
    'fi',
    '[ -f "$GATE/.git/harness-gate" ] || { echo "$GATE was not created by verify-wsl; refusing to reset it." >&2; exit 3; }',
    'cd "$GATE"',
    'git "${SAFE[@]}" fetch -q "$REPO" HEAD',
    'git checkout -q --force --detach FETCH_HEAD',
    'git clean -qfdx -e node_modules -e .pnpm-store -e harness/runs',
    '[ ! -s "$PATCH" ] || git apply --binary --whitespace=nowarn "$PATCH"',
    'pnpm install --frozen-lockfile --reporter=silent',
    'ls -1 harness/runs 2>/dev/null | sort > .git/harness-runs-before || true',
    'set +e',
    verify,
    'status=$?',
    'set -e',
    'ls -1 harness/runs 2>/dev/null | sort | comm -13 .git/harness-runs-before - | tail -n 1 > .git/harness-run',
    'exit "$status"',
  ].join('\n');
}
