let data = that.data;
if (data.config) {
    data = data.config;
}
tags.label = data.label ?? 'model';
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? 'white';
tags.modelAttributes = data.modelAttributes;
tags.modelAttributesStartingValues = data.modelAttributes;
tags.scaleX = data.scaleX ?? 2;
tags.scaleY = data.scaleY ?? 2;
tags.scaleZ = data.scaleZ ?? 1;
tags.modelLocked = data.modelLocked;
tags.formAddress = data.formAddress;
tags.form = data.form;
tags.formSubtype = data.formSubtype;
tags.modelName = data.modelName;

if (!tags.modelAttributes) {
    tags.modelAttributes = {};
}

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