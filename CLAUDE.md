# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

casualcatalog is a content publishing system for the CasualOS ecosystem. It packages "aux" files (JSON-based bot definitions) into a catalog that is deployed to S3 and served via CloudFront. This is not a typical application—it's a content distribution system for extensible CasualOS modules.

## Commands

```bash
# Install dependencies (requires Node.js v20+, pnpm via corepack)
corepack enable && pnpm install

# Unpack .aux files dropped into aux-drop/
pnpm drop:unpack

# Watch aux-drop/ and auto-unpack files as they appear
pnpm drop:watch

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

### Package Structure
Each aux package is a directory containing:
- `extra.aux` — Metadata file (required; signals this is a valid package)
- Subdirectories with `.tsx` bot scripts and `.aux` bot definitions

### File Types
- `.tsx` — TypeScript/JSX bot scripts (CasualOS listener code)
- `.aux` — AUX format bot definitions (JSON)
- `.json` — Configuration data

## Workflow

1. Drop `.aux` file into `aux-drop/`
2. Run `pnpm drop:unpack` (or use `drop:watch`)
3. Source appears in `src/ab/` or `src/asks/` based on aux version
4. Edit source files
5. Run `pnpm pack:dev` to build
6. Commit changes (pre-commit hook blocks commits with files in aux-drop/)

## TypeScript

- Strict mode enabled with all strict flags
- Path aliases: `@src/ab/*`, `@src/asks/*`
- Global bot variables available: `ab`, `authBot`, `configBot`, `gridPortalBot`, `mapPortalBot`, `miniMapPortalBot`
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
