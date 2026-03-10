const {
    abArtifactInstanceID,
} = that ?? {}

assert(typeof abArtifactInstanceID === 'string', `[${tags.system}.${tagName}] abArtifactInstanceID is a required string parameter.`);

if (!thisBot.isExperienceEnabled()) {
    console.warn(`[${tags.system}.${tagName}] experience is disabled.`);
    return;
}

if (thisBot.vars.instanceDocs) {
    const instanceDoc = thisBot.vars.instanceDocs[abArtifactInstanceID];

    if (instanceDoc) {
        const shardBots = thisBot.abGetArtifactInstanceShardBots({ abArtifactInstanceID});

        const { document, experienceMap, experienceSub } = instanceDoc;

        const experienceData = experienceMap.toJSON();

        if (tags.debugExp) {
            console.log(`[${tags.system}.${tagName}] updating abArtifactInstanceID ${abArtifactInstanceID} with experience state:`, JSON.parse(JSON.stringify(experienceData)));
        }
        
        await Promise.allSettled(whisper(shardBots, 'onABArtifactExperience', { data: experienceData }));
    }
}