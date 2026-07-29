if (!ab.abIsPrimary()) {
    return;
}

if (ab.links.manifestation.links.abBot) {
    ab.links.navigation?.toggleGPS(false);
    ab.links.manifestation.onPlaceClicked(that)
}
if (!ab.links.homeworld.tags.introPlayed) {
    ab.links.homeworld.masks.introPlayed = true;
}