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

const homeEgg = getBot(byTag("eggConfigurator", true), byTag('chosenEggName', 'home'));

if (!homeEgg) {

    const username = await ab.links.console.getUserName({ canSetPreferredName: false });

    //setup user catalog
    const userAbArtifactShard = {
        data: {
            studioId: configBot.tags.studio ?? authBot.id,
            label: 'home',
            eggName: 'home',
            eggConfigConfirmed: true,
            isAvatarEquipment: true,
            eggParameters: {
                toolboxBot: null,
                gridInformation: {
                    dimension: 'home',
                    position: {
                        x: 0,
                        y: 0
                    }
                }
            }
        },
        dependencies: [
            {
                askID: 'eggConfigurator'
            }
        ]
    };
    await links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'eggConfigurator',
        abArtifactInstanceID: uuid(),
        abArtifactShard: userAbArtifactShard
    });
}