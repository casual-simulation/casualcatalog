const abAppliedPatchBots = getBots(bot => bot.tags.abPatchBot && bot.tags.abPatchBotInstance && bot.tags.abPatchApplied);

// Sort abAppliedPatchBots by their abPatchAppliedTimestamp in descending order (most recent to oldest patch bots);
abAppliedPatchBots.sort((a, b) => b.tags.abPatchAppliedTimestamp - a.tags.abPatchAppliedTimestamp);

return abAppliedPatchBots;