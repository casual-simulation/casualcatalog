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
const userStudioBot = getBot(byTag("studioStation", true), byTag('studioId', authBot.id));

if (!userStudioBot) {
    const userHomeWorldMetaData = await os.getData(authBot.id, 'homeworldMetaData');
    let positionX;
    let positionY;
    if (!userHomeWorldMetaData.success) {
        let hasGeolocationPermission = await links.utils.hasGeolocationPermission();

        // Current work-around for allowing geolocation for iOS app
        if (getBot("system", "ab.iosbridge.messenger")) {
            hasGeolocationPermission = true;
        }

        if (hasGeolocationPermission) {
            const geolocation = await os.getGeolocation();
            if (geolocation.success) {
                positionX = geolocation.longitude;
                positionY = geolocation.latitude;
            }
        } else {
            positionX = -85.6761894822434;
            positionY = 42.9656756756756;
        }

    } else {
        positionX = userHomeWorldMetaData?.data?.position?.x;
        positionY = userHomeWorldMetaData?.data?.position?.y;
    }

    //setup hub
    const userAbArtifactShard = {
        data: {
            studioId: authBot.id,
            label: 'home studio',
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
                askID: 'studioStation'
            }
        ]
    };
    await ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'studioStation',
        abArtifactInstanceID: uuid(),
        abArtifactShard: userAbArtifactShard,
    });
}

//get all subscribed to studios
const result = await os.listUserStudios();

if (result.success) {
     console.log(result.studios);
} else {
     os.toast('Failed to get studios ' + result.errorMessage);
     return;
}

//for each
const studios = result.studios;
for (let i = 0; i < studios.length; ++i) {

    //make sure its not already placed
    const studioBot = getBot(byTag("studioStation", true), byTag('studioId', studios[i].studioId));
    if (!studioBot) {
        //get meta data
        const homeWorldMetaData = await os.getData(studios[i].studioId, 'homeworldMetaData');
        if (!homeWorldMetaData.success) {
            continue;
        }

        //setup hub
        const abArtifactShard = {
            data: {
                studioId: studios[i].studioId,
                label: studios[i].displayName,
                eggParameters: {
                    toolboxBot: getLink(thisBot),
                    gridInformation: {
                        dimension: 'home',
                        position: {
                            x: homeWorldMetaData?.data?.position?.x,
                            y: homeWorldMetaData?.data?.position?.y
                        }
                    }
                }
            },
            dependencies: [
                {
                    askID: 'studioStation'
                }
            ]
        };
        ab.links.artifact.abCreateArtifactPromiseBot({
            abArtifactName: 'studioStation',
            abArtifactInstanceID: uuid(),
            abArtifactShard,
        });
    }

    //update all shared eggs
    //update all shared insts
}