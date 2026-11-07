# Project Context

<!-- Project-wide truth that outlives individual changes. Keep current. -->

## Purpose

ANH-TU-COFFEE is the website of Anh Tú Coffee. Its pages, audience, content and
visual direction come from the owner's design brief; until that brief is recorded
here, no product scope is assumed. The first OpenSpec change turns the brief into
this section and the change's `proposal.md`.

## Tech stack

- Language/runtime: JavaScript (Node 22 LTS, pnpm 11)
- Framework: Next.js (App Router)
- UI library and styling: not chosen yet; the first change decides them (an ADR)
  from the design brief. Design work follows the `design-taste-frontend` skill
- Data: none yet; any backend or CMS is a decision recorded as an ADR first
- Testing: Node's built-in test runner (`node --test`)

## Architecture

Feature-based — see `docs/architecture.md` for the full map:

```
src/features/<feature>/{types,config,api,hooks,components}
src/shared/{types,config,api,hooks,components}
```

Layer order inside each tree: `types → config → api → hooks → components`.
Features are isolated and reachable from outside only via their `index.js`;
`src/shared/` cannot depend on a feature. Enforced by the structural test in
`./harness/verify.sh` (dependency-cruiser config: `harness/structure.rules.cjs`).

## Conventions (linted, not aspirational)

- Naming: kebab-case files, camelCase functions, PascalCase React components.
  `.jsx` for any file containing JSX, `.js` for logic without JSX
  (`react/jsx-filename-extension` in `eslint.config.mjs`).
- Module boundaries: features only via their `index.js`; no cross-feature imports.
- Errors: handled at boundaries (`src/app`, each tree's `api`/`hooks`); no empty catch.
- Components, styling and color: decided with the UI library in the first change,
  then written here and backed by a lint rule.
- Every convention here must map to a lint/structural rule; one that cannot be
  checked mechanically goes to `harness/GOLDEN_RULES.md` with a plan to automate it.

## Measurable quality constraints (numbers, not adjectives)

| Constraint | Threshold | How measured |
|---|---|---|
| Shared JS bundle (gzip) | < 250 kB | `harness/checks/quality.mjs` (verify:quality) |
| Lint errors | 0 | `pnpm lint` in the gate |
| Layer / feature boundary violations | 0 | structural test in the gate |
