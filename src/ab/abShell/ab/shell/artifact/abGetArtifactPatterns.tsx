const { 
    bots,
    abArtifactName,
} = that ?? {}

if (bots) {
    assert(Array.isArray(bots), `[${tags.system}.${tagName}] bots must be an array.`);
}

const patterns: Record<string, Bot[]> = {} // Key is artifact name.

function processBotArtifactPattern(bot) {
    // Pattern bots have abArtifactName but no abArtifactInstanceID
    if (bot.tags.abArtifactName && !bot.tags.abArtifactInstanceID) {
        // Optional: filter by abArtifactName.
        if (abArtifactName && abArtifactName !== bot.tags.abArtifactName) {
            return;
        }

        let botArray = patterns[bot.tags.abArtifactName];

        if (!botArray) {
            botArray = [];
            patterns[bot.tags.abArtifactName] = botArray;
        }

        botArray.push(bot);
    }
}

if (bots) {
    // Get artifact patterns in provided list of bots.
    bots.forEach(b => processBotArtifactPattern(b));
} else {
    // Get artifact patterns in inst.
    getBots(b => processBotArtifactPattern(b));
}

return patterns;