#!/usr/bin/env node
import { fileURLToPath } from 'node:url';

import { inspectRun, taskContext } from './lib/workflow.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const [command, target, ...extra] = process.argv.slice(2);
try {
  if (!target || extra.length || !['context', 'status', 'handoff'].includes(command)) {
    throw new Error('Usage: node harness/task.mjs context CHANGE | status RUN_DIR | handoff RUN_DIR');
  }
  if (command === 'context') {
    console.log(JSON.stringify(taskContext(root, target), null, 2));
  } else {
    const result = inspectRun(root, target);
    if (command === 'status') console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`# Verification handoff\n\n- Run: ${result.run}\n- Task: ${result.task ? `${result.task.change} / ${result.task.id}` : 'unbound (generic verification)'}\n- Gate: ${result.status}; evidence ${result.fresh ? 'current' : 'not current'}\n- Active step: ${result.activeStep ?? 'none'}\n- Duration: ${result.durationSeconds ?? 'unknown'} seconds\n- UI: ${result.uiEvidence}\n`);
      for (const reason of result.reasons) console.log(`- Follow-up: ${reason}`);
      for (const step of result.failedSteps) console.log(`- Failure: ${step.name}, exit ${step.exitCode}; ${step.log}`);
      console.log('\nReview the diff and task scenarios, record decisions/gaps in PROGRESS.md, then update tasks.md only when all required evidence exists. This report never changes task state.');
    }
    if (!result.fresh) process.exitCode = 1;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
