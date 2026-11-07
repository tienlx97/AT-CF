const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");
const test = require("node:test");

const verify = fs.readFileSync(
  path.resolve(__dirname, "../verify.sh"),
  "utf8"
);

test("application verification never silently skips required scripts", () => {
  assert.doesNotMatch(verify, /--if-present/);
  for (const script of ["lint", "typecheck", "test:unit", "build", "verify:quality"]) {
    assert.match(verify, new RegExp(`require_step [^\\n]*${script.replace(":", "\\:")}`));
  }
});

test("readiness, memory safety, and harness tests are always in the gate", () => {
  assert.match(verify, /step "project-readiness"/);
  assert.match(verify, /step "memory-secrets"/);
  assert.match(verify, /step "harness-tests"/);
});

const aliasProbe = path.resolve(__dirname, "../../src/shared/config/site.js");

test("Node tests resolve the same @ alias as Next and TypeScript", {
  skip: !require("node:fs").existsSync(aliasProbe) && "no src/shared/config/site.js yet",
}, () => {
  const root = path.resolve(__dirname, "../..");
  const registerAlias = path.join(root, "harness/register-node-alias.mjs");
  const result = spawnSync(
    process.execPath,
    [
      "--import",
      pathToFileURL(registerAlias).href,
      "--input-type=module",
      "--eval",
      "await import('@/shared/config/site.js')",
    ],
    { cwd: root, encoding: "utf8" }
  );

  assert.equal(result.status, 0, result.stderr);
});
