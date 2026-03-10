let data = that.data;
if (data.config) {
    data = data.config;
}

tags.label = data.label ?? 'door';
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? 'white';
tags.destination = data.destination;
tags.formAddress = data.formAddress;
tags.form = data.form;
tags.scaleX = data.scaleX ?? 1.5;
tags.scaleY = data.scaleY ?? .3;
tags.scaleZ = data.scaleZ ?? 2.5;

if (tags.formAddress) {
    tags.scaleX = 2;
    tags.scaleY = 2;
    tags.scaleZ = 2;

    thisBot.makeMiniSkybox();
}

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