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

gridPortalBot.tags.portalColor = configBot.tags.portalColor ?? abPersonality.tags.abBaseColor ?? null;

const grid = create({
    color: 'white',
    formAddress: 'https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/8980607d-1ff6-4361-8d88-cf7e921f2be7/adc1d4a69ca9039b0c3ee9ebfccbf2b58a735e52f6bc8adc93cded84f62844e2.xml',
    formOpacity: 0.1,
    formSubtype: 'gltf',
    form: 'mesh',
    home: true,
    homeX: 0.52,
    homeY: -0.57,
    homeZ: -0.01,
    pointable: false,
    scaleX: 32,
    scaleY: 32,
    scaleZ: 0.001,
    abIgnore: true
})