const struc = {
    stats: {

    },
    states: {

    },
    listeners: {

    }
};

for (const item in tags.modelAttributes) {
    let val = tags.modelAttributes[item].start;
    let name = tags.modelAttributes[item].name;

    if (tags[name]) {
        val = tags[name];
    }
    struc.stats[name] = val;
}

for (const item in tags.modelStates) {
    let val = tags.modelStates[item].start;
    let name = tags.modelStates[item].name;

    if (tags[name]) {
        val = tags[name];
    }
    struc.states[name] = val;
}

for (const item in tags.modelListeners) {
    let name = tags.modelListeners[item].name;

    let val = raw[name];
    struc.listeners[name] = val;
}

return struc;