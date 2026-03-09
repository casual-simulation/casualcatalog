/**
 * Packs source directories into .aux files and copies asset directories.
 *
 * For each immediate subdirectory of src/ab/ and src/asks/:
 *   - If it contains an extra.aux file → pack it with casualos pack-aux
 *   - Otherwise → copy it directly to dist/ (asset directory)
 *
 * src/ab/  → packs with --aux-version 2 → dist/ab/
 * src/asks/ → packs with --aux-version 1 → dist/asks/
 *
 * Usage:
 *   node scripts/pack-aux.mjs          — pack all
 *   node scripts/pack-aux.mjs --prod   — pack all + minify
 *
 * Run via:  pnpm run pack:dev   or   pnpm run pack:prod
 */

import { execSync } from "node:child_process";
import {
  readdirSync,
  statSync,
  mkdirSync,
  rmSync,
  unlinkSync,
  existsSync,
  cpSync,
} from "node:fs";
import { join, basename, relative } from "node:path";

const isProd = process.argv.includes("--prod");

const PACK_CONFIGS = [
  { srcDir: "src/ab", outputDir: "dist/ab", auxVersion: 2 },
  { srcDir: "src/asks", outputDir: "dist/asks", auxVersion: 1 },
];

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
 * Recursively remove hidden files (names starting with ".")
 * from a directory, except .gitkeep.
 */
function removeHiddenFiles(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return 0;
  }

  let count = 0;
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full, { throwIfNoEntry: false });
    if (!stat) continue;

    if (stat.isDirectory()) {
      if (entry.startsWith(".")) {
        rmSync(full, { recursive: true, force: true });
        count++;
      } else {
        count += removeHiddenFiles(full);
      }
    } else if (entry.startsWith(".") && entry !== ".gitkeep") {
      unlinkSync(full);
      count++;
    }
  }

  return count;
}

/**
 * Get immediate subdirectories of a directory.
 */
function getSubdirs(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }

  return entries
    .filter((entry) => {
      const full = join(dir, entry);
      const stat = statSync(full, { throwIfNoEntry: false });
      return stat?.isDirectory();
    })
    .map((entry) => join(dir, entry));
}

/**
 * Check if a directory contains an extra.aux file (making it an aux package).
 */
function isAuxPackage(dir) {
  return existsSync(join(dir, "extra.aux"));
}

// ── Main ──────────────────────────────────────────────────────

// Remove hidden files from src/ before packing
console.log("\n🧹 Removing hidden files from src/...");
const removed = removeHiddenFiles("src");
if (removed > 0) {
  console.log(`   Removed ${removed} hidden file(s).`);
}

// Clean dist/ before packing
console.log("🧹 Cleaning dist/...");
rmSync("dist", { recursive: true, force: true });

console.log(`📦 Packing .aux files (${isProd ? "prod" : "dev"})...\n`);

let failed = false;
let totalPacked = 0;
let totalCopied = 0;

for (const { srcDir, outputDir, auxVersion } of PACK_CONFIGS) {
  mkdirSync(outputDir, { recursive: true });

  const subdirs = getSubdirs(srcDir);

  for (const subdir of subdirs) {
    const name = basename(subdir);

    if (isAuxPackage(subdir)) {
      // Directory contains extra.aux → pack it into a .aux file
      const outputFile = join(outputDir, `${name}.aux`);
      console.log(`  📦 ${relative(".", subdir)}/ → ${relative(".", outputFile)} (v${auxVersion})`);

      try {
        run(
          `npx casualos pack-aux --overwrite --aux-version ${auxVersion} "${subdir}" "${outputFile}"`
        );
        totalPacked++;
      } catch {
        console.error(`  ❌ Failed to pack ${relative(".", subdir)}`);
        failed = true;
      }
    } else {
      // No extra.aux → copy as asset directory
      const destDir = join(outputDir, name);
      console.log(`  📂 ${relative(".", subdir)}/ → ${relative(".", destDir)}/ (copy)`);

      cpSync(subdir, destDir, { recursive: true });
      totalCopied++;
    }
  }
}

if (failed) {
  console.error("\nSome directories failed to pack.");
  process.exit(1);
}

console.log(`\n✅ Packed ${totalPacked} aux package(s), copied ${totalCopied} asset directory(s).`);

// ── Minify (prod only) ───────────────────────────────────────

if (isProd) {
  console.log("\n🗜️  Minifying .aux files in dist/...\n");

  const auxFiles = findAuxFiles("dist");

  if (auxFiles.length === 0) {
    console.log("  No .aux files found in dist/ to minify.");
  } else {
    let minifyFailed = false;

    for (const auxFile of auxFiles) {
      console.log(`  Minifying ${auxFile}`);
      try {
        run(`npx casualos minify-aux "${auxFile}"`);
      } catch {
        console.error(`❌ Failed to minify ${auxFile}`);
        minifyFailed = true;
      }
    }

    if (minifyFailed) {
      console.error("\nSome files failed to minify.");
      process.exit(1);
    }

    console.log(`\n✅ Minified ${auxFiles.length} file(s) successfully.`);
  }
}

console.log("");
