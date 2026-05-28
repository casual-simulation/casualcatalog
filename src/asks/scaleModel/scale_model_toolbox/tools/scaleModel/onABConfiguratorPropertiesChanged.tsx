const { propertyValues } = that;

if ('scaleModelName' in propertyValues) {
    tags.modelName = propertyValues.scaleModelName;
    tags.label = propertyValues.scaleModelName;
}

if ('scaleModelStats' in propertyValues) {
    if (!tags.modelAttributes) {
        tags.modelAttributes = [];
    }
    const attrs = [...tags.modelAttributes];
    for (const attr of attrs) {
        tags[attr] = null;
    }

    tags.modelAttributes = propertyValues.scaleModelStats;
}

if ('scaleModelStates' in propertyValues) {
    if (!tags.modelStates) {
        tags.modelStates = [];
    }
    const states = [...tags.modelStates];
    for (const state of states) {
        tags[state] = null;
    }

    tags.modelStates = propertyValues.scaleModelStates;
}

if ('scaleModelListeners' in propertyValues) {
    if (!tags.modelListeners) {
        tags.modelListeners = [];
    }
    const listeners = [...tags.modelListeners];
    for (const listener of listeners) {
        tags[listener] = null;
    }

    tags.modelListeners = propertyValues.scaleModelListeners;
}