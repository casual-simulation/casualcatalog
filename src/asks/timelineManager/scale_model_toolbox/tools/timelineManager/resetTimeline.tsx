tags.timelinePaused = true;
tags.currentStep = 0;

const models = getBots("scaleModel", true);
for (let i = 0; i < models.length; ++i) {
    const states = {...models[i].tags.modelStates};
    for (const state in states) {
        changeState(models[i], states[state].start, state)
    }

    const stats = {...models[i].tags.modelAttributes};
    for (const stat in stats) {
        models[i].tags[stat] = stats[stat].start;
    }
}