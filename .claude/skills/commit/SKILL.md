Commit all staged changes.

1. Run `git diff --staged` to review what is staged.
2. If nothing is staged, inform the user and STOP. Do not look at unstaged changes or suggest staging them — only work with what is already staged.
3. Identify which aux packages are affected by looking at the staged file paths:
   - V2 packages live under `src/ab/<packageName>/`
   - V1 packages live under `src/asks/<packageName>/`
   - Collect unique package names from the changed paths.
4. Write a commit message following the repository style:
   - Prefix: `[packageName]` — comma-separated if multiple packages, e.g. `[abTodo, abPatchTodo]`
   - Followed by a colon and a concise description of what changed and why
   - Example: `[agentBotTool]: simplify movement to orthogonal tile steps on shared position`
5. Show the user the full commit message and then ask if:
   - Accept and commit
   - Make changes to the commit message (user provides notes)
   - Cancel commit
