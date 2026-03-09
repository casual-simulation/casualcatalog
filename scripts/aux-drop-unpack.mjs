/**
 * Scans aux-drop/ for .aux files, unpacks each one into the
 * matching src/<subdir>/ directory, then deletes the original.
 *
 * Usage:
 *   node scripts/unpack-aux.mjs            — process all .aux files in aux-drop/
 *   node scripts/unpack-aux.mjs <path>     — process a single .aux file
 *
 * Run via:  pnpm run drop:unpack
 */

import { execSync } from "node:child_process";
import { readdirSync, statSync, unlinkSync, mkdirSync } from "node:fs";
import { join, basename, relative } from "node:path";

const AUX_DROP = "aux-drop";
const SRC = "src";

/** Run a command and return trimmed stdout. */
function run(cmd) {
  execSync(cmd, { encoding: "utf-8", stdio: "inherit" });
}

/**
 * Recursively find all .aux files under a directory.
 */
function findAuxFiles(dir) {
  const results = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }

  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full, { throwIfNoEntry: false });
    if (!stat) continue;

    if (stat.isDirectory()) {
      results.push(...findAuxFiles(full));
    } else if (entry.endsWith(".aux")) {
      results.push(full);
    }
  }

  return results;
}

/**
 * Extract the first-level subdirectory from an aux-drop path.
 * e.g. "aux-drop/ab/myFile.aux" → "ab"
 */
function getSubdir(auxPath) {
  const rel = relative(AUX_DROP, auxPath);
  const firstSlash = rel.indexOf("/");
  if (firstSlash === -1) return null;
  return rel.slice(0, firstSlash);
}

/**
 * Unpack a single .aux file into src/<subdir>/ and delete the original.
 * Returns true on success, false on failure.
 */
function unpackFile(auxFile) {
  const subdir = getSubdir(auxFile);

  if (!subdir) {
    console.warn(`⚠️  Skipping ${auxFile} — must be inside a subdirectory (e.g. aux-drop/ab/)`);
    return false;
  }

  const outputDir = join(SRC, subdir, "/");
  mkdirSync(outputDir, { recursive: true });

  console.log(`  ${auxFile} → ${outputDir}`);

  try {
    run(
      `npx casualos unpack-aux --overwrite --recursive --preserve-bot-ids "${auxFile}" "${outputDir}"`
    );

    // Delete the original .aux file after successful unpack
    unlinkSync(auxFile);
    return true;
  } catch (err) {
    console.error(`❌ Failed to unpack ${auxFile}`);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────────────

// If a specific file was passed as an argument, just process that one.
// Otherwise scan the entire aux-drop/ directory.
const targetFile = process.argv[2];
const auxFiles = targetFile ? [targetFile] : findAuxFiles(AUX_DROP);

if (auxFiles.length === 0) {
  console.log("No .aux files found in aux-drop/. Nothing to do.");
  process.exit(0);
}

console.log(`\n🔧 Unpacking ${auxFiles.length} .aux file(s)...\n`);

let failed = false;
for (const auxFile of auxFiles) {
  if (!unpackFile(auxFile)) {
    failed = true;
  }
}

console.log("");

if (failed) {
  console.error("Some .aux files failed to unpack.");
  process.exit(1);
}

console.log("✅ All .aux files unpacked successfully.\n");
