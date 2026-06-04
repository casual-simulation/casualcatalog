---
name: change-summary
description: Summarize what changed in the product between the last two prod/v* release tags as a terse, non-developer-facing bulleted list. Use when asked for release notes, a changelog, "what changed since last release", or a summary of changes between prod tags.
---

# Change Summary

Write a bulleted list of the changes made to the repository between the last two `prod/v*` tags, for a non-developer audience who wants to understand what changed in the product.

## Gather the data

1. Find the two most recent prod tags by version number (not date — tags can be created out of order):
   ```bash
   git tag -l 'prod/v*' --sort=-v:refname | head -2
   ```
   This prints the newer tag first, then the previous one. Call them `$NEW` and `$PREV`.

2. The **tree diff is the source of truth** for what actually changed. It reflects the net end state, so anything implemented and then reverted within the range simply won't appear:
   ```bash
   git diff --stat $PREV $NEW      # overview of which files/areas changed
   git diff $PREV $NEW             # full diff — read it to interpret intent
   ```

3. Use the commit log only for *context and intent* (why a change was made), never as the list of what to report:
   ```bash
   git log --oneline $PREV..$NEW
   ```

## Output rules

- **Only include changes that are functionally present in the diff.** If something was implemented and later reverted within the range, it nets to nothing in the tree diff — do not include it. (A commit message mentioning it is not enough.)
- Terse bullets aimed at non-developers who want to understand what changed in the product. Focus on user-facing changes and new capabilities.
- If the only major changes are refactors or technical improvements, summarize those instead.
- **Don't** categorize by type or section (no "New features" / "Bug fixes" headers) — one flat list, ordered by importance/impact.
- **Interpret** the code changes for contextual understanding; don't just rehash commit messages.

## Good examples

```
- New user personalization prompt setting, injected into the ask system prompt and edited via ab personality
- Stagger ab initial messages off a non-blocking promise chain so abSetAwake resolves immediately, looking to fix timing issues with homeworld on ab1.bot
- Remove old public avatars when a new one is created; onPlaceClicked reworked for superShouts
```

```
- Fixed custom meshes for studio catalogs
- Added studio catalog label color and label background color settings for studio-focused bots (ie catalog and kit bots).
- Map avatar: fixed several bugs; you can now click places to move
- Scale model guide: now uses a guidebook mesh and only self-destructs when intended
- Improved how scale model tools load via todos. Sometimes agents were ignoring scale model kit tools because agentReady was set to false.
- Removed a batch of obsolete toolbox packages.
```

```
- Agents no longer stand on top of neighbouring todo bots while working. They now pick an open tile around the target todo (via findOpenPositionAround) and walk there.
- Added an optional angular search bias to findOpenPositionAround (preferToward/preferAngle) so the search starts from the side the bot is approaching from — giving the natural shortest-path spot instead of an arbitrary side.
```

```
- Fixed layer-unloading issue and tested static insts in abHome.
- Fixed mapAvatar initial GPS setting, avatar spawning, and added debug logs.
- Separated mapAvatar from artifactJournal and fixed their GPS interactions.
- Added public avatar to the curiosity kit loader's tools list.
- Scaled down the catalog, scaled up undiscovered landmarks, and fixed the home nav button showing while already in home.
```
