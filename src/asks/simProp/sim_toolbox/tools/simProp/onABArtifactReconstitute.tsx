let data = that.data;
if (data.config) {
    data = data.config;
}
tags.label = data.label ?? 'prop';
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? 'white';
tags.simID = data.simID ?? uuid();
tags.simAttributes = data.simAttributes;
tags.simAttributesStartingValues = data.simAttributes;
tags.propLocked = data.propLocked ?? false;
tags.roleName = data.roleName;
tags.trackedStat = data.trackedStat;
tags.trackedStatStartingValue = data.trackedStatStartingValue ?? 0;
tags.trackedStatEndingValue = data.trackedStatEndingValue ?? 100;
tags.scaleX = 2;
tags.scaleY = 2;
tags.scaleZ = 1;

if (!tags.simAttributes) {
    tags.simAttributes = {};
}

if (data.genForm || data.imagePrompt) {
    tags.imagePrompt = data.imagePrompt;
    tags.genForm = data.genForm;
    thisBot.createImage();
}

thisBot.setProgressBar();

shout("onPropReconstituted", thisBot);

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

    thisBot.onClick();
}

if (tags.dimension && tags.dimension != 'blueprint') {
    tags.blueprint = true;
    tags.blueprintX = tags[tags.dimension + 'X'];
    tags.blueprintY = tags[tags.dimension + 'Y'];
}

if (data.autoGenerateReactions == false) {
    return;
} else {
   thisBot.createPropReactions(); 
}