#!/usr/bin/env node
// Windows completion gate (ADR-0004, harness/README.md "Windows host").
//   node harness/verify-wsl.mjs [--change CHANGE]
// Git Bash lacks flock and `next build` would clobber a running dev server's
// .next, so verify.sh runs in a dedicated WSL clone at the current HEAD plus
// every uncommitted change (Git-normalized, so evidence matches this checkout),
// then the run directory is copied back and checked here with task.mjs status.
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { wslCollectScript, wslGateScript } from './lib/windows.mjs';

const args = process.argv.slice(2);
if (!(args.length === 0 || (args.length === 2 && args[0] === '--change' && args[1]))) {
  console.error('Usage: node harness/verify-wsl.mjs [--change CHANGE]');
  process.exit(2);
}
const change = args[1];
if (process.platform !== 'win32') {
  console.error('verify-wsl is for Windows hosts; run ./harness/verify.sh directly.');
  process.exit(2);
}
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const git = (gitArgs, env) => execFileSync('git', gitArgs, { cwd: root, env: { ...process.env, ...env }, maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
const wslPath = (path) => execFileSync('wsl.exe', ['-e', 'wslpath', '-a', path.replace(/\\/g, '/')], { encoding: 'utf8' }).trim();
const wsl = (script, stdout) => spawnSync('wsl.exe', ['-e', 'bash', '-s'], { input: script, stdio: ['pipe', stdout, 'inherit'], encoding: 'utf8' });

// Stage everything (tracked edits, deletions, untracked files) into a throwaway
// index so the patch carries Git-normalized content, never CRLF working bytes.
const work = mkdtempSync(join(tmpdir(), 'harness-gate-'));
let status = 1;
try {
  const index = join(work, 'index');
  const realIndex = resolve(root, git(['rev-parse', '--git-path', 'index']).toString().trim());
  if (existsSync(realIndex)) copyFileSync(realIndex, index);
  git(['add', '-A'], { GIT_INDEX_FILE: index });
  const patch = git(['diff', '--cached', '--binary', '--full-index', 'HEAD'], { GIT_INDEX_FILE: index });
  const patchFile = join(work, 'changes.patch');
  writeFileSync(patchFile, patch);
  console.log(`verify-wsl: HEAD ${git(['rev-parse', '--short', 'HEAD']).toString().trim()} + ${patch.length} byte working-tree patch`);

  const repo = wslPath(root);
  const gateDir = process.env.HARNESS_WSL_GATE_DIR;
  const run = wsl(wslGateScript({ repo, gateDir, patchFile: wslPath(patchFile), change }), 'inherit');
  if (run.error) throw run.error;
  status = run.status ?? 1;

  const collected = wsl(wslCollectScript({ repo, gateDir }), 'pipe');
  const runName = collected.stdout?.trim();
  if (!runName) {
    console.error('verify-wsl: the gate produced no run directory.');
    status ||= 1;
  } else {
    console.log(`verify-wsl: evidence copied to harness/runs/${runName}/`);
    const check = spawnSync(process.execPath, ['harness/task.mjs', 'status', `harness/runs/${runName}`], { cwd: root, stdio: 'inherit' });
    if (status === 0 && check.status !== 0) status = check.status ?? 1;
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
process.exit(status);
