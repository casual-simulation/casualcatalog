const { botIDs } = that;

if (masks.selectedArtifactBotId && botIDs.includes(masks.selectedArtifactBotId)) {
    thisBot.abArtifactBotMenuReset();
}

for (let botID of botIDs) {
    const deleted = thisBot.vars.reconstitutingSignalBotIds.delete(botID);

    if (deleted) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] detected removed reconstitution signal bot, will now begin check if reconsitituion is at rest.`);
        }

        thisBot.abCheckArtifactReconstitutionAtRest();
    }
}