/**
 * Watches the aux-drop/ directory for new or changed .aux files
 * and automatically unpacks them into src/<subdir>/.
 *
 * Uses Node's built-in fs.watch (no extra dependencies needed).
 *
 * Run via:  pnpm run drop:watch
 */

import { watch, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const AUX_DROP = "aux-drop";

/**
 * Debounce map — tracks recently processed files so we don't
 * fire the unpack twice for the same rapid file-system event.
 */
const recentlyProcessed = new Map();
const DEBOUNCE_MS = 1000;

function shouldProcess(filePath) {
  const last = recentlyProcessed.get(filePath);
  if (last && Date.now() - last < DEBOUNCE_MS) return false;
  recentlyProcessed.set(filePath, Date.now());
  return true;
}

/**
 * Run the unpack script for a single file.
 */
function unpack(auxFile) {
  console.log(`\n📦 Detected: ${auxFile}`);
  try {
    execFileSync("node", ["scripts/aux-drop-unpack.mjs", auxFile], {
      stdio: "inherit",
    });
  } catch {
    // Error output already handled by unpack-aux.mjs
  }
}

/**
 * Get the list of subdirectories inside aux-drop/ to watch.
 */
function getWatchDirs() {
  const dirs = [AUX_DROP];
  try {
    for (const entry of readdirSync(AUX_DROP)) {
      const full = join(AUX_DROP, entry);
      const stat = statSync(full, { throwIfNoEntry: false });
      if (stat?.isDirectory()) {
        dirs.push(full);
      }
    }
  } catch {
    // aux-drop may not exist yet
  }
  return dirs;
}

// ── Main ──────────────────────────────────────────────────────

const dirs = getWatchDirs();

if (dirs.length === 0) {
  console.error("aux-drop/ directory not found. Create it and try again.");
  process.exit(1);
}

console.log("👀 Watching for .aux files in aux-drop/...");
console.log("   Drop a .aux file into aux-drop/ab/ or aux-drop/asks/ to unpack it.");
console.log("   Press Ctrl+C to stop.\n");

for (const dir of dirs) {
  try {
    watch(dir, (eventType, filename) => {
      if (!filename || !filename.endsWith(".aux")) return;

      const fullPath = join(dir, filename);

      // Make sure the file actually exists (watch fires on deletes too)
      const stat = statSync(fullPath, { throwIfNoEntry: false });
      if (!stat || !stat.isFile()) return;

      if (!shouldProcess(fullPath)) return;

      unpack(fullPath);
    });
  } catch {
    // Directory may not exist, that's okay
  }
}

// Keep the process alive
process.on("SIGINT", () => {
  console.log("\n👋 Stopped watching.");
  process.exit(0);
});
