let data = that.data;
if (data.config) {
    data = data.config;
}

const existingAvatarBot = getBot(byTag("mapAvatar", true), byTag("remoteID", configBot.tags.id));
if (existingAvatarBot) {
    if (!data.disableGPS) {
        if (existingAvatarBot.tags.continueLocationPull) {
            data.disableGPS = false;
        } else {
            data.disableGPS = true;
        }
    }
    destroy(existingAvatarBot);
}

await os.sleep(0);
tags.remoteID = configBot.tags.id;

let label = data.label ?? 'player';
if (!data.label && authBot && authBot.tags.name) {
    label = authBot.tags.name;
}

tags.label = label;
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? 'white';
tags.strokeColor = data.strokeColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';

thisBot.setIcon(data.formAddress);

setTagMask(thisBot, "abIgnore", true, "shared");

//Place bot correctly
if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

//If new action
if (data.eggParameters) {
    const dimension = data.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = data.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = data.eggParameters.gridInformation?.position?.y ?? 0;

    tags.dimension = dimension;
    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;
}

if (configBot.tags.mapPortal) {
    thisBot.useGPS(data.disableGPS ? false : true);
    thisBot.toggleLocationPull(data.disableGPS ? false : true);
} else {
    thisBot.useGPS(false);
    thisBot.toggleLocationPull(false);
}

