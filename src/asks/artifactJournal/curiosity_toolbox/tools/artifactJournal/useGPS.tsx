const avatarBot = getBot(byTag("mapAvatar", true), byTag("remoteID", configBot.tags.id));

if (that) {
    tags.usingGPS = true;

    if (!avatarBot) {
        thisBot.spawnPlayer();
    } else {
        avatarBot.toggleLocationPull(true);
    }
} else {
    tags.usingGPS = true;
    if (avatarBot) {
        avatarBot.toggleLocationPull(false);
    }
}