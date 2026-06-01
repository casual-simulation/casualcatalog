const avatarBot = getBot(byTag("mapAvatar", true), byTag("remoteID", configBot.tags.id));

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

    const abArtifactShard = {
        data: {
            eggParameters: {
                disableGPS: !tags.usingGPS,
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
        abArtifactName: 'mapAvatar',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });
}
