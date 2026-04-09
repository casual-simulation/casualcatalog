const avatarBot = getBot(byTag("mapAvatar", true), byTag("remoteID", configBot.tags.id));

if (!avatarBot) {
    const abArtifactShard = {
        data: {
            eggParameters: {
                gridInformation: {
                    dimension: 'home',
                    position: {
                        x: -85.6733605741107,
                        y: 42.965495495495496
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
    const avatar = await ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'mapAvatar',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });

    tags.avatar = getLink(avatar);
    if (tags.continueLocationPull) {
        await os.sleep(500);
        avatar.useGPS(true);
        shout('clearLandmarkMenu');
    }
}
