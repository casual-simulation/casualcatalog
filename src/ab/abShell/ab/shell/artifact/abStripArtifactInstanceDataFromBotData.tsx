const botData = that;

assert(links.utils.isObject(botData), `[${tags.system}.${tagName}] argument must be an object.`);

for (const key in botData) {
    const data = botData[key];
    
    if (data.tags.abArtifactBot === true) {
        // Remove artifact bots.
        delete botData[key];
        
    } else if (data.tags.abArtifactName) {
        // Strip artifact instance data from bot.
        delete data.tags.abArtifactBundle;
        delete data.tags.abArtifactInstanceID;
        delete data.tags.abArtifactShardInstanceID;
        delete data.tags.abArtifactShardReconstituted;
        delete data.tags.abArtifactInstanceOwner;

        // Remove some others.
        delete data.tags.creator;

        // Give each bot a chance to strip instance data from the copy of its own bot data.
        await Promise.allSettled(whisper(data.id, 'onABStripArtifactInstanceDataFromBotData', { data }));
    }
}