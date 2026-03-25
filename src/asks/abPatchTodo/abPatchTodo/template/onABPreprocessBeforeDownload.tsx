const { botData, filename, sourceEvent } = that;

console.log(`[${tags.system}.${tagName}] that:`, that);

if (sourceEvent === 'download_artifact_pattern') {
    const thisBotData = botData[thisBot.id];

    // Need to cleanup some tags that might be set when downloading as artifact pattern.
    delete thisBotData.tags.abPatchBotInstance;
    delete thisBotData.tags.abIgnore;
    delete thisBotData.tags.abIDOrigin;
    delete thisBotData.tags.alwaysApprove;
    delete thisBotData.tags.currAnimation;
    delete thisBotData.tags.debug;

    const dimension = thisBot.tags.dimension;
    delete thisBotData.tags.dimension;
    if (dimension) {
        delete thisBotData.tags[dimension];
        delete thisBotData.tags[dimension + 'X'];
        delete thisBotData.tags[dimension + 'Y'];
        delete thisBotData.tags[dimension + 'Z'];
    }
}
