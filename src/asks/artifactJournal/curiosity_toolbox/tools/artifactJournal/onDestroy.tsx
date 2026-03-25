const rotBots = getBots(byTag("rotBot", true));

const avatarBot = getBot(byTag("mapAvatar", true), byTag("remoteID", configBot.tags.id));
if (avatarBot) {
    destroy(avatarBot);
}

const menuBots = getBots(byTag("rotMenuBot", true));

destroy(menuBots);
destroy(rotBots);