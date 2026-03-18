const data = that.data;

tags.journalURL = data.url ?? undefined;
tags.userData = data.userData;
tags.continueLocationPull = false;

if (!data.userData) {
    thisBot.getUserData();
}

if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

if (data.eggParameters) {
    const dimension = data.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = data.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = data.eggParameters.gridInformation?.position?.y ?? 0;

    const inMap = configBot.tags.mapPortal ? true : false;

    tags.dimension = dimension;
    tags[dimension] = true;
    tags[dimension + 'X'] = inMap ? -85.67531660736826 : dimensionX;
    tags[dimension + 'Y'] = inMap ? 42.965225225225225 : dimensionY;
    tags[dimension + 'Z'] = inMap ? -10 : -1.5;

    tags.draggable = inMap ? false : null;

    os.focusOn(thisBot);
}

await thisBot.getDataFromStrapi();
thisBot.spawnPlayer();
thisBot.showRoT();