const { 
    bots,
    abArtifactName,
} = that ?? {}

if (bots) {
    assert(Array.isArray(bots), `[${tags.system}.${tagName}] bots must be an array.`);
}

const instances: Record<string, Bot[]> = {} // Key is artifact instance id.

function processBotArtifactInstance(bot) {
    if (bot.tags.abArtifactName && bot.tags.abArtifactInstanceID) {
        // Optional: filter by abArtifactName.
        if (abArtifactName && abArtifactName !== bot.tags.abArtifactName) {
            return;
        }

        let botArray = instances[bot.tags.abArtifactInstanceID];

        if (!botArray) {
            botArray = [];
            instances[bot.tags.abArtifactInstanceID] = botArray;
        }

        botArray.push(bot);
    }
}

if (bots) {
    // Get artifact instances in provided list of bots.
    bots.forEach(b => processBotArtifactInstance(b));
} else {
    // Get artifact instances in inst.
    getBots(b => processBotArtifactInstance(b));
}

return instances;