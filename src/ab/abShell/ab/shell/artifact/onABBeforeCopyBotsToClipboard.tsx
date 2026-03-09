const { bots } = that;

if (tags.debug) {
    console.warn(`[${tags.system}.${tagName}] that:`, that);
}

// [IMPORTANT NOTE] (September 4, 2025): This is a workaround until we have ab artifact experience state working. As soon as experience state hooked
// up, this process should be eliminated because it changes the artifact instance id which is not ideal - but is servicable until
// then for the needs we have now.
const updatedInstances = new Set();

for (let bot of bots) {
    if (bot.tags.abArtifactInstanceID && bot.tags.abArtifactName) {
        if (!updatedInstances.has(bot.tags.abArtifactInstanceID)) {
            updatedInstances.add(bot.tags.abArtifactInstanceID);

            await thisBot.abUpdateArtifactShards({
                abArtifactInstanceID: bot.tags.abArtifactInstanceID,
                abArtifactName: bot.tags.abArtifactName,
                abArtifactInstanceOwner: bot.tags.abArtifactInstanceOwner,
            })
        }
    }
}