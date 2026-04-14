let data = that.data;
if (data.config) {
    data = data.config;
}
tags.label = data.label ?? 'model';
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? 'white';
tags.modelAttributes = data.modelAttributes;
tags.scaleX = data.scaleX ?? 2;
tags.scaleY = data.scaleY ?? 2;
tags.scaleZ = data.scaleZ ?? 1;
tags.modelLocked = data.modelLocked;
tags.formAddress = data.formAddress;
tags.form = data.form;
tags.formSubtype = data.formSubtype;
tags.modelName = data.modelName;
tags.modelStates = data.modelStates;
tags.modelListeners = data.modelListeners;

const listeners = {...data.modelListeners};
for (const listener in listeners) {
    tags[listener] = listeners[listener].code;
}

const stats = {...data.modelAttributes};
for (const stat in stats) {
    tags[stat] = stats[stat].start;
}

const states = {...data.modelStates};
for (const state in states) {
    tags[state] = states[state].start;
}

if (!data.modelAttributes) {
    tags.modelAttributes = {};
}

if (!data.modelStates) {
    tags.modelStates = {};
}

if (!data.modelListeners) {
    tags.modelListeners = {};
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