if (!ab.abIsPrimary()) {
    return;
}
const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));
if (avatarBot) {
    const location = await os.getGeolocation();
    if (!location.success) {
        os.toast("Could not access current location.");
        return;
    }
    const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? 'home';
    avatarBot.onPlaceClicked({
        dimension: dimension,
        x: location.longitude,
        y: location.latitude
    })
}
if (!avatarBot.links.homeworld.tags.introPlayed) {
    avatarBot.links.homeworld.masks.introPlayed = true;
}