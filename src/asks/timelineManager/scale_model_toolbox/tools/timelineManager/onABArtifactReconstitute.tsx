let data = that.data;
if (data.config) {
    data = data.config;
}

tags.color = data.color ?? '#031f40';
tags.prevColor = data.color ?? '#031f40';
tags.labelColor = data.labelColor ?? 'white';
tags.timelinePaused = true;
tags.timeUnit = data.timeUnit ?? 'month';
tags.currentStep = 0;

//Place bot correctly
if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

//If new model
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