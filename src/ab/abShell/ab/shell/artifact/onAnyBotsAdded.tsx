if (!masks.instJoined) {
    return;
}

const addedBots = that.bots;

for (const bot of addedBots) {
    if (bot == null) {
        continue;
    }

    if (bot.tags.abArtifactInstanceID) {
        await os.sleep(250);

        if (bot.tags.abArtifactShardReconstituted) {
            if (tags.debugExp) {
                console.log(`[${tags.system}.${tagName}] detected added abArtifactInstanceID: ${bot.tags.abArtifactInstanceID}.`)
            }

            thisBot.abLoadArtifactInstanceDocument({ abArtifactInstanceID: bot.tags.abArtifactInstanceID });
        }
    } 
    else if (bot.tags.abReconstitutingArtifactSignalBot) {
        thisBot.vars.reconstitutingSignalBotIds.add(bot.id);
    }
}