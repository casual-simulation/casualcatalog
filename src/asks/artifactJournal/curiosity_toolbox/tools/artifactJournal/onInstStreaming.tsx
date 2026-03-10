const avatarBot = getBot(byTag("simAvatar", true), byTag("remoteID", configBot.tags.id));
if (avatarBot) {
    destroy(avatarBot);
}

thisBot.spawnPlayer();