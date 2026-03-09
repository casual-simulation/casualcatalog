/**
 * Pre-commit hook script that unpacks staged .aux files.
 *
 * When a .aux file is staged in aux-drop/<subdir>/, this script:
 *   1. Runs `casualos unpack-aux` to unpack it into src/<subdir>/
 *   2. Stages the unpacked output
 *   3. Deletes the original .aux file and stages the deletion
 *
 * If any unpack fails the process exits with code 1 to abort the commit.
 */

import { execSync } from "node:child_process";
import { unlinkSync } from "node:fs";
import { join, dirname } from "node:path";

/** Run a command and return trimmed stdout. */
function run(cmd) {
  return execSync(cmd, { encoding: "utf-8" }).trim();
}

/** Find staged .aux files inside aux-drop/. */
function getStagedAuxFiles() {
  const output = run("git diff --cached --name-only --diff-filter=ACM");
  if (!output) return [];

  return output
    .split("\n")
    .filter((file) => file.startsWith("aux-drop/") && file.endsWith(".aux"));
}

/** Extract the first-level subdirectory from an aux-drop path.
 *  e.g. "aux-drop/ab/myFile.aux" → "ab"
 */
function getSubdir(auxPath) {
  const withoutPrefix = auxPath.replace(/^aux-drop\//, "");
  const firstSlash = withoutPrefix.indexOf("/");
  if (firstSlash === -1) return null;
  return withoutPrefix.slice(0, firstSlash);
}

// ── Main ──────────────────────────────────────────────────────

const auxFiles = getStagedAuxFiles();

if (auxFiles.length === 0) {
  process.exit(0);
}

console.log(`\n🔧 Unpacking ${auxFiles.length} staged .aux file(s)...\n`);

let failed = false;

for (const auxFile of auxFiles) {
  const subdir = getSubdir(auxFile);

  if (!subdir) {
    console.warn(`⚠️  Skipping ${auxFile} — could not determine subdirectory`);
    continue;
  }

  const outputDir = join(".", "src", subdir, "/");

  console.log(`  ${auxFile} → src/${subdir}/`);

  try {
    // Make sure the output directory exists
    run(`mkdir -p "${outputDir}"`);

    // Unpack the .aux file
    run(
      `npx casualos unpack-aux --overwrite --recursive --preserve-bot-ids "./${auxFile}" "${outputDir}"`
    );

    // Stage the unpacked output
    run(`git add "${outputDir}"`);

    // Delete the .aux file and stage the deletion
    unlinkSync(auxFile);
    try {
      run(`git rm --cached --quiet "${auxFile}"`);
    } catch {
      // File may already be untracked after deletion — that's fine
    }
  } catch (err) {
    console.error(`❌ Failed to unpack ${auxFile}`);
    console.error(`   ${err.message}`);
    failed = true;
  }
}

console.log("");

if (failed) {
  console.error("Some .aux files failed to unpack. Aborting commit.");
  process.exit(1);
}

console.log("✅ All .aux files unpacked successfully.\n");
