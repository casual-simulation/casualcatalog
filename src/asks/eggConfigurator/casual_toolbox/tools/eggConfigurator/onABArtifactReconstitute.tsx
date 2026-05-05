const data = that.data;

tags.chosenEggName = data.eggName;
tags.chosenStudio = data.eggStudio;
tags.label = data.label ?? "configure egg";
tags.eggConfigConfirmed = data.eggConfigConfirmed ?? false;
tags.chosenVersionNumber = null;
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? abPersonality?.tags?.abBaseLabelColor ?? 'black';
tags.prevBotID = data.prevBotID;
tags.studioId = data.studioId;
tags.strokeBot = null;

tags.formAddress = ab.abBuildCasualCatalogURL("/asks/meshes/egg.glb");
tags.strokeFormAddress = ab.abBuildCasualCatalogURL("/asks/meshes/egg_stroke.glb");

if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

if (data.eggParameters) {
    const dimension = data.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = data.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = data.eggParameters.gridInformation?.position?.y ?? 0;

    if (data.eggParameters.toolboxBot?.tags?.studioId && !data.studioId) {
        tags.studioId = data.eggParameters.toolboxBot.tags.studioId;
    }

    tags.dimension = dimension;
    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;

    thisBot.showEggSetupMenu();
}

const strokeBot = await thisBot.generateStroke();
tags.strokeBot = getLink(strokeBot);

thisBot.determineLineTo();