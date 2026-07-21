const data = that.data;

tags.label = data.label ?? null;
tags.placeLabel = tags.label;
tags.instSetting = data.instSetting;
tags.biosSetting = data.biosSetting;

if (tags.label) {
    tags.homePlace = true;
}
tags.instURL = data.instURL ?? null;
tags.scale = data.scale ?? 2;
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#0000FF';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#0000FF'; 
tags.labelColor = data.labelColor ?? abPersonality?.tags?.abBaseLabelColor ?? 'black'

tags.studioId = data.studioId;
tags.originType = data.originType;
tags.placeAsk = data.placeAsk;

tags.form = 'mesh';
tags.formAddress = ab.abBuildCasualCatalogURL("/asks/meshes/sphere_solidColor.glb");
tags.strokeFormAddress = ab.abBuildCasualCatalogURL("/asks/meshes/inst_cylinder_16_stroke.glb");

if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

if (data.eggParameters) {
    const dimension = data.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = data.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = data.eggParameters.gridInformation?.position?.y ?? 0;

    tags.toolbox = data.eggParameters.toolboxBot;
    if (links?.toolbox?.tags?.studioId && !data.studioId) {
        tags.studioId = links.toolbox.tags.studioId;
    }

    tags.dimension = dimension;
    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;
}

if (tags.studioId) {
    tags.worldLayer = tags.studioId;
}

// const strokeBot = await thisBot.generateStroke();
// tags.strokeBot = getLink(strokeBot);
shout('clearInstCreatorMenu');

thisBot.determineLineTo();

if (data.generateURLOnLoad) {
    thisBot.createURL();
} else {
    if (!tags.instURL) {
        thisBot.onClick();
    }
}

shout("onWorldLayerEvent");