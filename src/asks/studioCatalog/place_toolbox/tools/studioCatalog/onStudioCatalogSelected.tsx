if (tags.selected && that != thisBot) {
    masks.selected = null;
}

if (that == thisBot) {
    //move kits
    const kitBots = getBots(byTag("abArtifactName", "kit"), byTag("lineTo", getID(thisBot)));
    for (let i = 0; i < kitBots.length; ++i) {
        const dimension = tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
        const isMap = configBot.tags.mapPortal ? true : false;
        const inRad = isMap ? .0001 : 3;
        const rad = isMap ? .0005 : 5;
        const space = isMap ? .0005 : 1;

        const pos = ab.links.utils.findOpenPositionAround({center: new Vector2(tags[dimension + 'X'], tags[dimension + 'Y']), dimension: dimension, innerRadius: inRad, radius: rad, spacing: space})

        kitBots[i].tags[dimension + 'X'] = pos.x;
        kitBots[i].tags[dimension + 'Y'] = pos.y;

        await os.sleep(0);
    }
}