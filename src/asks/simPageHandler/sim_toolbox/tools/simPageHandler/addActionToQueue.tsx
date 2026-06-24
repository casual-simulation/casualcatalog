if (!that) {
    return;
}

if (!tags.queuedActions?.find(action => action.id == that.id)) {
    tags.queuedActions?.push(that);
}

shout("clearActionMenu");

if (configBot.tags.staticInst) {
    shout("onRemoteData", {
        name: "onActionAddedToQueue",
        that: that.id,
        remoteId: getID(configBot)
    });
} else {
    const remotes = await os.remotes();
    await sendRemoteData(remotes, "onActionAddedToQueue", that.id);
}

if (thisBot.vars.timeout) {
    clearTimeout(thisBot.vars.timeout);
}
thisBot.vars.timeout = setTimeout(() => {
    thisBot.showActionMenu();
    thisBot.vars.timeout = null;
}, 250);