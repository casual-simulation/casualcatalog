// Need to reimplement undo functionaltiy, its much more complex now that todo bots could be part of a larger plan.
// Its possible that we would need to undo any patches on todo bots that are in the plan after this one.
console.warn('TODO: need to reimplement undo functionality functionality. defaulting to old naive behavior.');

if (tags.abPatchApplied && tags.abPatchTodoInstance) {
    shout('onAnyABPatchUndo', { 
        botId: thisBot.id,
        abPatchCode: tags.abPatchCode,
        abPatchAppliedTimestamp: tags.abPatchAppliedTimestamp,
        abPatchResults: tags.abPatchResults,
    });

    thisBot.abPatchUndo();
}