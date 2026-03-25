if (tags.abPatchApplied && tags.abPatchTodoInstance) {
    const abAppliedPatchBots = thisBot.abGetAppliedPatchBots();
    
    for (const abPatchBot of abAppliedPatchBots) {
        whisper(abPatchBot, 'onABPatchUndoClick');
    }
}