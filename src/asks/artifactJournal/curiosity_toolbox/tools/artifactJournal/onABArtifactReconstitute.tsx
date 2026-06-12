const data = that.data;

const existingJournal = getBot(byTag("artifactJournal", true), not(byID(getID(thisBot))));
if (existingJournal) {
    destroy(existingJournal);
}

tags.journalURL = data.url ?? undefined;
tags.userData = data.userData;
tags.abEquipmentFor = data.abEquipmentFor;

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

    // os.focusOn(thisBot);
}

const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));
if (avatarBot) {
    tags.abEquipmentFor = getID(avatarBot);
}

await thisBot.getDataFromStrapi();
thisBot.showRoT();
