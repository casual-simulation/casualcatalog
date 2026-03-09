const {
    abArtifactName,
    studio,
    shardBots,
    manualPublish,
} = that ?? {};

assert(typeof abArtifactName === 'string', `[${tags.system}.${tagName}] abArtifactName is a required string parameter.`);
assert(typeof studio === 'string', `[${tags.system}.${tagName}] studio is a required string parameter.`);
assert(Array.isArray(shardBots) && shardBots.length > 0, `[${tags.system}.${tagName}] shardBots is a required Bot array parameter. It must have at least 1 bot.`);

return links.store.abPublishAB({
    ab: abArtifactName, 
    target: shardBots, 
    studio,
    manualPublish,
    sourceEvent: 'publish_artifact_pattern',
    onPreprocessBeforePublish: async (arg) => {
        await thisBot.abStripArtifactInstanceDataFromBotData(arg.botData);
    }
});