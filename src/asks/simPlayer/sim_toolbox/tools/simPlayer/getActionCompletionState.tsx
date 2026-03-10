const actionSimID = that;

if (!authBot) {
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    os.toast("user not logged in.");
    return;
}

const simXPBot = getBot(byTag("xp", true), byTag("xpType", "sim"), byTag("simUser", authBot.id));

const foundAction = simXPBot.tags.completedActions.includes(that);

if (foundAction) {
    return true;
} else {
    return false;
}