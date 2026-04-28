tags.timelinePaused = true;

if (thisBot.vars.interval) {
    clearInterval(thisBot.vars.interval);
}

tags.color = tags.prevColor;
tags.currentStep = 0;

shout("setDelta", 0);

const spawnedModels = getBots(byTag("scaleModel", true), byTag("isSpawned", true));
destroy(spawnedModels);

await os.sleep(0);

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