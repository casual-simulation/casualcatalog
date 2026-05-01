//check authbot
if (!authBot) {
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    return;
}

// setTagMask(thisBot, "awaitFullReconstitution", true, "shared");

if (tags.homeLoaded) {
    return;
}

tags.homeLoaded = true;

// console.log("[ab.home.world]: reconstitution rest", tags.awaitFullReconstitution)
// if (tags.awaitFullReconstitution != true) {
//     return;
// }

// setTagMask(thisBot, "awaitFullReconstitution", null, "shared");

//setup user studio
const homeBot = getBot(byTag("studioCatalog", true), byTag('respawnPoint', true));

if (!homeBot) {

    let hasGeolocationPermission = await links.utils.hasGeolocationPermission();
    let positionX;
    let positionY;

    // Current work-around for allowing geolocation for iOS app
    if (getBot("system", "ab.iosbridge.messenger")) {
        hasGeolocationPermission = true;
    }

    if (hasGeolocationPermission) {
        const geolocation = await os.getGeolocation();
        if (geolocation.success) {
            positionX = geolocation.longitude - .001;
            positionY = geolocation.latitude;
        }
    } else {
        positionX = -85.6753464267489;
        positionY = 42.96621621621622;
    }


    //setup hub
    const userAbArtifactShard = {
        data: {
            studioId: authBot.id,
            label: 'user catalog',
            respawnPoint: true,
            eggParameters: {
                toolboxBot: getLink(thisBot),
                gridInformation: {
                    dimension: 'home',
                    position: {
                        x: positionX,
                        y: positionY
                    }
                }
            }
        },
        dependencies: [
            {
                askID: 'studioCatalog'
            }
        ]
    };
    await ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'studioCatalog',
        abArtifactInstanceID: uuid(),
        abArtifactShard: userAbArtifactShard,
    });
}