if (!ab.abIsPrimary()) {
    return;
}

const location = await os.getGeolocation();
if (!location.success) {
    os.toast("Could not access current location.");
    return;
}
const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? 'home';
ab.links.manifestation.onPlaceClicked({
    dimension: dimension,
    x: location.longitude,
    y: location.latitude
})

if (!links.homeworld.tags.introPlayed) {
   links.homeworld.masks.introPlayed = true;
}