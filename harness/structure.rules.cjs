/**
 * Structural tests for the front-end dependency hierarchy (dependency-cruiser
 * config). This project is front-end only — the backend (data access,
 * business logic) lives in a separate project, so there is no repo/service
 * layer here. Instead:
 *
 *   - Layer order (within a feature, and within src/shared/):
 *       types → config → api → hooks → components
 *   - Feature isolation: src/features/<a> must not import src/features/<b>
 *     directly — promote shared code to src/shared/, or compose in src/app/.
 *   - src/shared/ must not import src/features/ — shared is the foundation
 *     layer, it cannot depend on a specific feature.
 *   - Consumers outside a feature (src/app/, src/shared/) may only import a
 *     feature's public src/features/<feature>/index.js, not its internals.
 *
 * src/app/ (Next.js App Router entrypoints) is the routing/wiring surface —
 * it is not one of the layers below, so it is not restricted by layer rules,
 * only by the deep-import rule (must go through a feature's index.js).
 *
 * Error messages teach the fix — keep them actionable.
 */
const LAYERS = ["types", "config", "api", "hooks", "components"];
const ALLOWED_IMPORTS = {
  types: [],
  config: ["types"],
  api: ["types", "config"],
  hooks: ["types", "config", "api"],
  components: ["types", "config", "api", "hooks"],
};

// Use an explicit allowlist so documentation and enforcement cannot diverge.
function layerOrderRules({ scope, fromPath, toPath }) {
  return LAYERS.flatMap((from) =>
    LAYERS.filter(
      (to) => to !== from && !ALLOWED_IMPORTS[from].includes(to)
    ).map((to) => ({
      name: `no-${scope}-${from}-to-${to}`,
      severity: "error",
      comment:
        `${fromPath(from)} must not import ${toPath(to)}. Allowed imports ` +
        `for ${from}: ${ALLOWED_IMPORTS[from].join(", ") || "none"}. Fix: ` +
        "move the shared contract to an allowed layer or invert the dependency.",
      from: { path: fromPath(from) },
      to: { path: toPath(to) },
    }))
  );
}

const sharedLayerRules = layerOrderRules({
  scope: "shared",
  fromPath: (layer) => `^src/shared/${layer}`,
  toPath: (layer) => `^src/shared/${layer}`,
});

// $1 backreferences the feature captured in from.path — dependency-cruiser
// does not support \k<name> backreferences across from/to, only $N.
const featureLayerRules = layerOrderRules({
  scope: "feature",
  fromPath: (layer) => `^src/features/([^/]+)/${layer}`,
  toPath: (layer) => `^src/features/$1/${layer}`,
});

module.exports = {
  forbidden: [
    ...sharedLayerRules,
    ...featureLayerRules,
    {
      name: "no-feature-to-feature",
      severity: "error",
      comment:
        "Features must not import each other directly. Fix: promote the " +
        "shared code to src/shared/, or compose both features together in src/app/.",
      from: { path: "^src/features/([^/]+)/" },
      to: { path: "^src/features/(?!$1/)[^/]+/" },
    },
    {
      name: "no-shared-to-feature",
      severity: "error",
      comment:
        "src/shared must not import src/features — shared is the foundation " +
        "layer and cannot depend on a specific feature. Fix: invert the dependency.",
      from: { path: "^src/shared/" },
      to: { path: "^src/features/" },
    },
    {
      name: "no-deep-feature-imports",
      severity: "error",
      comment:
        "Import a feature via its public src/features/<feature>/index.js, not a " +
        "deep path into its internals. Fix: export the symbol from the feature's " +
        "index.js and import from there.",
      from: { path: "^(?!src/features/)" },
      to: {
        path: "^src/features/[^/]+/.+",
        pathNot: "^src/features/[^/]+/index\\.(js|jsx|ts|tsx)$",
      },
    },
    {
      name: "no-circular",
      severity: "error",
      comment:
        "Circular dependency. Break the cycle by extracting the shared part into a lower layer.",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
  },
};
