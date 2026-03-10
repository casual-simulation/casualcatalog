if (!that) {
    return;
}

const simXPBot = getBot(byTag("xp", true), byTag("xpType", "sim"), byTag("simUser", authBot.id));

if (!simXPBot) {
    return;
}


if (simXPBot?.tags?.queuedActions?.find(action => action.id == that)) {
    simXPBot?.tags?.queuedActions?.splice(simXPBot?.tags?.queuedActions.findIndex(action => action.id == that), 1);
}

console.log("removing", that);

shout("clearActionMenu");

if (thisBot.vars.timeout) {
    clearTimeout(thisBot.vars.timeout);
}
thisBot.vars.timeout = setTimeout(() => {
    thisBot.showActionMenu();
    thisBot.vars.timeout = null;
}, 250);