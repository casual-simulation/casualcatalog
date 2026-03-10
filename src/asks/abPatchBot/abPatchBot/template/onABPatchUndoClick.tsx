if (tags.abPatchApplied && tags.abPatchBotInstance) {
    shout('onABPatchUndo', { 
        botId: thisBot.id,
        abPatchBotIdentity: tags.abPatchBotIdentity,
        abPatchAskInput: tags.abPatchAskInput,
        abPatchCode: tags.abPatchCode,
        abPatchAppliedTimestamp: tags.abPatchAppliedTimestamp,
        abPatchResults: tags.abPatchResults,
    });

    thisBot.abPatchUndo();
}