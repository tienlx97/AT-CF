#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
report=$(mktemp)
trap 'rm -f "$report"' EXIT
status=0
pnpm exec depcruise src --config harness/structure.rules.cjs --output-type json >"$report" || status=$?
node - "$report" <<'JS'
const fs = require('node:fs');
const report = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
if (!(report.summary?.totalCruised > 0) || !(report.modules?.length > 0)) {
  throw new Error('0 modules cruised; check dependency-cruiser parser/configuration');
}
if (!Number.isInteger(report.summary.error) || report.summary.error < 0) {
  throw new Error('Invalid dependency-cruiser report: missing error count');
}
if (report.summary.error > 0) {
  console.error(JSON.stringify(report.summary.violations, null, 2));
  process.exit(1);
}
console.log(`${report.summary.totalCruised} modules cruised; ${report.summary.error} errors`);
JS
exit "$status"
