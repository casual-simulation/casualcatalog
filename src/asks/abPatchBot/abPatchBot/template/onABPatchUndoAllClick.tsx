if (tags.abPatchApplied && tags.abPatchBotInstance) {
    const abAppliedPatchBots = thisBot.abGetAppliedPatchBots();
    
    for (const abPatchBot of abAppliedPatchBots) {
        whisper(abPatchBot, 'onABPatchUndoClick');
    }
}