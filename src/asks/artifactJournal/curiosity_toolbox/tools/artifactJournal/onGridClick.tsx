shout("clearRoTJournalMenu");
if (tags.currentRegisteredApp) {
    os.unregisterApp(tags.currentRegisteredApp);
    tags.currentRegisteredApp = null;
}

const avatarBot = getBot(byTag("simAvatar", true), byTag("remoteID", configBot.tags.id));
if (!avatarBot) {
    thisBot.spawnPlayer();
}

