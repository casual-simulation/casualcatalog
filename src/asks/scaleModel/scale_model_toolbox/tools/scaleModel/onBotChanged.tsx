for (const listener of tags.modelListeners) {
    if (listener.type == 'stat') {
        const stat = listener.stat;
        if (that.tags.includes(stat)) {
            shout("on" + stat + "Changed");
        }
    }
}

for (const state of tags.modelStates) {
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

for (const stat of tags.modelAttributes) {
    if (that.tags.includes(stat.name)) {
        if (tags.statsButton) {
            //thisBot.onClick();
            const menuBot = getBot(byTag(configBot.tags.menuPortal, true), byTag("stat", stat.name));
            if (menuBot) {
                menuBot.tags.label = stat.name + ": " + tags[stat.name];
            }
        }
    }
}