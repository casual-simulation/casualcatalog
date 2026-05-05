const data = that.data;

tags.label = data.label ?? 'catalog';
tags.scaleX = data.scaleX ?? 2;
tags.scaleY = data.scaleY ?? 2;
tags.scaleZ = data.scaleZ ?? 1;
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? abPersonality?.tags?.abBaseLabelColor ?? 'black';
tags.studioId = data.studioId;
tags.strokeColor = data.strokeColor ?? abPersonality?.tags.abBaseStrokeColor;
tags.prevBotID = data.prevBotID;
tags.respawnPoint = data.respawnPoint;
tags.toolbox_array = data.toolbox_array ?? ab.links.remember.tags.toolbox_array;
tags.armColor = data.armColor ?? abPersonality?.tags.abBaseStrokeColor;
tags.armMeshPath = data.armMeshPath ?? ab.links.remember.tags.abArmMeshPath;
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

const formAddress = data.formAddress ?? '/asks/meshes/hexagon.glb';
if (formAddress.startsWith('https://')) {
    tags.formAddress = formAddress;
} else {
    tags.formAddress = ab.abBuildCasualCatalogURL(formAddress);
}

const hasStrokeSet = 'strokeFormAddress' in data;

if (hasStrokeSet) {
    if (data.strokeFormAddress) {
        if (data.strokeFormAddress.startsWith('https://')) {
            tags.strokeFormAddress = data.strokeFormAddress;
        } else {
            tags.strokeFormAddress = ab.abBuildCasualCatalogURL(data.strokeFormAddress);
        }
    } else {
        // Stroke explicitly set to nothing.
        tags.strokeFormAddress = null;
    }
} else {
    // Use default stroke.
    tags.strokeFormAddress = ab.abBuildCasualCatalogURL('/asks/meshes/hexagon_stroke.glb');
}

if (tags.strokeFormAddress) {
    const strokeBot = await thisBot.generateStroke();
    tags.strokeBot = getLink(strokeBot);
}

if (authBot) {
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

thisBot.onClick();