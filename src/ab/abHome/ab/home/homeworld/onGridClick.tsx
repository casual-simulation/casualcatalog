if (tags.introPlayed) {
    return;
}

const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));
if (avatarBot) {
    avatarBot.onClick();
}