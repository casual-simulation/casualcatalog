const geoLoc = await os.getGeolocation();

if (geoLoc.success) {
    const connectedBots = getBots("lineTo", getID(thisBot));
    for (let i = 0; i < connectedBots.length; ++i) {
        const dimension = tags.dimension ?? 'home';
        const prevX = connectedBots[i].tags[dimension + 'X'];
        const prevY = connectedBots[i].tags[dimension + 'Y'];

        const offsetX = geoLoc.longitude - tags.homeX;
        const offsetY = geoLoc.latitude - tags.homeY;

        connectedBots[i].tags[dimension + 'X'] = prevX + offsetX;
        connectedBots[i].tags[dimension + 'Y'] = prevY + offsetY;
    }

    tags.homeX = geoLoc.longitude;
    tags.homeY = geoLoc.latitude;
    if (links.defaultVisualBot) {
        links.defaultVisualBot.tags.homeX = geoLoc.longitude;
        links.defaultVisualBot.tags.homeY = geoLoc.latitude;
    }

} else {
    os.toast("Could not get current user location");
}