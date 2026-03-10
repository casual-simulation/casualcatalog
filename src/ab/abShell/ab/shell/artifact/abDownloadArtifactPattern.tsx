const {
    abArtifactName,
    shardBots,
} = that ?? {};

assert(typeof abArtifactName === 'string', `[${tags.system}.${tagName}] abArtifactName is a required string parameter.`);
assert(Array.isArray(shardBots) && shardBots.length > 0, `[${tags.system}.${tagName}] shardBots is a required Bot array parameter. It must have at least 1 bot.`);

return links.store.abDownload({ 
    possibleBots: shardBots,
    filename: `${abArtifactName}`,
    sourceEvent: 'download_artifact_pattern',
    reopenAbMenu: false,
    onPreprocessBeforeDownload: async (arg) => {
        await thisBot.abStripArtifactInstanceDataFromBotData(arg.botData);
    }
});