// only runs this if the user is re-iniatalizing location access
if (!tags.continueLocationPull) {
    return;
}
// grabs location without changing GUI
let loc = await os.getGeolocation()
if (loc.success) {
    let locationBot = getBot("name", "locationRequest");
    if (tags.currentRegisteredApp == "locationApp") {
        locationBot.closeApp()
    }

    // find map dimension
    const mapDimension = configBot.tags.mapPortal ?? "map"
    const yLoc = loc.latitude;
    const xLoc = loc.longitude;

    // moves bot to new location
    const playerBot = getBot(byTag("mapAvatar", true), byTag("remoteID", getID(configBot)))
    if (playerBot) {
        whisper(playerBot, "moveAvatar", {
            dimension: mapDimension,
            position: {
                x: xLoc,
                y: yLoc
            }
        });
        os.focusOn(playerBot, {portal: 'map', zoom: 2000});
    }
    
    // continues the locationLoop
    thisBot.locationLoop()
}
else {
    // ends the location loop and allows gridclick moving
    os.toast("Could Not Find Location...Make sure location Permissions are enabled")
    shout("onLocationLost")
    tags.continueLocationPull = false
}