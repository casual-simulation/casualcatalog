let data = that.data;
if (data.config) {
    data = data.config;
}

let label = 'P';
const players = getBots("simPlayer", true);
label = label + ' ' + (players.length ?? 1);

tags.label = data.label ?? label;
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelColor = data.labelColor ?? 'white';
tags.strokeColor = data.strokeColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.simID = data.simID ?? uuid();
tags.form = data.form;
tags.formSubtype = data.formSubtype;
tags.formAddress = data.formAddress;
tags.formAddressAspectRatio = data.formAddressAspectRatio;

tags.formOpacity = 0;

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