for (const listener in tags.modelListeners) {
    if (tags.modelListeners[listener].type == 'stat') {
        const stat = tags.modelListeners[listener].stat;
        if (that.tags.includes(stat)) {
            shout("on" + stat + "Changed");
        }
    }
}

for (const state in tags.modelStates) {
    if (that.tags.includes(state)) {
        if (tags.statsButton) {
            //thisBot.onClick();
            const menuBot = getBot(byTag(configBot.tags.menuPortal, true), byTag("state", state));
            if (menuBot) {
                menuBot.tags.label = state + ": " + tags[state];
            }
        }
    }
}

for (const stat in tags.modelAttributes) {
    if (that.tags.includes(stat)) {
        if (tags.statsButton) {
            //thisBot.onClick();
            const menuBot = getBot(byTag(configBot.tags.menuPortal, true), byTag("stat", stat));
            if (menuBot) {
                menuBot.tags.label = stat + ": " + tags[stat];
            }
        }
    }
}