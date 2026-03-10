const data = that.data;

tags.label = data.label ?? 'name me';
tags.landmarkLocked = data.landmarkLocked ?? false;
tags.landmarkName = data.landmarkName;
tags.landmarkLink = data.landmarkLink;
tags.landmarkID = data.landmarkID ?? uuid();
tags.landmarkImg = data.landmarkImg;
tags.landmarkDesc = data.landmarkDesc;
tags.discovered = data.discovered ?? false;

thisBot.setStatusVisuals();

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