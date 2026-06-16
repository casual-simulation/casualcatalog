let data = that.data;
if (data.config) {
    data = data.config;
}

const existingAvatarBot = getBots(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));
for (const existingBot of existingAvatarBot) {
    if (existingBot != thisBot) {
        destroy(existingBot);
    }
}

await os.sleep(0);
tags.ownerID = authBot?.id;

let label = data.label ?? 'player';
if (!data.label && authBot && authBot.tags.name) {
    label = authBot.tags.name;
}

const newFormAdd = await ab.abBuildCasualCatalogURL('ab/userIcons/avatar_pin.glb');
tags.formAddress = newFormAdd;

tags.label = label;
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? abPersonality?.tags?.abBaseLabelColor ?? 'black';
tags.strokeColor = data.strokeColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.prevID = data.prevID;
changeState(thisBot, false, "selected");

thisBot.setIcon();

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

if (configBot.tags.mapPortal && links.homeworld?.tags.usingGPS) {
    thisBot.onGPSEnabled();
} else {
    thisBot.onGPSDisabled();
}


if (data.clickOnLoad) {
    thisBot.onClick();
}

shout("abEquipmentBaseReconstituted", thisBot);
