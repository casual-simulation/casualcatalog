const data = that.data;

tags.chosenBIOS = data.bios;
tags.chosenInstName = data.instName;
tags.chosenPattern = data.defaultPattern;
tags.chosenPatternStudio = data.defaultPatternStudio;
tags.chosenUUABName = data.uuabName;
tags.uuab_onUUABLoaded = data.onUUABLoaded ?? tags.template_onUUABLoaded;
tags.uuabSetupLabel = data.uuabSetupLabel ?? "configure uuab";
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

    tags.chosenBIOS = 'free';
    tags.uuab_onUUABLoaded = tags.template_onUUABLoaded;
    tags.uuabSetupLabel = "configure uuab";
    thisBot.showUUABSetupMenu();
}

thisBot.updateBillboardLabel();