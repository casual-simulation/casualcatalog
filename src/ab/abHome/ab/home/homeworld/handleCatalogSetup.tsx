if (!links.learn.abIsPrimary()) {
    return;
}

//check authbot
if (!authBot) {
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    return;
}

const homeBot = getBot(byTag("studioCatalog", true), byTag('respawnPoint'));

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

    console.log("creating user catalog");

    const username = await ab.links.console.getUserName({ canSetPreferredName: false });

    //setup user catalog
    const userAbArtifactShard = {
        data: {
            studioId: authBot.id,
            label: username ? username + "'s catalog" : 'user studio catalog',
            respawnPoint: true,
            autoLoadCasualKit: true,
            eggParameters: {
                toolboxBot: null,
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
    await links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'studioCatalog',
        abArtifactInstanceID: uuid(),
        abArtifactShard: userAbArtifactShard,
        space: 'local',
    });
}