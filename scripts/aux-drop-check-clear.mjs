/**
 * Pre-commit safety check.
 *
 * Prevents committing raw .aux files that haven't been unpacked yet.
 * If any .aux files are staged in aux-drop/, the commit is blocked
 * with a message telling the developer to run `pnpm run unpack` first.
 */

import { execSync } from "node:child_process";

function run(cmd) {
  return execSync(cmd, { encoding: "utf-8" }).trim();
}

const staged = run("git diff --cached --name-only --diff-filter=ACM");

if (!staged) process.exit(0);

const auxFiles = staged
  .split("\n")
  .filter((f) => f.startsWith("aux-drop/") && f.endsWith(".aux"));

if (auxFiles.length === 0) process.exit(0);

console.error("\n🚫 Commit blocked — unprocessed .aux files detected:\n");
for (const f of auxFiles) {
  console.error(`   ${f}`);
}
console.error("\nRun `pnpm run drop:unpack` to unpack them first, then commit the results.\n");

process.exit(1);
