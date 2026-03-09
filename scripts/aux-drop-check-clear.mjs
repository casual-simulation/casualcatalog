/**
 * Pre-commit safety check.
 *
 * Blocks any commit that includes staged files inside aux-drop/
 * (except .gitkeep). This ensures raw .aux files are always unpacked
 * before being committed.
 */

import { execSync } from "node:child_process";
import { basename } from "node:path";

function run(cmd) {
  return execSync(cmd, { encoding: "utf-8" }).trim();
}

const staged = run("git diff --cached --name-only --diff-filter=ACM");

if (!staged) process.exit(0);

const blocked = staged
  .split("\n")
  .filter((f) => f.startsWith("aux-drop/") && basename(f) !== ".gitkeep");

if (blocked.length === 0) process.exit(0);

console.error("\n🚫 Commit blocked — files staged in aux-drop/ are not allowed:\n");
for (const f of blocked) {
  console.error(`   ${f}`);
}
console.error("\nRun `pnpm run drop:unpack` to process them first, then commit the results.\n");

process.exit(1);
