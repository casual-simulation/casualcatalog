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

    //setup user catalog
    const userAbArtifactShard = {
        data: {
            studioId: authBot.id,
            label: 'user studio catalog',
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
    });
}