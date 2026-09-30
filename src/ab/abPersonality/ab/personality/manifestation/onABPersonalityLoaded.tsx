if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] personality loaded.`);
}

if (links.abBot) {
    const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
    await thisBot.abManifestBot({
        dimension: dimension,
        position: {
            x: links.abBot.tags[dimension + 'X'],
            y: links.abBot.tags[dimension + 'Y'],
        }
    });
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] bot manifested.`, links.abBot);
    }
    shout("onABManifestedAfterPersonality");
}

