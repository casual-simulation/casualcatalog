if (!that) {
    return;
}

if (tags.queuedActions?.find(action => action.id == that)) {
    tags.queuedActions?.splice(tags.queuedActions.findIndex(action => action.id == that), 1);
}

shout("clearActionMenu");

if (thisBot.vars.timeout) {
    clearTimeout(thisBot.vars.timeout);
}
thisBot.vars.timeout = setTimeout(() => {
    thisBot.showActionMenu();
    thisBot.vars.timeout = null;
}, 250);