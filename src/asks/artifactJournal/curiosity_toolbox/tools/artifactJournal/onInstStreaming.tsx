const avatarBot = getBot(byTag("mapAvatar", true), byTag("remoteID", configBot.tags.id));
if (avatarBot) {
    destroy(avatarBot);
}

thisBot.spawnPlayer();