//set color

//add grid

//add back button

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
        abArtifactName: 'mapAvatar',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });
}

const catalog = getBot(byTag("studioCatalog", true), byTag("studioId", authBot?.id));

if (!catalog) {
    //add catalog
    const userAbArtifactShard = {
        data: {
            studioId: authBot.id,
            label: 'user studio catalog',
            autoLoadCasualKit: true,
            eggParameters: {
                toolboxBot: null,
                gridInformation: {
                    dimension: 'home',
                    position: {
                        x: 2,
                        y: 2
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
        space: 'local',
    });
}