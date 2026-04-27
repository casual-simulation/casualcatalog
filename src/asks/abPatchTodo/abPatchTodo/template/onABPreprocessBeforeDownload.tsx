const { botData, filename, sourceEvent } = that;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

if (sourceEvent === 'download_artifact_pattern') {
    const thisBotData = botData[thisBot.id];

    // Need to cleanup some tags that might be set when downloading as artifact pattern.
    delete thisBotData.tags.abPatchTodoInstance;
    delete thisBotData.tags.abPatchCode;
    delete thisBotData.tags.abPatchResults;
    delete thisBotData.tags.abPatchApplied;
    delete thisBotData.tags.abPatchAppliedTimestamp;
    delete thisBotData.tags.abPatchApplying;
    delete thisBotData.tags.abTodoComplete;
    delete thisBotData.tags.abPatchError;
    delete thisBotData.tags.alwaysApprove;
    delete thisBotData.tags.agentMode;
    delete thisBotData.tags.currAnimation;
    delete thisBotData.tags.prompt;
    delete thisBotData.tags.lineTo;
    delete thisBotData.tags.todoLabel;
    delete thisBotData.tags.todoReadyForAgent;
    delete thisBotData.tags.budgetCredits;
    delete thisBotData.tags.budgetRecordName;
    delete thisBotData.tags.todoPlanId;
    delete thisBotData.tags.todoOrder;
    delete thisBotData.tags.todoApproved;
    delete thisBotData.tags.aiModel;
    delete thisBotData.tags.agentName;
    delete thisBotData.tags.animationState;
    delete thisBotData.tags.creditSnapshotStart;
    delete thisBotData.tags.creditSnapshotEnd;
    delete thisBotData.tags.playedCreateSound;
    delete thisBotData.tags.promptInjection;
    delete thisBotData.tags.toolSourceBots;

    thisBotData.tags.form = 'nothing';
    thisBotData.tags.system = 'abPatchTodo.template';

    const dimension = thisBot.tags.dimension;
    delete thisBotData.tags.dimension;
    if (dimension) {
        delete thisBotData.tags[dimension];
        delete thisBotData.tags[dimension + 'X'];
        delete thisBotData.tags[dimension + 'Y'];
        delete thisBotData.tags[dimension + 'Z'];
    }
}
