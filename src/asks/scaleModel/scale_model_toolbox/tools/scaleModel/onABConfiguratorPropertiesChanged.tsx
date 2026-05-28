const { propertyValues } = that;

if ('scaleModelName' in propertyValues) {
    tags.modelName = propertyValues.scaleModelName;
    tags.label = propertyValues.scaleModelName;
}

if ('scaleModelStats' in propertyValues) {
    const attrs = [...tags.modelAttributes];
    for (const attr of attrs) {
        tags[attr] = null;
    }

    tags.modelAttributes = propertyValues.scaleModelStats;
}

if ('scaleModelStates' in propertyValues) {
    const states = [...tags.modelStates];
    for (const state of states) {
        tags[state] = null;
    }

    tags.modelStates = propertyValues.scaleModelStates;
}

if ('scaleModelListeners' in propertyValues) {
    const listeners = [...tags.modelListeners];
    for (const listener of listeners) {
        tags[listener] = null;
    }

    tags.modelListeners = propertyValues.scaleModelListeners;
}