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

    tags.dimension = dimension;
    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;

    const simCycleBot = getBot(byTag("system", "sim_toolbox.tools.simCycle"), not(byID(thisBot.id)));

    if (simCycleBot) {
        os.toast("WARNING: More than one sim cycle is present in this inst", 8);
    }
}