import { readFile } from 'node:fs/promises';
import path from 'node:path';

const COVERAGE_SUMMARY_PATH = new URL(
  '../coverage/coverage-summary.json',
  import.meta.url,
);
const PROJECT_ROOT_SEGMENT = `${process.platform === 'win32' ? 'finance-tracker-web-v2\\' : 'finance-tracker-web-v2/'}`;

const summaryRaw = await readFile(COVERAGE_SUMMARY_PATH, 'utf8');
const summary = JSON.parse(summaryRaw);

const filesWithMissingCoverage = Object.entries(summary)
  .filter(([filePath]) => filePath !== 'total')
  .filter(
    ([, metrics]) =>
      metrics.lines.pct < 100 ||
      metrics.statements.pct < 100 ||
      metrics.functions.pct < 100 ||
      metrics.branches.pct < 100,
  );

if (filesWithMissingCoverage.length === 0) {
  console.log('All files have 100% coverage.');
  process.exit(0);
}

const rows = filesWithMissingCoverage
  .map(([filePath, metrics]) => {
    const shortPath = filePath.includes(PROJECT_ROOT_SEGMENT)
      ? filePath.slice(
          filePath.indexOf(PROJECT_ROOT_SEGMENT) + PROJECT_ROOT_SEGMENT.length,
        )
      : filePath;
    const directory = path.dirname(shortPath);

    return {
      directory: `${directory}${path.sep}`,
      file: path.basename(shortPath),
      statements: `${metrics.statements.pct}%`,
      branches: `${metrics.branches.pct}%`,
      functions: `${metrics.functions.pct}%`,
      lines: `${metrics.lines.pct}%`,
    };
  })
  .sort(
    (left, right) =>
      left.directory.localeCompare(right.directory) ||
      left.file.localeCompare(right.file),
  );

const groupedRows = rows.reduce((acc, row) => {
  const currentRows = acc.get(row.directory) ?? [];
  currentRows.push(row);
  acc.set(row.directory, currentRows);
  return acc;
}, new Map());

const fileWidth = Math.max(
  'File'.length,
  ...rows.map((row) => Math.max(row.directory.length, row.file.length)),
);
const statementsWidth = Math.max(
  'Statements'.length,
  ...rows.map((row) => row.statements.length),
);
const branchesWidth = Math.max(
  'Branches'.length,
  ...rows.map((row) => row.branches.length),
);
const functionsWidth = Math.max(
  'Functions'.length,
  ...rows.map((row) => row.functions.length),
);
const linesWidth = Math.max('Lines'.length, ...rows.map((row) => row.lines.length));

const createDataRow = (file, statements, branches, functions, lines) =>
  `${file.padEnd(fileWidth)} | ${statements.padEnd(statementsWidth)} | ` +
  `${branches.padEnd(branchesWidth)} | ${functions.padEnd(functionsWidth)} | ` +
  `${lines.padEnd(linesWidth)} |`;

const createDirectoryRow = (directory) => {
  const fileColumn =
    directory.length < fileWidth
      ? `${directory}${''.padEnd(fileWidth - directory.length, '-')}`
      : directory;

  return (
    `${fileColumn}` +
    `-|-${'-'.repeat(statementsWidth)}-|-` +
    `${'-'.repeat(branchesWidth)}-|-` +
    `${'-'.repeat(functionsWidth)}-|-` +
    `${'-'.repeat(linesWidth)}-|`
  );
};

const separator =
  `${'-'.repeat(fileWidth)}-+-${'-'.repeat(statementsWidth)}-+-` +
  `${'-'.repeat(branchesWidth)}-+-${'-'.repeat(functionsWidth)}-+-${'-'.repeat(linesWidth)}-|`;

console.log('FILES WHICH DO NOT HAVE 100% COVERAGE\n');
console.log(createDataRow('File', 'Statements', 'Branches', 'Functions', 'Lines'));
console.log(separator);

for (const [directory, directoryRows] of groupedRows) {
  console.log(createDirectoryRow(directory));

  for (const row of directoryRows) {
    console.log(
      createDataRow(row.file, row.statements, row.branches, row.functions, row.lines),
    );
  }

  console.log(separator);
}
