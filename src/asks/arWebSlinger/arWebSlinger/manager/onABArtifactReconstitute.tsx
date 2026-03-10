const data = that.data;

if (data.eggParameters) {
    if (data.eggParameters.gridInformation) {
        const dimension = data.eggParameters.gridInformation.dimension ?? 'home';
        const dimensionX = data.eggParameters.gridInformation.position?.x ?? 0;
        const dimensionY = data.eggParameters.gridInformation.position?.y ?? 0;

        tags.dimension = dimension;
        tags[dimension] = true;
        tags[dimension + 'X'] = dimensionX;
        tags[dimension + 'Y'] = dimensionY;
    }
}

if (data.managerDimension) {
    tags.dimension = data.managerDimension;
    tags[data.managerDimension] = true;
    tags[data.managerDimension + 'X'] = data.managerDimensionX;
    tags[data.managerDimension + 'Y'] = data.managerDimensionY;
    tags[data.managerDimension + 'Z'] = data.managerDimensionZ;
}

thisBot.refreshHex();

if (data.eggParameters) {
    thisBot.arWebSlingerMenuOpen();
}