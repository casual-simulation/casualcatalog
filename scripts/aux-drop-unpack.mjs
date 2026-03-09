/**
 * Scans aux-drop/ for .aux files, reads the "version" property from
 * each file's JSON to determine the target directory, unpacks it,
 * then deletes the original.
 *
 *   version 1 → src/asks/
 *   version 2 → src/ab/
 *
 * Usage:
 *   node scripts/aux-drop-unpack.mjs            — process all .aux files in aux-drop/
 *   node scripts/aux-drop-unpack.mjs <path>     — process a single .aux file
 *
 * Run via:  pnpm run drop:unpack
 */

import { execSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, unlinkSync, mkdirSync, rmSync } from "node:fs";
import { join, basename } from "node:path";

const AUX_DROP = "aux-drop";
const SRC = "src";

const VERSION_MAP = {
  1: "asks",
  2: "ab",
};

/** Run a command with output piped to the console. */
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
 * Read the "version" property from a .aux JSON file.
 * Returns the version number, or null if it can't be determined.
 */
function getAuxVersion(auxFile) {
  try {
    const content = readFileSync(auxFile, "utf-8");
    const json = JSON.parse(content);
    return json.version ?? null;
  } catch {
    return null;
  }
}

/**
 * Unpack a single .aux file into the correct src/ subdirectory
 * based on its version, then delete the original.
 * Returns true on success, false on failure.
 */
function unpackFile(auxFile) {
  const version = getAuxVersion(auxFile);

  if (version === null) {
    console.warn(`⚠️  Skipping ${auxFile} — could not read version from JSON`);
    return false;
  }

  const subdir = VERSION_MAP[version];

  if (!subdir) {
    console.warn(`⚠️  Skipping ${auxFile} — unknown version: ${version}`);
    return false;
  }

  const outputDir = join(SRC, subdir, "/");
  mkdirSync(outputDir, { recursive: true });

  // Derive the folder name that unpack-aux will create (e.g. "abPersonality.aux" → "abPersonality")
  const auxName = basename(auxFile, ".aux");
  const unpackedDir = join(outputDir, auxName);

  // Clean out the existing unpacked directory to remove stale files
  // from tags/bots that no longer exist in the .aux file
  rmSync(unpackedDir, { recursive: true, force: true });

  console.log(`  ${auxFile} → ${outputDir} (v${version})`);

  try {
    run(
      `npx casualos unpack-aux --overwrite --recursive --preserve-bot-ids "${auxFile}" "${outputDir}"`
    );

    // Delete the original .aux file after successful unpack
    unlinkSync(auxFile);
    return true;
  } catch {
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
