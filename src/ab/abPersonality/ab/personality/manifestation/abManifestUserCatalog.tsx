if (!ab?.abIsPrimary() || tags.creatingUserCatalog) {
    return;
}

//check authbot
if (!authBot) {
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    return;
}

let userCatalog = getBot(byTag("studioCatalog", true), byTag("studioId", authBot.id));

if (!userCatalog) {
    masks.creatingUserCatalog = true;
    console.log("manifesting user catalog");

    const username = await ab.links.console.getUserName({ canSetPreferredName: false });

    //setup user catalog
    const userAbArtifactShard = {
        data: {
            studioId: authBot.id,
            label: username ? username + "'s catalog" : 'user studio catalog',
            autoLoadCasualKit: true,
            eggParameters: {
                toolboxBot: null,
                gridInformation: {
                    dimension: 'home',
                }
            }
        },
        dependencies: [
            {
                askID: 'studioCatalog'
            }
        ]
    };
    userCatalog = await ab.links.artifact.abCreateArtifactPromiseBot({
        space: 'local',
        abArtifactName: 'studioCatalog',
        abArtifactInstanceID: uuid(),
        abArtifactShard: userAbArtifactShard,
    });
    await os.sleep(0);

    masks.creatingUserCatalog = null;
    //ab.links.equipment.positionEquipment(links.abBot);
}