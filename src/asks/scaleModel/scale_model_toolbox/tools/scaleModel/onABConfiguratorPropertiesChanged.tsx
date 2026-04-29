const { propertyValues } = that;

if ('scaleModelName' in propertyValues) {
    tags.modelName = propertyValues.scaleModelName;
}

if ('scaleModelStats' in propertyValues) {
    const attrs = {...tags.modelAttributes};
    for (const attr in attrs) {
        tags[attr] = null;
    }

    tags.modelAttributes = propertyValues.scaleModelStats;
}

if ('scaleModelStates' in propertyValues) {
    const states = {...tags.modelStates};
    for (const state in states) {
        tags[state] = null;
    }

    tags.modelStates = propertyValues.scaleModelStates;
}

if ('scaleModelListeners' in propertyValues) {
    const listeners = {...tags.modelListeners};
    for (const listener in listeners) {
        tags[listener] = null;
    }

    tags.modelListeners = propertyValues.scaleModelListeners;
}