const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const test = require('node:test');

const windows = import(pathToFileURL(path.resolve(__dirname, '../lib/windows.mjs')).href);

test('Git Bash is derived from git --exec-path, never from PATH (where WSL bash.exe wins)', async () => {
  const { gitBashFromExecPath, resolveBash } = await windows;
  assert.equal(
    gitBashFromExecPath('E:/apps/core/Git/mingw64/libexec/git-core\n').replace(/\\/g, '/'),
    'E:/apps/core/Git/bin/bash.exe',
  );
  assert.equal(gitBashFromExecPath('C:\\Program Files\\Git\\mingw64\\libexec\\git-core').replace(/\\/g, '/'), 'C:/Program Files/Git/bin/bash.exe');
  assert.equal(gitBashFromExecPath('/usr/lib/git-core'), null);
  assert.equal(resolveBash({ platform: 'linux' }), 'bash');
  const run = () => 'C:/Git/mingw64/libexec/git-core';
  assert.match(resolveBash({ platform: 'win32', run, exists: () => true }).replace(/\\/g, '/'), /^C:\/Git\/bin\/bash\.exe$/);
  assert.throws(() => resolveBash({ platform: 'win32', run, exists: () => false }), /Git Bash not found/);
});

test('WSL gate script is valid Bash, refuses foreign directories and rejects unsafe change names', async () => {
  const { resolveBash, wslCollectScript, wslGateScript } = await windows;
  const script = wslGateScript({ repo: "/mnt/d/it's repo", patchFile: '/mnt/c/tmp/changes.patch', change: 'adopt-deepseek-harness' });
  assert.match(script, /refusing to touch it/);
  assert.match(script, /refusing to reset it/);
  assert.match(script, /harness-gate"/);
  assert.match(script, /\.\/harness\/verify\.sh --change 'adopt-deepseek-harness'/);
  assert.match(script, /'\/mnt\/d\/it'\\''s repo'/);
  assert.match(wslGateScript({ repo: '/r', patchFile: '/p' }), /^\.\/harness\/verify\.sh$/m);
  assert.throws(() => wslGateScript({ repo: '/r', patchFile: '/p', change: 'x; rm -rf ~' }), /Invalid change name/);
  const bash = resolveBash();
  for (const body of [script, wslCollectScript({ repo: '/r' }), wslCollectScript({ repo: '/r', gateDir: '/g' })]) {
    const syntax = spawnSync(bash, ['-n'], { input: body, encoding: 'utf8' });
    assert.equal(syntax.status, 0, syntax.stderr);
  }
});
