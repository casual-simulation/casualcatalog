//spawn back place
const abArtifactShard = {
    data: {
        label: tags.prevPage,
        placeAsk: tags.simID + '_' + tags.prevPage,
        instSetting: tags.prevPage,
        generateURLOnLoad: true,
        eggParameters: {
            gridInformation: {
                dimension: 'home',
                position: {
                    x: -10,
                    y: 10
                }
            }
        }
    },
    dependencies: [
        {
            askID: 'placePortal'
        }
    ]
};
ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: "placePortal",
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});

//spawn next place
const abArtifactShard2 = {
    data: {
        label: tags.nextPage,
        placeAsk: tags.simID + '_' + tags.nextPage,
        instSetting: tags.nextPage,
        generateURLOnLoad: true,
        eggParameters: {
            gridInformation: {
                dimension: 'home',
                position: {
                    x: 10,
                    y: 10
                }
            }
        }
    },
    dependencies: [
        {
            askID: "placePortal"
        }
    ]
};
ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: "placePortal",
    abArtifactInstanceID: uuid(),
    abArtifactShard: abArtifactShard2,
});

//showActions
thisBot.onABInitialized();