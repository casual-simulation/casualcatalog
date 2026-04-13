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
    if (tags[item]) {
        val = tags[item];
    }
    struc.stats[item] = val;
}

for (const item in tags.modelStates) {
    let val = tags.modelStates[item].start;
    if (tags[item]) {
        val = tags[item];
    }
    struc.states[item] = val;
}

for (const item in tags.modelListeners) {
    let val = raw[item];
    struc.listeners[item] = val;
}

return struc;