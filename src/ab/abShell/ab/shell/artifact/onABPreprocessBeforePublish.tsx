if (!thisBot.isReconstitutionEnabled()) {
    console.warn(`[${tags.system}.${tagName}] reconstitution is disabled`);
    return;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, {...that});
}

thisBot.abPreprocessBotDataToArtifactPromises({ botData: that.botData });