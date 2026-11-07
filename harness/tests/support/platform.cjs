// Skip reasons for harness tests that cannot run on every machine. A skipped
// test still runs in the real gate (Linux / WSL, CI), so the reason says where.
const GATE = 'runs in the WSL gate (node harness/verify-wsl.mjs) and CI';

// runner.sh needs flock and POSIX signals / file modes; Windows has neither.
const linuxOnly = process.platform === 'win32' ? `needs Linux (flock, POSIX signals and modes); ${GATE}` : false;

// A dependency missing from a Windows checkout (no `pnpm install` there): skip
// with the fix instead of failing on the import. On Linux (gate, CI) a missing
// package must still fail, so a dropped dependency is never skipped silently.
function needsPackage(name) {
  if (process.platform !== 'win32') return false;
  try {
    require.resolve(name, { paths: [require('node:path').resolve(__dirname, '../../..')] });
    return false;
  } catch {
    return `package ${name} is not installed here (run pnpm install); ${GATE}`;
  }
}

module.exports = { linuxOnly, needsPackage };
