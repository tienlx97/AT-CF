# Architecture

ANH-TU-COFFEE is a Next.js App Router website. This file is the map of how code
is organized; it grows with the code. Product scope lives in `openspec/project.md`.

## System diagram

```
browser ──► Next.js (src/app routes, server + client components)
               │
               ├── src/features/<feature>/   one slice per product area
               └── src/shared/               code used by several features
```

No backend, database or CMS yet. Adding one is an ADR in `docs/adr/` first.

## Layer responsibilities

Each of `src/features/<feature>/` and `src/shared/` uses the same layers, and
imports only flow left to right:

`types → config → api → hooks → components`

| Layer | Holds |
|---|---|
| `types` | JSDoc typedefs and shapes |
| `config` | constants, static content, schemas |
| `api` | data access and pure helpers (no React) |
| `hooks` | React hooks over `api`/`config` |
| `components` | React components (`.jsx`) |

`src/app/` holds routes, layouts and global CSS; it composes features through
their `index.js`.

## Module boundaries (mechanically enforced)

- A feature never imports another feature directly; shared code moves to `src/shared/`.
- Outside a feature, import it only through `src/features/<feature>/index.js`.
- `src/shared/` never imports a feature.
- No upward imports between layers, no cycles.

Rules: `harness/structure.rules.cjs`, run by `./harness/verify.sh` (structure step).

## Current inventory

Empty: no application source yet. The first change adds the app shell and the
first feature from the design brief, and updates this section.
