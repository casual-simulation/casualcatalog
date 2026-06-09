if (!ab.abIsPrimary()) {
    return;
}
const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));
if (avatarBot) {
    avatarBot.links.homeworld?.toggleGPS(false);
    avatarBot.onPlaceClicked(that)
}
if (!avatarBot.links.homeworld.tags.introPlayed) {
    avatarBot.links.homeworld.masks.introPlayed = true;
}