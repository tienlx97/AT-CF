#!/usr/bin/env node
// Run a repository Bash script with the right Bash on every OS (ADR-0004):
//   node harness/sh.mjs ./init.sh
//   node harness/sh.mjs ./harness/audit-harness.sh
// On Windows this is Git Bash, never WSL's System32 bash.exe. The full
// completion gate on Windows is `node harness/verify-wsl.mjs` (no flock in Git Bash).
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveBash } from './lib/windows.mjs';

const [script, ...args] = process.argv.slice(2);
if (!script) {
  console.error('Usage: node harness/sh.mjs <script> [args...]');
  process.exit(2);
}
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const result = spawnSync(resolveBash(), [script, ...args], { cwd: root, stdio: 'inherit' });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
