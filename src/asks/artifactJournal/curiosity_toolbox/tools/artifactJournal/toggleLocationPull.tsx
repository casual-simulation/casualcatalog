const locaRequestBot = getBot("name", "journalRequest");

if (!that) {
    tags.continueLocationPull = false;

    if (locaRequestBot) {
        locaRequestBot.openApp("awaitingLocationPermission");
    }
} else {
    tags.continueLocationPull = true;
    
    if (tags.currentRegisteredApp == "locationApp") {
        locaRequestBot.closeApp()
    }

    let loc = await os.getGeolocation()
    if (loc.success) {

        // find map dimension
        const mapDimension = configBot.tags.mapPortal ?? "map"
        const yLoc = loc.latitude;
        const xLoc = loc.longitude;

        // moves bot to new location
        const playerBot = getBot(byTag("mapAvatar", true), byTag("remoteID", getID(configBot)))
        if (playerBot) {
            whisper(playerBot, "onGPSStart", {
                dimension: mapDimension,
                position: {
                    x: xLoc,
                    y: yLoc
                }
            });
            os.focusOn(playerBot, {portal: 'map', zoom: 2000});
        }
    }

    await os.sleep(500);
    
    thisBot.updateLocation();
}