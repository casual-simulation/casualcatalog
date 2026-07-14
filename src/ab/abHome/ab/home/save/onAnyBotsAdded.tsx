if (!tags.listeningForChanges) {
    return;
}

let changesRequired = false;
const studio = configBot.tags.studio ?? authBot.id;
for (const newBot of that.bots) {
    if (newBot.tags.worldLayer && newBot.tags.worldLayer == studio) {
        changesRequired = true;
        break;
    }
}

if (!changesRequired) {
    return;
}

if (thisBot.vars.watcher) {
    clearWatchBot(thisBot.vars.watcher);
}

let watcher = watchBot(getBots("worldLayer", studio), (bot, changedTags) => {
    if (!bot) return; // Bot was destroyed
    setTagMask(thisBot, "newChanges", true, "shared");
});

thisBot.vars.watcher = watcher;

setTagMask(thisBot, "newChanges", true, "shared");