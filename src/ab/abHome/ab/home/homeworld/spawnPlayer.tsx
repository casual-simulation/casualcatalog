
//get user location if applicable
let posX = -85.6733605741107;
let posY = 42.965495495495496;

if (ab.links.navigation.tags.usingGPS) {
    let loc = await os.getGeolocation()
    if (loc.success) {
        posX = loc.latitude;
        posY = loc.longitude;
    }
}

if (!tags.homeRespawnX || !tags.homeRespawnY) {
    const respawnData = await os.getData(studio, "homeworldRespawnPoint");
    if (respawnData.success) {
        posX = respawnData.data.x;
        posY = respawnData.data.y;
        masks.homeRespawnX = posX;
        masks.homeRespawnY = posY;
    }
} else {
    posX = tags.homeRespawnX;
    posY = tags.homeRespawnY;
}

const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
if (ab.links.manifestation.links.abBot) {
    ab.links.manifestation.links.abBot.tags[dimension + 'X'] = posX;
    ab.links.manifestation.links.abBot.tags[dimension + 'Y'] = posY;
}