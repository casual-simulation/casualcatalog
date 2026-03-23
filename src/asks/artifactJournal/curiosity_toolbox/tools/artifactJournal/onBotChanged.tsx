if (that.tags.includes("continueLocationPull") && tags.continueLocationPull) {
    const avatarBot = getBot(byTag("simAvatar", true), byTag("remoteID", configBot.tags.id));
    if (avatarBot) {
        avatarBot.useGPS(true);
    }
} else if (that.tags.includes("continueLocationPull") && !tags.continueLocationPull) {
    const avatarBot = getBot(byTag("simAvatar", true), byTag("remoteID", configBot.tags.id));
    if (avatarBot) {
        avatarBot.useGPS(false);
    }
}