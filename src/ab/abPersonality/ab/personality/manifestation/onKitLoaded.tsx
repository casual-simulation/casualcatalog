console.log("kit loaded", that, that.tags.kitId, tags.currentKit, links.abBot, masks.manifestingAB);
if (that.tags.kidId == tags.currentKit) {
    if (masks.manifestingAB == true) {
        masks.awaitingManifestation = true;
        return;
    }

    if (links.abBot) {
        console.log("found abBot")
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