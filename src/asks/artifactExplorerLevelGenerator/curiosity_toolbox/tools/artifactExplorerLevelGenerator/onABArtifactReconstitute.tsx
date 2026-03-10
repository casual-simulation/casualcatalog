const data = that.data;

tags.chosenPattern = data.chosenPattern;
tags.chosenStudio = data.chosenStudio;
tags.prevBotID = data.prevBotID;

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

if (!tags.chosenPattern) {
    tags.chosenPattern = "artifactExplorer";
}

thisBot.updateBillboardLabel();