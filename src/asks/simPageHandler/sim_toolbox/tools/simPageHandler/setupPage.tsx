//spawn back place
const abArtifactShard = {
    data: {
        placeAsk: tags.prevPage,
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
links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: "placePortal",
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});

//spawn next place
const abArtifactShard = {
    data: {
        placeAsk: tags.nextPage,
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
links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: "placePortal",
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});

//showActions
thisBot.onABInitialized();