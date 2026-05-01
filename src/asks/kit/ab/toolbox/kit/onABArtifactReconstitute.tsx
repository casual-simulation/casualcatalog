let data = that.data;

tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.label = data.label ?? 'kit';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? abPersonality?.tags?.abBaseLabelColor ?? 'white';
tags.studioId = data.studioId;
tags.tool_array = data.tool_array;

tags.formAddress = await ab.abBuildCasualCatalogURL("/asks/meshes/kit_icon_holographic.glb");

if (data.studioId) {
    const catalogBot = getBot(byTag("studioId", data.studioId), byTag("studioCatalog", true));
    tags.lineTo = getID(catalogBot);
}

//Place bot correctly
if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

//If new
if (data.eggParameters) {
    const dimension = data.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = data.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = data.eggParameters.gridInformation?.position?.y ?? 0;

    tags.dimension = dimension;
    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;

    thisBot.onClick();
}