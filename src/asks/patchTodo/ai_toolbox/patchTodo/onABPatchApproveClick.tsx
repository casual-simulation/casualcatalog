if (tags.abPatchApplied && tags.abPatchBotInstance) {
    shout('onABPatchApprove', { 
        botId: thisBot.id,
        abPatchBotIdentity: tags.abPatchBotIdentity,
        abPatchAskInput: tags.abPatchAskInput,
        abPatchCode: tags.abPatchCode,
        abPatchAppliedTimestamp: tags.abPatchAppliedTimestamp,
        abPatchResults: tags.abPatchResults,
    });

    destroy(thisBot);
}