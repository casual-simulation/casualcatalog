const geoLoc = await os.getGeolocation();

if (geoLoc.success) {
    const connectedBots = getBots(byTag("studioStationID", tags.studioId));
    for (let i = 0; i < connectedBots.length; ++i) {
        const positionOffsetX = connectedBots[i].tags.homeX - tags.homeX;
        const positionOffsetY = connectedBots[i].tags.homeY - tags.homeY;

        connectedBots[i].tags.homeX = geoLoc.longitude + positionOffsetX;
        connectedBots[i].tags.homeY = geoLoc.latitude + positionOffsetY;
    }

    tags.homeX = geoLoc.longitude;
    tags.homeY = geoLoc.latitude;
} else {
    os.toast("Could not get current user location");
}