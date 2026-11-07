import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readlinkSync, readdirSync, realpathSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const digest = (value) => createHash('sha256').update(value).digest('hex');
export function git(root, ...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
}
// Administrative records may change when closing a task; they are not code inputs.
function administrative(file) {
  return file.startsWith('.engram/') || file.startsWith('harness/runs/') || file.startsWith('harness/progress/') ||
    file === 'harness/PROGRESS.md' || /^openspec\/changes\/[^/]+\/(tasks|proposal|handoff)\.md$/.test(file);
}
// Sections of PROGRESS.md, then of the monthly archives (newest month first),
// in reading order: newest first, as harness/progress-rotate.mjs keeps them.
function progressHistory(root) {
  const sections = (file) => readFileSync(file, 'utf8').replace(/\r\n/g, '\n').split(/(?=^#{1,2} )/m).filter((part) => /^#{1,2} /.test(part));
  const result = existsSync(join(root, 'harness/PROGRESS.md')) ? sections(join(root, 'harness/PROGRESS.md')) : [];
  const archive = join(root, 'harness/progress');
  if (existsSync(archive)) {
    for (const name of readdirSync(archive).filter((file) => /^\d{4}-\d{2}\.md$/.test(file)).sort().reverse()) {
      result.push(...sections(join(archive, name)));
    }
  }
  return result;
}
export function fingerprint(root) {
  let files;
  try {
    files = [...new Set(git(root, 'ls-files', '-c', '-o', '--exclude-standard', '-z').split('\0').filter(Boolean))].sort();
  } catch {
    return null;
  }
  // Hash what Git would store, so a Windows checkout (core.autocrlf, no exec
  // bits, symlinks as files) and the Linux/WSL gate clone of the same tree agree.
  const indexModes = new Map();
  for (const line of git(root, 'ls-files', '-s', '-z').split('\0').filter(Boolean)) {
    indexModes.set(line.slice(line.indexOf('\t') + 1), line.split(' ', 1)[0]);
  }
  const windows = process.platform === 'win32';
  const entries = [];
  for (const file of files.filter((file) => !administrative(file))) {
    if (file.includes('\n')) throw new Error(`Unsupported verification input name: ${JSON.stringify(file)}`);
    const absolute = join(root, file);
    let stat;
    try { stat = lstatSync(absolute); } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      // Deleted index entries must hash like their post-commit absence.
      continue;
    }
    if (!stat.isFile() && !stat.isSymbolicLink()) throw new Error(`Unsupported verification input: ${file}`);
    const mode = indexModes.get(file);
    const link = stat.isSymbolicLink() || (windows && mode === '120000');
    // A symlink's own mode is 0777 on Linux and meaningless everywhere: never "executable".
    const executable = !link && (windows ? mode === '100755' : Boolean(stat.mode & 0o111));
    entries.push({ file, link, executable, target: stat.isSymbolicLink() ? readlinkSync(absolute) : null });
  }
  const regular = entries.filter((entry) => entry.target === null);
  const blobs = regular.length
    ? execFileSync('git', ['hash-object', '--stdin-paths'], {
      cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['pipe', 'pipe', 'ignore'],
      input: `${regular.map((entry) => entry.file).join('\n')}\n`,
    }).trim().split('\n')
    : [];
  if (blobs.length !== regular.length) throw new Error('git hash-object returned an unexpected number of digests');
  regular.forEach((entry, index) => { entry.blob = blobs[index]; });
  const hash = createHash('sha256');
  for (const entry of entries) {
    const blob = entry.blob ?? gitBlobId(Buffer.from(entry.target));
    hash.update(JSON.stringify([entry.file, entry.link ? 'link' : 'file', entry.executable, blob]));
  }
  return { algorithm: 'sha256-v2', digest: hash.digest('hex'), files: entries.length };
}
function gitBlobId(bytes) {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}
export function inside(root, path) {
  const base = realpathSync(root);
  const actual = realpathSync(path);
  if (actual !== base && !actual.startsWith(`${base}${sep}`)) throw new Error(`Path outside expected directory: ${path}`);
  return actual;
}
export function parseTasks(markdown) {
  let fence = null;
  const tasks = [];
  for (const [index, line] of markdown.split('\n').entries()) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      continue;
    }
    if (fence) continue;
    const match = line.match(/^\s*- \[([ xX])\]\s+(\d+(?:\.\d+)+)\s+(.+)$/);
    if (!match && /^\s*- \[ \]/.test(line)) throw new Error(`Unchecked task needs a numbered ID at line ${index + 1}`);
    if (match && match[3].length > 2000) throw new Error('Task title exceeds 2000 characters; move detail to specs');
    if (match) tasks.push({ id: match[2], title: match[3], done: match[1] !== ' ', line: index + 1 });
  }
  if (new Set(tasks.map((task) => task.id)).size !== tasks.length) throw new Error('Duplicate task IDs');
  return tasks;
}
export function taskContext(root, change, taskId) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(change)) throw new Error('Use an active change slug (letters, numbers and hyphens)');
  const dir = inside(join(root, 'openspec/changes'), join(root, 'openspec/changes', change));
  // Normalize CRLF (Windows core.autocrlf) so parsing and the contract digest match Linux.
  const read = (name) => readFileSync(inside(dir, join(dir, name)), 'utf8').replace(/\r\n/g, '\n');
  const proposal = read('proposal.md');
  const tasks = parseTasks(read('tasks.md'));
  const task = taskId ? tasks.find((item) => item.id === taskId) : tasks.find((item) => !item.done);
  if (!task) throw new Error(taskId ? `Task ${taskId} no longer exists` : `No unchecked numbered task in ${change}`);
  const specs = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile() && entry.name.endsWith('.md')) specs.push(relative(root, path).split(sep).join('/'));
    }
  }
  if (existsSync(join(dir, 'specs'))) walk(inside(dir, join(dir, 'specs')));
  const recent = progressHistory(root).filter((section) => section.split('\n', 1)[0].includes(change)).slice(0, 3);
  return {
    change,
    task,
    contractDigest: digest(JSON.stringify({ id: task.id, title: task.title, proposal: proposal.replace(/^\*\*Status:\*\*.*$/m, '') })),
    proposalExcerpt: proposal.slice(0, 1800),
    sources: ['AGENTS.md', 'harness/GOLDEN_RULES.md', 'openspec/project.md', 'docs/architecture.md', 'docs/harness-design.md',
      `openspec/changes/${change}/proposal.md`, `openspec/changes/${change}/tasks.md`, ...specs.slice(0, 30)],
    specsTruncated: specs.length > 30,
    historyExcerpts: recent.map((section) => section.slice(0, 600)),
    historySource: 'harness/PROGRESS.md (+ harness/progress/<YYYY-MM>.md)',
    verifyCommand: `./harness/verify.sh --change ${change}`,
  };
}
export function inspectRun(root, runPath) {
  const directory = inside(join(root, 'harness/runs'), resolve(root, runPath));
  const report = JSON.parse(readFileSync(join(directory, 'summary.json'), 'utf8'));
  const reasons = [];
  if (report.schemaVersion !== 2) reasons.push('Legacy or unknown evidence schema; rerun verification');
  if (report.status !== 'passed' || report.exitCode !== 0) reasons.push(`Run is ${report.status ?? 'invalid'}, not passed`);
  if (!Array.isArray(report.steps) || !report.steps.length || report.steps.some((step) => step.exitCode !== 0)) reasons.push('Missing or failing step evidence');
  const current = fingerprint(root);
  if (!current || !report.inputs?.digest || current.digest !== report.inputs.digest || report.inputChangedDuringRun) reasons.push('Verification inputs changed or cannot be fingerprinted');
  if (report.task) {
    try {
      if (taskContext(root, report.task.change, report.task.id).contractDigest !== report.task.contractDigest) reasons.push('Task description or proposal changed');
    } catch (error) { reasons.push(error.message); }
  }
  return {
    run: relative(root, directory),
    status: report.status,
    fresh: reasons.length === 0,
    task: report.task ?? null,
    activeStep: report.activeStep ?? null,
    reasons,
    failedSteps: (report.steps ?? []).filter((step) => step.exitCode !== 0).map((step) => ({ name: step.name, exitCode: step.exitCode, log: `${relative(root, directory)}/${step.log}` })),
    durationSeconds: report.durationSeconds ?? null,
    uiEvidence: 'Not evaluated by this command; follow the task browser scenarios',
  };
}
