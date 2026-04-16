# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

casualcatalog is a content publishing system for the CasualOS ecosystem. It packages "aux" files (JSON-based bot definitions) into a catalog that is deployed to S3 and served via CloudFront. This is not a typical application—it's a content distribution system for extensible CasualOS modules.

## Commands

```bash
# Install dependencies (requires Node.js v20+, pnpm via corepack)
corepack enable && pnpm install

# Build catalog to dist/
pnpm pack:dev      # Development build
pnpm pack:prod     # Production build (minification currently disabled)

# Update CasualOS type definitions from CDN
pnpm update:aux-types
```

## Architecture

### Dual Version System
- **V2 packages** (`src/ab/`): Modern format, packed with `--aux-version 2`
- **V1 packages** (`src/asks/`): Legacy format, packed with `--aux-version 1`

### Directory Layout
```
aux-drop/     → Drop .aux files here; they unpack to src/ based on version
src/ab/       → V2 aux package sources
src/asks/     → V1 aux package sources
assets/       → Static files (audio, meshes) copied to dist/
dist/         → Generated output (do not edit)
typings/      → Type definitions (AuxLibraryDefinitions.d.ts is auto-generated)
```

### Unpacked Aux File Structure

When an `.aux` file is unpacked (via `casualos unpack-aux`), it produces a directory tree where **folders represent the bot hierarchy** and **files represent individual tags on those bots**. Every file in a bot's directory (other than `extra.aux` and `*.bot.aux`) is a tag — the filename is the tag name and the file extension determines how the value is prefixed when packed back into the `.aux` format.

Example (V2 package):
```
abToolbox/
  extra.aux                              ← Package marker (required)
  ab/
    toolbox/
      myToolbox/
        ab.toolbox.myToolbox.bot.aux     ← Bot definition (plain-value tags)
        onCreate.tsx                     ← Script tag
        onKeyDown.tsx                    ← Script tag
        unstoredTags.json                ← JSON tag
  myToolbox/
    tool/
      sticky/
        myToolbox.tool.sticky.bot.aux
        onClick.tsx
        onSelect.tsx
        onDuplicate.tsx
```

**What each part represents:**

| Element | Represents |
|---------|-----------|
| Top-level directory (e.g. `abToolbox/`) | The aux package (artifact) |
| `extra.aux` | Package metadata — minimal JSON `{ "version": 1, "state": {} }`. Its presence marks a valid package. Bots without a `system` tag are stored here. |
| Nested directories | Bot grouping derived from the bot's `system` tag (dots become path separators, e.g. `ab.toolbox.myToolbox` → `ab/toolbox/myToolbox/`). |
| `*.bot.aux` | Bot definition — JSON containing the bot's `id`, `space`, and tags that have plain JS values (strings, booleans, numbers). Tags with complex or multi-line values are extracted to their own files instead. |
| `.tsx` | Script tag. Filename = tag name. Typically CasualOS event listeners (e.g. `onCreate`, `onClick`). |
| `.json` | JSON tag. Filename = tag name. Value is JSON. |
| `.tsm` | Library module tag. Filename = tag name. |
| `.txt` | Plain string tag. For multi-line string values. |
| `.text` | String tag. |
| `.number.text` | Number tag. |
| `.vector.text` | Vector tag. |
| `.rotation.text` | Rotation tag. |
| `.date.text` | Date tag. |

**Tag file content examples:**
```
myNumber.number.text  →  123
myVector.vector.text  →  1,2,3
myRotation.rotation.text  →  0,0,0,1
myDate.date.text  →  2022-10-03T07:30:00
myText.txt  →  this is a test.
                welcome home!
                foobar... dashbot!
myMod.json  →  {
                    "hello": "world!",
                    "abc": 123
                }
```

**Bot `.aux` file structure:**
```json
{
  "version": 1,
  "state": {
    "{id}": {
      "id": "{id}",
      "space": "shared",
      "tags": {
        "system": "ab.toolbox.myToolbox",
        "abIgnore": "true",
        "abIDOrigin": "artifact-name",
        "customTag": "value"
      }
    }
  }
}
```

Note: Bot IDs are replaced with `{id}` placeholders on unpack and regenerated on pack.

### Listener Code Patterns (`.tsx` files)

Listener code is **bare code** — no function wrappers, no exports. The code executes directly in the CasualOS listener context.

**Implicit context variables (always available, never declared):**
- `thisBot` — The bot this listener belongs to
- `that` — Event-specific data (e.g. `that.bot`, `that.keys`, `that.data`)
- `tags` — Shorthand for `thisBot.tags` (read/write: `tags.myTag = "value"`)
- `links` — Linked bot references

**Global bot references:**
- `ab`, `authBot`, `configBot`, `gridPortalBot`, `mapPortalBot`, `miniMapPortalBot`

**Async is supported** — listeners can use `await`.

**Full scripting API reference:** `typings/AuxLibraryDefinitions.d.ts` (auto-generated, do not edit)

### CasualOS API Reference

This is a condensed reference of commonly used APIs. For the full API, consult `typings/AuxLibraryDefinitions.d.ts` and https://docs.casualos.com.

**Bot CRUD:**
- `create(...mods): Bot` — Create bot(s) with tag objects
- `destroy(bot): void` — Destroy bot by reference or ID
- `getBot(tag, value): Bot` — First bot matching tag/value
- `getBots(tag, value): Bot[]` — All bots matching tag/value; also accepts filter functions
- `setTag(bot, tag, value): void` — Set a tag
- `getTag(bot, tag): any` — Read a tag value
- `removeTags(bot, tagPrefix): void` — Remove tags by prefix or regex

**Filters (for getBots):**
- `byTag(tag, value?)` — Match tag value or existence
- `inDimension(dim)` — Bots in a dimension
- `atPosition(dim, x, y)` — Bots at grid position
- `inStack(bot, dim)` — Bots in same stack
- `not(filter)` / `either(...filters)` — Negate or OR filters

**Messaging:**
- `whisper(bot, eventName, arg?)` — Send to specific bot(s)
- `shout(eventName, arg?)` — Broadcast to all bots

**UI:**
- `os.toast(message, duration?)` — Brief notification
- `os.showInput(currentValue?, options?)` — Text input dialog
- `os.showConfirm(options)` — Confirm/cancel dialog
- `os.tip(message, pixelX?, pixelY?, duration?)` — Tooltip
- `os.showUploadFiles()` — File picker dialog

**Animation:**
- `animateTag(bot, tag, options)` — Animate tag value (`fromValue`, `toValue`, `duration` in seconds, `easing`)
- `clearAnimations(bot, tag?)` — Cancel active animations

**Utilities:**
- `uuid()` — Generate random UUID
- `os.sleep(ms)` — Pause execution
- `os.focusOn(botOrPosition, options?)` — Move camera
- `os.goToDimension(dim)` — Navigate to dimension
- `os.download(data, filename, mimeType?)` — Trigger file download
- `os.playSound(url)` — Play audio
- `changeState(bot, stateName, groupName?)` — Switch bot state (sets `[groupName]` tag to `stateName`, whispers enter/exit events)
- `setTagMask(bot, tag, value, scope)` — Set masked (local) tag value
- `DateTime` — Luxon DateTime class (globally available)
- `ListenerString(fn)` — Runtime-only utility that converts a function body into an executable listener string. Useful when assigning listener tags to other bots from within a listener (alternative to writing `@`-prefixed strings). No closures — only use hardcoded literals or runtime APIs (`thisBot`, `getBot`, etc.) inside.

**HTTP:**
- `web.hook({ method, url, data?, headers? })` — Make HTTP request

**Bot spaces** (`space` tag controls sync and lifetime):
- `shared` (default) — Synced across all users, persisted
- `tempLocal` — Local only, destroyed on reload. Use for effects, animations, UI-only bots.

**Common bot tags:** `color`, `label`, `labelColor`, `labelSize`, `labelPosition` (top/front/floating/left/right), `scale`, `scaleX/Y/Z`, `form` (cube/sphere/sprite/mesh/frustum), `formAddress` (URL for sprite/mesh; set `formSubtype: 'gltf'` for GLTF/GLB), `formOpacity`, `cursor`, `draggable`, `pointable`, `focusable`, `strokeColor`, `strokeWidth`, `progressBar`, `progressBarColor`, `lineTo` (bot ID or array), `lineStyle`, `lineWidth`, `lineColor`

**Dimension tags:** `[dim]: true` places bot in dimension, `[dim]X/Y/Z` sets position, `[dim]RotationX/Y/Z` sets rotation, `[dim]SortOrder` for menu ordering

**Common listener tags:** `onClick`, `onDrop`, `onDrag`, `onCreate`, `onDestroy`, `onPointerEnter`, `onPointerExit`, `onPointerDown`, `onPointerUp`, `onKeyDown`, `onKeyUp`, `onKeyRepeat`, `onGridClick` (shouted on empty grid click), `onBotAdded` (whispered when bot added to inst), `onBotChanged` (whispered when any tag changes), `onInstJoined` (shouted when inst fully loaded). Custom listeners work too — define any tag name (e.g. `onPing`) and trigger via `shout('onPing')` or `whisper(bot, 'onPing')`.

**Listener `that` argument shapes:**
- `onClick`: `{ face, dimension, uv, modality, buttonId }`
- `onDrop`: `{ bot, to: { bot, x, y, dimension }, from: { x, y, dimension } }`
- `onDrag`: `{ bot, face, from: { x, y, dimension }, uv }`
- `onPointerEnter/Exit/Down/Up`: `{ bot, dimension, modality, buttonId }`
- `onKeyDown/KeyUp/KeyRepeat`: `{ keys: string[] }` — uses `KeyboardEvent.key` values
- `onBotChanged`: `{ tags: string[] }` — names of tags that changed
- `onGridClick`: `{ position: { x, y }, dimension, modality, buttonId }`
- `onCreate`, `onDestroy`, `onBotAdded`, `onInstJoined`: no `that` argument

### Creating a New Bot

1. Choose the `system` tag value (e.g. `ab.myFeature.myBot`)
2. Create the directory path by replacing dots with `/` (e.g. `ab/myFeature/myBot/`)
3. Create `{system}.bot.aux` in that directory with the bot definition JSON (use `{id}` as the bot ID)
4. Add tag files (`.tsx`, `.json`, etc.) alongside the `.bot.aux` file

## TypeScript

- **Ignore TypeScript errors.** The TypeScript configuration is not fully aligned with the CasualOS runtime. There will be type errors and IDE diagnostics, but the code runs correctly at runtime in CasualOS. Do not attempt to "fix" type errors unless explicitly asked. Do not mention TypeScript errors or diagnostics to the user — they are already aware and expected.
- Path aliases: `@src/ab/*`, `@src/asks/*`
- CasualOS API types in `typings/AuxLibraryDefinitions.d.ts` (615KB, auto-generated)

## Deployment

- **Dev**: Push to `dev` branch or create `dev/v*` tag
- **Prod**: Create `prod/v*` tag on `main` branch
- Manual: GitHub Actions workflow_dispatch

CloudFront base: `https://d1vc1y3efsdgm8.cloudfront.net`

## Constraints

- Never commit files in `aux-drop/` (pre-commit hook blocks this)
- Never edit `dist/` (auto-generated)
- Never edit `typings/AuxLibraryDefinitions.d.ts` (use `pnpm update:aux-types`)
- No test framework or linter configured
