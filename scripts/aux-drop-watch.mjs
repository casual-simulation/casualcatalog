/**
 * Watches the aux-drop/ directory for new or changed .aux files
 * and automatically unpacks them into the correct src/ subdirectory
 * based on the version in the .aux JSON.
 *
 * Uses Node's built-in fs.watch (no extra dependencies needed).
 *
 * Run via:  pnpm run drop:watch
 */

import { watch, statSync, existsSync, mkdirSync } from "node:fs";
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
    // Error output already handled by aux-drop-unpack.mjs
  }
}

// ── Main ──────────────────────────────────────────────────────

if (!existsSync(AUX_DROP)) {
  mkdirSync(AUX_DROP, { recursive: true });
}

console.log("👀 Watching for .aux files in aux-drop/...");
console.log("   Drop a .aux file into aux-drop/ to unpack it.");
console.log("   The version in the file determines the destination (v1 → asks, v2 → ab).");
console.log("   Press Ctrl+C to stop.\n");

watch(AUX_DROP, (eventType, filename) => {
  if (!filename || !filename.endsWith(".aux")) return;

  const fullPath = join(AUX_DROP, filename);

  // Make sure the file actually exists (watch fires on deletes too)
  const stat = statSync(fullPath, { throwIfNoEntry: false });
  if (!stat || !stat.isFile()) return;

  if (!shouldProcess(fullPath)) return;

  unpack(fullPath);
});

// Keep the process alive
process.on("SIGINT", () => {
  console.log("\n👋 Stopped watching.");
  process.exit(0);
});
