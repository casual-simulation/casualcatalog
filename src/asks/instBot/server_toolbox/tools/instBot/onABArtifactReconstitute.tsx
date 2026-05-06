const data = that.data;

tags.label = data.label ?? null;
tags.labelSetting = data.labelSetting ?? null;
tags.biosSetting = data.biosSetting ?? null; 
tags.creationTime = data.creationTime ?? null;
tags.expirationTime = data.expirationTime ?? null;
tags.instSetting = data.instSetting ?? null;
tags.instURL = data.instURL ?? null;
tags.patternSetting = data.patternSetting ?? null;
tags.studioSetting = data.studioSetting ?? null;
tags.versionSetting = data.versionSetting ?? null;
tags.channelSetting = data.channelSetting ?? null;
tags.abAwakeSetting = data.abAwakeSetting ?? null;
tags.scale = data.scale ?? null;
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#0000FF';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#0000FF'; 
tags.labelColor = data.labelColor ?? abPersonality?.tags?.abBaseLabelColor ?? 'black'
tags.abConfiguratorGroup = data.abConfiguratorGroup ?? ('scaleModel_' + getID(thisBot));

tags.studioId = data.studioId;
tags.originType = data.originType;

tags.formAddress = ab.abBuildCasualCatalogURL("/asks/meshes/cylinder_16_unlit_both.glb");

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

//Check if expired
if (tags.biosSetting && tags.biosSetting == 'free') {
    const currTime = DateTime?.now()?.toMillis();

    //TODO: ab1 has different expire times than auxplayer and brandplayer
    //Treating as all expire in 24hr for now

    const elapsedMS = currTime - tags.creationTime;
    const hoursPassed = elapsedMS / (1000 * 60 * 60);

    if (hoursPassed >= 24) {
        thisBot.expireInstBot();
    }
}

if (data.expiredInstBot) {
    thisBot.expireInstBot();
}

// const strokeBot = await thisBot.generateStroke();
// tags.strokeBot = getLink(strokeBot);
shout('clearInstCreatorMenu');

thisBot.determineLineTo();

thisBot.onClick();