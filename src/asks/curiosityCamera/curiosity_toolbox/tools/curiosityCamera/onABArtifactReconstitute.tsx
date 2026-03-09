const data = that.data;

if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

if (data.eggParameters) {
    const dimension = data.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = data.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = data.eggParameters.gridInformation?.position?.y ?? 0;

    const inMap = configBot.tags.mapPortal ? true : false;

    tags.dimension = dimension;
    tags[dimension] = true;
    tags[dimension + 'X'] = inMap ? -85.6753328691886 : dimensionX;
    tags[dimension + 'Y'] = inMap ? 42.96576576576577 : dimensionY;

    tags.draggable = inMap ? false : null;

    os.focusOn(thisBot);
}