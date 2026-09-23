console.log("reloading ab due to personality change", links.abBot);

if (links.abBot) {
    const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
    thisBot.abManifestBot({
        dimension: dimension,
        position: {
            x: links.abBot.tags[dimension + 'X'],
            y: links.abBot.tags[dimension + 'Y'],
        }
    });
}

