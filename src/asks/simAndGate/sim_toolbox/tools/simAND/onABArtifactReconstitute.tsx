let data = that.data;

if (data.config) {
    data = data.config;
}

tags.label = data.label ?? 'AND gate';
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelColor = data.labelColor ?? 'white';
tags.simID = data.simID ?? uuid();
tags.actionTriggers = data.actionTriggers;
tags.abConfiguratorGroup = data.abConfiguratorGroup ?? ('simAND_' + getID(thisBot));

thisBot.resetLineTo();

//Place bot correctly
if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

//If new
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

if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
}