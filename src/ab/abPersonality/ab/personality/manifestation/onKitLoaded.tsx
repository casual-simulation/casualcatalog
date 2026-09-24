if (that.tags.kidId == tags.currentKit) {
    if (tags.manifestingAB) {
        masks.awaitingManfestation = true;
        return;
    }

    if (links.abBot) {
        const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
        thisBot.abManifestBot({
            dimension: dimension,
            position: {
                x: links.abBot.tags[dimension + 'X'],
                y: links.abBot.tags[dimension + 'Y']
            }
        })
    }
}