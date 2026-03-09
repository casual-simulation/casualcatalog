/*// only runs this if the user is re-iniatalizing location access
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
    const mapDimension = globalThis.mapDimension ?? "map"
    // sets virutal location to physical one
    const yLoc = loc.latitude;
    const xLoc = loc.longitude;

    // moves bot to new locattion
    whisper(thisBot, "moveTo", {
        dimension: mapDimension,
        x: xLoc,
        y: yLoc
    })

    await os.focusOn(thisBot, {
        portal: mapDimension,
        duration: tags.moveTime,
        easing: {
            type: "quadratic",
            mode: "inout"
        }
    })
    tags.continueLocationPull = true
    // continues the locationLoop
    thisBot.locationLoop()
}
else {
    // ends the location loop and allows gridclick moving
    os.toast("Could Not Find Location...Make sure location Permissions are enabled")
    shout("onLocationLost")
    tags.continueLocationPull = false
}*/