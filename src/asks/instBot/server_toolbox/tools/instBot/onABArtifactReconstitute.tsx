const data = that.data;

tags.label = data.label ?? null;
tags.biosSetting = data.biosSetting ?? null;
tags.creationTime = data.creationTime ?? null;
tags.expirationTime = data.expirationTime ?? null;
tags.instSetting = data.instSetting ?? null;
tags.instURL = data.instURL ?? null;
tags.patternSetting = data.patternSetting ?? null;
tags.studioSetting = data.studioSetting ?? null;
tags.versionSetting = data.versionSetting ?? null;
tags.channelSetting = data.channelSetting ?? null;
tags.scale = data.scale ?? null;
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#0000FF';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#0000FF'; 
tags.labelColor = data.labelColor ?? abPersonality?.tags?.abBaseLabelColor ?? 'black'

tags.studioId = data.studioId;
tags.originType = data.originType;

tags.strokeBot = null;
tags.formAddress = ab.abBuildCasualCatalogURL("/asks/meshes/inst_cylinder_16.glb");
tags.strokeFormAddress = ab.abBuildCasualCatalogURL("/asks/meshes/inst_cylinder_16_stroke.glb");

if (!tags.label) {
    let instShortening;
    if(data.instSetting) {
        instShortening = data?.instSetting?.slice(-4);
    }
    let label = (instShortening ?? 'inst ') + (tags.biosSetting ? (" (" + tags.biosSetting + ")") : "");
    tags.label = label;
}

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

//set creation time if none provided
if (!tags.creationTime) {
    tags.creationTime = DateTime?.now()?.toMillis();

    if (tags.biosSetting == 'free') {
        tags.expirationTime = DateTime?.fromMillis(tags.creationTime + (24 * 1000 * 60 * 60))?.toMillis();
    }
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

const strokeBot = await thisBot.generateStroke();
tags.strokeBot = getLink(strokeBot);
shout('clearInstCreatorMenu');

thisBot.determineLineTo();