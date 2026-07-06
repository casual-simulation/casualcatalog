// only runs this if the user is re-iniatalizing location access
if (!links.homeworld?.tags.usingGPS) {
    return;
}
// grabs location without changing GUI
let loc = await os.getGeolocation()
if (loc.success) {

    shout("onGPSSuccess", thisBot);

    // find map dimension
    const mapDimension = configBot.tags.mapPortal ?? "map"
    const yLoc = loc.latitude;
    const xLoc = loc.longitude;

    // moves bot to new location
    
    const distance = Math.sqrt(Math.pow((xLoc - tags[mapDimension + 'X']), 2) + Math.pow((yLoc - tags[mapDimension + 'Y']), 2));
    if (distance > .0005) {
        clearAnimations(thisBot);
        tags[mapDimension + 'X'] = xLoc;
        tags[mapDimension + 'Y'] = yLoc;
    }
    else {
        thisBot.moveAvatar({
            dimension: mapDimension,
            position: {
                x: xLoc,
                y: yLoc
            }
        }); 
    }
    os.focusOn(thisBot, {portal: 'map', zoom: 2000, rotation: {x: 45, y: 45}});
    
    // continues the locationLoop
    thisBot.locationLoop()
}
else {
    // ends the location loop and allows gridclick moving
    os.toast("Could Not Find Location...Make sure location Permissions are enabled")
    shout("onLocationLost")
    links.homeworld?.toggleGPS(false);
}