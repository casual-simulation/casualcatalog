const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));

if (!avatarBot) {
    //get user location if applicable
    let posX = -85.6733605741107;
    let posY = 42.965495495495496;

    if (tags.usingGPS) {
        let loc = await os.getGeolocation()
        if (loc.success) {
            posX = loc.latitude;
            posY = loc.longitude;
        }
    }

    const studio = configBot.tags.studio ?? authBot.id;

    if (!tags.homeRespawnX || !tags.homeRespawnY) {
        const respawnData = await os.getData(studio, "homeworldRespawnPoint");
        if (respawnData) {
            posX = respawnData.x;
            posY = respawnData.y;
            masks.homeRespawnX = posX;
            masks.homeRespawnY = posY;
        }
    } else {
        posX = tags.homeRespawnX;
        posY = tags.homeRespawnY;
    }

    const abArtifactShard = {
        data: {
            clickOnLoad: true,
            eggParameters: {
                gridInformation: {
                    dimension: 'home',
                    position: {
                        x: posX,
                        y: posY
                    }
                }
            }
        },
        dependencies: [
            {
                askID: 'mapAvatar'
            }
        ]
    };
    await ab.links.artifact.abCreateArtifactPromiseBot({
        space: 'tempShared',
        abArtifactName: 'mapAvatar',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });
}
