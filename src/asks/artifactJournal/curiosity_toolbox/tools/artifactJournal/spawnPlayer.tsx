const avatarBot = getBot(byTag("mapAvatar", true), byTag("remoteID", configBot.tags.id));

if (!avatarBot) {
    const abArtifactShard = {
        data: {
            eggParameters: {
                gridInformation: {
                    dimension: 'home',
                    position: {
                        x: -85.67523722726739,
                        y: 42.96666666666667
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
    }
}
