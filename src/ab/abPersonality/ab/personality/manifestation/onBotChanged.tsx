await os.sleep(100);
if (that.tags.includes("manifestingAB")) {
    if (!tags.manifestingAB && tags.awaitingManifestation) {
        masks.awaitingManifestation = false;
        
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
}