if (!tags.listeningForChanges) {
    return;
}

if (!authBot) {
    return;
}

const studio = configBot.tags.studio ?? authBot?.id;

let watcher = watchBot(getBots("worldLayer", studio), (bot, changedTags) => {
    if (!bot) return; // Bot was destroyed
    setTagMask(thisBot, "newChanges", true, "shared");
});

thisBot.vars.watcher = watcher;