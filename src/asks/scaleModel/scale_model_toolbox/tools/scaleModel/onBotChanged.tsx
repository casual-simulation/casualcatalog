for (const listener in tags.modelListeners) {
    if (tags.modelListeners[listener].type == 'stat') {
        const stat = tags.modelListeners[listener].stat;
        if (that.tags.includes(stat)) {
            shout("on" + stat + "Changed");
        }
    }
}

for (const state in tags.modelStates) {
    if (that.tags.includes(tags.modelStates[state])) {
        if (tags.statsButton) {
            //thisBot.onClick();
            const menuBot = getBot(byTag(configBot.tags.menuPortal, true), byTag("state", tags.modelStates[state]));
            if (menuBot) {
                menuBot.tags.label = tags.modelStates[state] + ": " + tags[tags.modelStates[state]];
            }
        }
    }
}

for (const stat in tags.modelAttributes) {
    if (that.tags.includes(tags.modelAttributes[stat].name)) {
        if (tags.statsButton) {
            //thisBot.onClick();
            const menuBot = getBot(byTag(configBot.tags.menuPortal, true), byTag("stat", tags.modelAttributes[stat].name));
            if (menuBot) {
                menuBot.tags.label = tags.modelAttributes[stat].name + ": " + tags[tags.modelAttributes[stat].name];
            }
        }
    }
}