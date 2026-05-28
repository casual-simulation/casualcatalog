const struc = {
    stats: {

    },
    states: {

    },
    listeners: {

    }
};

for (const item of tags.modelAttributes) {
    let val = item.start;
    let name = item.name;

    if (tags[name]) {
        val = tags[name];
    }
    struc.stats[name] = val;
}

for (const item of tags.modelStates) {
    let val = item.start;
    let name = item.name;

    if (tags[name]) {
        val = tags[name];
    }
    struc.states[name] = val;
}

for (const item of tags.modelListeners) {
    let name = item.name;

    let val = raw[name];
    struc.listeners[name] = val;
}

return struc;