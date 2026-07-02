if (!that) {
    return;
}

if (tags.queuedActions?.find(action => action.id == that)) {
    tags.queuedActions?.splice(tags.queuedActions.findIndex(action => action.id == that), 1);
}

if (!tags.completedActions?.includes(that)) {
    tags.completedActions?.push(that);
}

if (configBot.tags.staticInst || configBot.tags.tempInst) {
    shout("onRemoteData", {
        name: "onActionCompleted",
        that: that,
        remoteId: getID(configBot)
    });
} else {
    const remotes = await os.remotes();
    await sendRemoteData(remotes, "onActionCompleted", that);
}

const simBot = getBot("simID", that);
if (simBot) {
    if (simBot.tags.actionStory) {
        ab.log({message: simBot.tags.actionStory, space: "shared", name: "sim"});
    } else {
        ab.log({message: "completed: " + simBot.tags.label, space: "shared", name: "sim"});
    }
}

shout("clearActionMenu");

if (thisBot.vars.timeout) {
    clearTimeout(thisBot.vars.timeout);
}
thisBot.vars.timeout = setTimeout(() => {
    thisBot.showActionMenu();
    thisBot.vars.timeout = null;
}, 250);