# Running verification

Run `./init.sh` once to install the lockfile dependencies and audit the harness,
then `./harness/verify.sh` for the completion gate. Runtime prerequisites are
Node/pnpm from `package.json`, Bash, GNU coreutils (`timeout`) and util-linux
(`flock`). Linux/WSL and the Ubuntu CI runner provide these tools.

On a Windows host (Git Bash has no `flock`, and `next build` would rewrite the
`.next` of a dev server running from this checkout), run the gate with
`node harness/verify-wsl.mjs --change CHANGE` (ADR-0004). It needs, once, the
official Node 22 linux-x64 build (checksum against `SHASUMS256.txt`) and
`corepack` pnpm under `~/.local/node` in WSL. Each run fetches HEAD into the
dedicated clone `~/.harness-gate/ANH-TU-COFFEE` (override: `HARNESS_WSL_GATE_DIR`; it refuses
any directory it did not create), applies every uncommitted change as a
Git-normalized patch, runs `pnpm install --frozen-lockfile` and
`./harness/verify.sh`, copies `harness/runs/<run>/` back and runs
`node harness/task.mjs status` on it here. Other repo Bash scripts on Windows run
through Git Bash with `node harness/sh.mjs <script>`; bare `bash` in PowerShell is WSL.

The gate audits itself, checks project policies, generates theme sources (if a `theme:build` script exists), runs
lint/typecheck/dependency rules, runs harness and application tests separately,
then builds and measures the current build. Independent checks continue after
failure to collect useful diagnostics. A failed build blocks quality measurement
so an old `.next` cannot supply passing evidence. `pnpm test` still runs all tests;
`pnpm test:unit` explicitly enumerates `*.test.js`, `*.test.mjs` and `*.test.cjs`
under `src/` and fails if none exist. Put application tests there.

Each invocation writes an ignored directory under `harness/runs/` containing:

- Per-step `.log` files with stdout/stderr, including failures.
- `steps.jsonl`: completed steps with exit code and elapsed seconds.
- `summary.json`: schema version, running/passed/failed/interrupted status,
  Git revision and dirty flag at start, Node version, total duration and steps.

The summary is atomically replaced on normal exit and trapped INT/TERM. A hard
kill or machine crash leaves `running`, which is never evidence of a pass.
Timing is wall-clock time, rounded to seconds for individual steps. Environment
values and credentials are not included in metadata; tools' own logs still need
review before sharing. Existing CI uploads the complete run directory on failure.

Each command has a 600-second limit, followed by TERM and a ten-second grace
period before KILL. Exit 124 means timeout (137 can mean forced kill). On a slower
machine set a positive integer:
`HARNESS_STEP_TIMEOUT_SECONDS=1200 ./harness/verify.sh`. There is no timeout-disable option.

A kernel lock rejects a second gate in the same checkout before checks start;
it releases on process exit. Do not delete `harness/runs/.verify.lock`. This lock
coordinates verification invocations only, not manual builds or dev processes.
A second, machine-wide lock (`HARNESS_MACHINE_LOCK`, default
`${TMPDIR:-/tmp}/harness-verify.lock`) is shared by every harness gate: a
gate waits until no other harness gate runs on the machine, at most
`HARNESS_LOCK_WAIT_SECONDS` (default 3600) seconds, so overlapping gates do
not starve each other.
Use separate checkouts when independent processes need to rebuild shared assets.
Development starts with `pnpm dev -p 3000`; copy `.env.example` to `.env.local`.

UI work additionally needs its task-specific browser flow and screenshots in a
dated run directory. The CLI gate does not claim authenticated UI coverage.
Automatic CI remains paused; the existing workflow is manually dispatchable.

## Design references

- [Node.js test runner](https://nodejs.org/api/test.html): directory-scoped test
  file selection lets the gate avoid executing the harness suite twice. Directory
  arguments differ across Node releases, so the wrapper enumerates files explicitly.
- [dependency-cruiser JSON output](https://github.com/sverweij/dependency-cruiser/blob/main/doc/output-format.md):
  structured module counts and violations replace a human-output grep.
- [GNU timeout](https://www.gnu.org/software/coreutils/manual/html_node/timeout-invocation.html):
  bounded process groups, grace period and exit-code semantics.
- [util-linux flock](https://github.com/util-linux/util-linux/blob/master/sys-utils/flock.1.adoc):
  kernel-managed locks avoid stale PID-file cleanup.

Failure-path regression tests use temporary checkouts and stub commands, without
building the application or needing a backend: `pnpm test:harness`.

## Task work and handoff

Architecture and upstream comparisons: [design guide](../docs/harness-design.md),
[ADR-0003](../docs/adr/0003-task-aware-harness.md).

1. Read `node harness/task.mjs context CHANGE`. It selects the first unchecked
   numbered task and gives bounded excerpts with pointers to full sources.
2. Implement that task; run focused checks while editing.
3. Run `./harness/verify.sh --change CHANGE`. The full gate binds evidence to the
   task, writes `context.json`, and fingerprints inputs before and after execution.
4. Run `node harness/task.mjs status RUN_DIR` immediately before closing/handoff.
   Exit zero means the recorded passing gate matches current project inputs.
5. `node harness/task.mjs handoff RUN_DIR` prints a Markdown handoff. It also exits
   nonzero for stale/failed/incomplete evidence and does not modify any files.
   Save reviewed facts under the change's `handoff.md` or in `PROGRESS.md`.

`harness/PROGRESS.md` holds the last 14 days, newest first; add entries at the top.
`node harness/progress-rotate.mjs` moves older entries, unchanged, to
`harness/progress/<YYYY-MM>.md`. The audit fails above 2000 lines, and
`task.mjs context` searches both places for a change's history.

Replace CHANGE with an active OpenSpec slug and RUN_DIR with the printed run path.
No implicit selection among unrelated changes, automatic checkbox updates, model
calls, command replay, or external writes occur. Generic CI can omit `--change`.
Invalid/missing tasks fail before checks start. Old reports without fingerprints
remain historical evidence; rerun before using the new freshness check.

Schema version 2 adds task identity, input digests and `activeStep` to the summary.
`events.jsonl` records `run-started`, `step-started`, `step-finished`, `run-finished`.
A hard kill leaves the last active step visible. A file change during verification
forces failure; a later edit makes status/handoff report stale, without rewriting
the historical run. Fingerprints cover Git-visible project files, including
untracked code. They exclude run outputs and administrative records; exact limits
are documented in the design guide. They do not certify local environment values
or external services. Required UI evidence still needs its own browser flow.
