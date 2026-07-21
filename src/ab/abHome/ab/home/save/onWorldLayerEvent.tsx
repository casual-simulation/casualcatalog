if (!tags.listeningForChanges) {
    return;
}

const studio = configBot.tags.studio ?? authBot.id;

if (thisBot.vars.watcher) {
    clearWatchBot(thisBot.vars.watcher);
}

let watcher = watchBot(getBots("worldLayer", studio), (bot, changedTags) => {
    if (!bot) return; // Bot was destroyed
    setTagMask(thisBot, "newChanges", true, "shared");
});

thisBot.vars.watcher = watcher;

setTagMask(thisBot, "newChanges", true, "shared");