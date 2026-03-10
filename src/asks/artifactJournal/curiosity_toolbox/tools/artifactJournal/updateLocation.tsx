// only runs this if the user is re-iniatalizing location access
if (!tags.continueLocationPull) {
    shout("onAwaitingLocation")
    // attempts to find geoLocation
    let loc = await os.getGeolocation()
    let locationBot = getBot("#name", "locationRequest")
    locationBot.closeApp()
}
// grabs location without changing GUI
let loc = await os.getGeolocation()
if (loc.success) {
    // find map dimension
    const mapDimension = configBot.tags.mapPortal ?? "map"
    // sets virutal location to physical one
    const yLoc = loc.latitude;
    const xLoc = loc.longitude;

    // moves bot to new locattion
    const playerBot = getBot(byTag("simAvatar", true), byTag("remoteID", getID(configBot)))
    if (playerBot) {
        whisper(playerBot, "onGridClick", {
            dimension: mapDimension,
            position: {
                x: xLoc,
                y: yLoc
            } 
        })
        await os.focusOn(playerBot, {
            portal: mapDimension,
            duration: 0.5,
            easing: {
                type: "quadratic",
                mode: "inout"
            }
        })
    }
    
    tags.continueLocationPull = true
    // continues the locationLoop
    thisBot.locationLoop()
}
else {
    // ends the location loop and allows gridclick moving
    os.toast("Could Not Find Location...Make sure location Permissions are enabled")
    shout("onLocationLost")
    tags.continueLocationPull = false
}