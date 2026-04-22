/**
 * Packs source directories into .aux files and copies assets.
 *
 * 1. Packs aux packages from src/ into dist/
 *    - src/ab/  → packs with --aux-version 2 → dist/ab/
 *    - src/asks/ → packs with --aux-version 1 → dist/asks/
 *
 * 2. Copies the assets/ directory structure into dist/
 *    - assets/ab/audio/ → dist/ab/audio/
 *    - assets/asks/meshes/ → dist/asks/meshes/
 *
 * 3. (prod only) Minifies all .aux files in dist/
 *
 * Usage:
 *   node scripts/pack-aux.mjs          — pack all
 *   node scripts/pack-aux.mjs --prod   — pack all + minify
 *
 * Run via:  pnpm run pack:dev   or   pnpm run pack:prod
 */

import { execFileSync, execFile } from "node:child_process";
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
import { availableParallelism } from "node:os";

const isProd = process.argv.includes("--prod");

const PACK_CONFIGS = [
  { srcDir: "src/ab", outputDir: "dist/ab", auxVersion: 2 },
  { srcDir: "src/asks", outputDir: "dist/asks", auxVersion: 1 },
];

const ASSETS_DIR = "assets";

/** Run a command with arguments. Uses shell on Windows so npx.cmd resolves correctly. */
function run(cmd, args) {
  execFileSync(cmd, args, {
    encoding: "utf-8",
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}

/** Async version of run — captures stdout/stderr so parallel output stays grouped. */
function runAsync(cmd, args) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, {
      encoding: "utf-8",
      shell: process.platform === "win32",
    }, (err, stdout, stderr) => {
      if (err) reject({ err, stdout, stderr });
      else resolve({ stdout, stderr });
    });
  });
}

/** Run async task thunks with at most `limit` running at once. */
async function runWithConcurrency(thunks, limit) {
  const results = [];
  const executing = new Set();
  for (const thunk of thunks) {
    const p = Promise.resolve(thunk());
    results.push(p);
    const e = p.finally(() => executing.delete(e));
    executing.add(e);
    if (executing.size >= limit) await Promise.race(executing).catch(() => {});
  }
  return Promise.allSettled(results);
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

// ── Pack aux packages ────────────────────────────────────────

console.log(`📦 Packing .aux files (${isProd ? "prod" : "dev"})...\n`);

let failed = false;
let totalPacked = 0;

// Build all packing tasks across every config upfront so they can run in parallel.
const packThunks = [];

for (const { srcDir, outputDir, auxVersion } of PACK_CONFIGS) {
  mkdirSync(outputDir, { recursive: true });

  for (const subdir of getSubdirs(srcDir)) {
    if (!existsSync(join(subdir, "extra.aux"))) {
      console.log(`  ⏭️  Skipping ${relative(".", subdir)}/ — no extra.aux found`);
      continue;
    }

    const name = basename(subdir);
    const outputFile = join(outputDir, `${name}.aux`);
    const label = `${relative(".", subdir)}/ → ${relative(".", outputFile)} (v${auxVersion})`;

    packThunks.push(async () => {
      console.log(`  📦 ${label}`);
      const { stdout, stderr } = await runAsync("npx", [
        "casualos", "pack-aux",
        "--overwrite", "--aux-version", String(auxVersion),
        subdir, outputFile,
      ]);
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
    });
  }
}

const concurrency = availableParallelism();
console.log(`  (running up to ${concurrency} in parallel)\n`);
const settled = await runWithConcurrency(packThunks, concurrency);

for (const result of settled) {
  if (result.status === "fulfilled") {
    totalPacked++;
  } else {
    const { err, stdout, stderr } = result.reason;
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    console.error(`  ❌ ${err.message}`);
    failed = true;
  }
}

if (failed) {
  console.error("\nSome directories failed to pack.");
  process.exit(1);
}

console.log(`\n✅ Packed ${totalPacked} aux package(s).`);

// ── Copy assets ──────────────────────────────────────────────

if (existsSync(ASSETS_DIR)) {
  console.log("\n📂 Copying assets into dist/...\n");

  cpSync(ASSETS_DIR, "dist", { recursive: true });

  console.log(`  ${ASSETS_DIR}/ → dist/`);
  console.log("\n✅ Assets copied.");
} else {
  console.log("\nNo assets/ directory found, skipping asset copy.");
}

// ── Minify (prod only) ───────────────────────────────────────
const ALLOW_MINIFY = false;

if (isProd && ALLOW_MINIFY) {
  console.log("\n🗜️  Minifying .aux files in dist/...\n");

  const auxFiles = findAuxFiles("dist");

  if (auxFiles.length === 0) {
    console.log("  No .aux files found in dist/ to minify.");
  } else {
    let minifyFailed = false;

    for (const auxFile of auxFiles) {
      console.log(`  Minifying ${auxFile}`);
      try {
        run("npx", ["casualos", "minify-aux", auxFile]);
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
