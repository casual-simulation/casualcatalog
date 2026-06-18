const data = that.data;
tags.processingMode = data.processingMode ?? 'ai';

const existingCamera = getBot(byTag("curiosityCamera", true), not(byID(getID(thisBot))));
if (existingCamera) {
    destroy(existingCamera);
}

tags.abEquipmentFor = data.abEquipmentFor;

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
    tags[dimension + 'X'] = inMap ? -85.6753328691886 : dimensionX;
    tags[dimension + 'Y'] = inMap ? 42.96576576576577 : dimensionY;

    //tags.draggable = inMap ? false : null;

    // os.focusOn(thisBot);
}

if (configBot.tags.mapPortal) {
    tags.scale = 1.5;
} else {
    tags.scale = 1;
}

const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));
if (avatarBot) {
    tags.abEquipmentFor = getID(avatarBot);
    avatarBot.links.equipment.positionEquipment({base: avatarBot, equipment: [thisBot]});
}
