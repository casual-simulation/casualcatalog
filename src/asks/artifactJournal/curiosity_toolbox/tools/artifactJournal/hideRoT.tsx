const rotBots = getBots(byTag("rotBot", true));

for (let i = 0; i < rotBots.length; ++i) {
    rotBots[i].tags.home = false;
}

const hudBot = getBot("name", "hudMenu");
if (hudBot) {
    hudBot.closeApp();
}

tags.rotShown = false;

const avatarBot = getBot(byTag("simAvatar", true), byTag("remoteID", configBot.tags.id));
if (avatarBot) {
    destroy(avatarBot);
}