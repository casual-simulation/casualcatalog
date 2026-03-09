const data = that.data;

const studioCheck = getBot(byTag("studioStation", true), byTag("studioId", data.studioId));
if (studioCheck && studioCheck != thisBot) {
    destroy(thisBot);
}

tags.placeLabel = data.label ?? 'studio';
tags.scaleX = data.scaleX ?? 2;
tags.scaleY = data.scaleY ?? 2;
tags.scaleZ = data.scaleZ ?? 1;
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.placeLabelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.placeLabelColor = data.labelColor ?? abPersonality?.tags?.abBaseLabelColor ?? 'black';
tags.studioId = data.studioId;
tags.strokeBot = null;
tags.prevBotID = data.prevBotID;

tags.formAddress = ab.abBuildCasualCatalogURL("/asks/meshes/hexagon.glb");
tags.strokeFormAddress = ab.abBuildCasualCatalogURL("/asks/meshes/hexagon_stroke.glb");

if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

if (data.eggParameters) {
    const dimension = data.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = data.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = data.eggParameters.gridInformation?.position?.y ?? 0;

    tags.dimension = dimension;
    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;
}

const strokeBot = await thisBot.generateStroke();
tags.strokeBot = getLink(strokeBot);
thisBot.updateBillboardLabel();

shout("onStudioStationReconstituted", thisBot);