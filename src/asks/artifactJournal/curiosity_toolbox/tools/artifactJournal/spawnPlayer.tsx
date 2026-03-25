const avatarBot = getBot(byTag("simAvatar", true), byTag("remoteID", configBot.tags.id));

if (!avatarBot) {
    const abArtifactShard = {
        data: {
            eggParameters: {
                gridInformation: {
                    dimension: 'home',
                    position: {
                        x: tags[tags.dimension + 'X'],
                        y: tags[tags.dimension + 'Y']
                    }
                }
            }
        },
        dependencies: [
            {
                askID: 'simAvatar'
            }
        ]
    };
    const avatar = await ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'simAvatar',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });

    tags.avatar = getLink(avatar);
    if (tags.continueLocationPull) {
        await os.sleep(500);
        avatar.useGPS(true);
    }
}
