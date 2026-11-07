const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { needsPackage } = require("./support/platform.cjs");

const projectRoot = path.resolve(__dirname, "../..");
const config = require(path.join(projectRoot, "harness/structure.rules.cjs"));

async function runCruise(files) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "harness-structure-"));
  for (const [name, contents] of Object.entries(files)) {
    const target = path.join(cwd, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }

  try {
    const { cruise } = await import("dependency-cruiser");
    const result = await cruise(["src"], {
      ...config.options,
      baseDir: cwd,
      validate: true,
      ruleSet: { forbidden: config.forbidden },
      outputType: "json",
    });
    const output = typeof result.output === "string"
      ? JSON.parse(result.output)
      : result.output;
    return output.summary.violations.map((violation) => violation.rule.name);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
}

test("accepts imports declared in the layer allowlist", { skip: needsPackage("dependency-cruiser") }, async () => {
  const violations = await runCruise({
    // src/shared/* — types → config → api → hooks → components
    "src/shared/types/id.ts": "export const id = 1;\n",
    "src/shared/config/index.ts": "import { id } from '../types/id'; export { id };\n",
    "src/shared/api/index.ts": "import { id } from '../config'; export { id };\n",
    "src/shared/hooks/index.ts": "import { id } from '../api'; export { id };\n",
    "src/shared/components/index.ts": "import { id } from '../hooks'; export { id };\n",
    // src/features/<feature>/* — same layer order, scoped per feature
    "src/features/demo/types/id.ts": "export const id = 1;\n",
    "src/features/demo/config/index.ts": "import { id } from '../types/id'; export { id };\n",
    "src/features/demo/api/index.ts": "import { id } from '../config'; export { id };\n",
    "src/features/demo/hooks/index.ts": "import { id } from '../api'; export { id };\n",
    "src/features/demo/components/index.ts": "import { id } from '../hooks'; export { id };\n",
    "src/features/demo/index.ts": "import { id } from './components'; export { id };\n",
    // src/app/ (routing/wiring) consumes the feature only via its public index.ts
    "src/app/page.ts": "import { id } from '../features/demo/index'; export { id };\n",
  });
  assert.deepEqual(violations, []);
});

test("reports every protected boundary", { skip: needsPackage("dependency-cruiser") }, async () => {
  const violations = await runCruise({
    // shared layer-order violation: types (allows nothing) importing config
    "src/shared/config/index.ts": "export const x = 1;\n",
    "src/shared/types/bad.ts": "import { x } from '../config'; export const y = x;\n",

    // feature layer-order violation: same shape, scoped to one feature
    "src/features/other/config/index.ts": "export const x = 1;\n",
    "src/features/other/types/bad.ts": "import { x } from '../config'; export const y = x;\n",
    "src/features/other/components/widget.ts": "export const x = 1;\n",

    // feature-to-feature isolation violation
    "src/features/beta/components/widget.ts": "export const x = 1;\n",
    "src/features/alpha/components/widget.ts":
      "import { x } from '../../beta/components/widget'; export const y = x;\n",

    // shared must not depend on a feature
    "src/shared/components/bad.ts":
      "import { x } from '../../features/other/config'; export const y = x;\n",

    // deep import into a feature's internals, bypassing its public index.ts
    "src/app/direct.ts":
      "import { x } from '../features/other/components/widget'; export const y = x;\n",

    // circular dependency within the same layer
    "src/shared/hooks/a.ts": "import { b } from './b'; export const a = b;\n",
    "src/shared/hooks/b.ts": "import { a } from './a'; export const b = a;\n",
  });
  const details = JSON.stringify(violations);
  assert.ok(violations.includes("no-shared-types-to-config"), details);
  assert.ok(violations.includes("no-feature-types-to-config"), details);
  assert.ok(violations.includes("no-feature-to-feature"), details);
  assert.ok(violations.includes("no-shared-to-feature"), details);
  assert.ok(violations.includes("no-deep-feature-imports"), details);
  assert.ok(violations.includes("no-circular"), details);
});
