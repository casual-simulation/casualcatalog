const data = that.data;

tags.label = data.label ?? 'catalog';
tags.scaleX = data.scaleX ?? 2;
tags.scaleY = data.scaleY ?? 2;
tags.scaleZ = data.scaleZ ?? 1;
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? abPersonality?.tags?.abBaseLabelColor ?? 'black';
tags.studioId = data.studioId;
tags.strokeColor = abPersonality?.tags.abBaseStrokeColor;
tags.prevBotID = data.prevBotID;
tags.respawnPoint = data.respawnPoint;
tags.toolbox_array = data.toolbox_array ?? ab.links.remember.tags.toolbox_array;
tags.armColor = abPersonality?.tags.abBaseStrokeColor;
tags.armMeshPath = ab.links.remember.tags.abArmMeshPath;
tags.abIgnore = true;

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

let hasCustomMesh = false;
if (tags.studioId) {
    hasCustomMesh = await thisBot.applyStudioConfig();
}

if (!hasCustomMesh) {
    tags.formAddress = ab.abBuildCasualCatalogURL('/asks/meshes/hexagon.glb');
    tags.strokeFormAddress = ab.abBuildCasualCatalogURL('/asks/meshes/hexagon_stroke.glb');
    const strokeBot = await thisBot.generateStroke();
    tags.strokeBot = getLink(strokeBot);
}

if (!tags.studioId && authBot) {
    if (!configBot.tags.user_studios) {
        await ab.abRefreshStudios();
    }
    
    // If there the user is not part of any studios, automatically load this catalog with the user studio.
    const studios = configBot.tags.user_studios?.studios ?? [];
    if (studios.length === 0) {
        thisBot.setStudio({
            studioId: authBot?.id,
            displayName: 'user studio'
        })
    }
}

shout('onStudioCatalogReconstituted', thisBot);

if (!tags.studioId) {
    // If the bot doesn't have a studioId, automatically open the studio select menu.
    thisBot.onClick();
}