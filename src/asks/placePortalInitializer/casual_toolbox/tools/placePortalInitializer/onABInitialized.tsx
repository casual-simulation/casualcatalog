gridPortalBot.tags.portalColor = configBot.tags.portalColor ?? abPersonality.tags.abBaseColor ?? null;

//add avatar
const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));

if (!avatarBot) {
    //get user location if applicable
    let posX = 5;
    let posY = 5;

    const abArtifactShard = {
        data: {
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