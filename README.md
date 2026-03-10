# casualcatalog

A catalog of dynamic content published to S3 and served via CloudFront.

## Setup

Requires Node.js (v20+).

If you don't have pnpm installed, enable it via corepack (ships with Node.js):

```bash
corepack enable
```

This will automatically use the correct pnpm version specified in the project. Then install dependencies:

```bash
pnpm install
```

This installs the `casualos` CLI and sets up a Git pre-commit hook via Husky that prevents raw `.aux` files from being committed to `aux-drop/`.

## Project Structure

```
aux-drop/       Drop .aux files here to unpack them into src/
src/
  ab/           Unpacked v2 aux packages (source code)
  asks/         Unpacked v1 aux packages (source code)
assets/         Static files (audio, meshes, icons, etc.) copied into dist/ during build
dist/           Built output (generated, do not edit)
scripts/        Build and workflow scripts
.github/        GitHub Actions workflows (dev/prod deployment)
.husky/         Git hooks
```

## Workflow

### Adding or updating an .aux file

Drop the `.aux` file into `aux-drop/`. The version property inside the file determines where it goes: v1 files unpack to `src/asks/`, v2 files unpack to `src/ab/`.

You can unpack in two ways:

```bash
# One-shot: process all .aux files currently in aux-drop/
pnpm run drop:unpack

# Watcher: auto-unpack files as they're dropped in
pnpm run drop:watch
```

Both will unpack the `.aux` file into the correct `src/` subdirectory and delete the original from `aux-drop/`. If a directory already exists for that aux file, it is cleaned out first to remove stale files from deleted tags or bots.

After unpacking, review the diff and commit when ready. The pre-commit hook will block any commit that still has files in `aux-drop/`.

### Building for dev or prod

```bash
# Dev build: packs src/ into dist/, copies assets/ into dist/
pnpm run pack:dev

# Prod build: same as dev, plus minifies all .aux files in dist/
pnpm run pack:prod
```

Both commands clean `dist/` before building and remove hidden files (like `.DS_Store`) from `src/` before packing.

## Scripts

| Script | Description |
|---|---|
| `pnpm run drop:unpack` | Unpack all `.aux` files in `aux-drop/` into `src/` based on version |
| `pnpm run drop:watch` | Watch `aux-drop/` and auto-unpack files as they appear |
| `pnpm run pack:dev` | Build `dist/` from `src/` and `assets/` |
| `pnpm run pack:prod` | Build `dist/` from `src/` and `assets/`, then minify |

## Deploying

To publish updates, push a Git tag:

- **Dev**: `dev/v123`, `dev/vNEXT` — must point to `dev` branch
- **Prod**: `prod/v123`, `prod/vNEXT` — must point to `main` branch

You can also manually trigger a deployment via GitHub Actions:

1. Go to the **Actions** tab.
2. Select **Publish casualcatalog [DEV]** or **[PROD]** workflow.
3. Click **Run workflow** and enter a tag like `dev/v123`.

Deployment syncs the `casualcatalog/` directory to the corresponding S3 bucket and creates a CloudFront cache invalidation.

## CloudFront URL

Base: **[https://d1vc1y3efsdgm8.cloudfront.net](https://d1vc1y3efsdgm8.cloudfront.net)**

Example:

```
https://d1vc1y3efsdgm8.cloudfront.net/boormantest.json?env=publicos.link
```
