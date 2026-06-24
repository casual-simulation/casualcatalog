//save

const startingPage = getBot(byTag("simEditor", true), not(byTag("prevPage")));
const anyPage = getBot(byTag("simEditor", true));

//create place with starting page
const abArtifactShard = {
    data: {
        placeAsk: tags.simID + '_' + (tags.startingPage ?? startingPage?.tags.pageID ?? anyPage?.tags.pageID),
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