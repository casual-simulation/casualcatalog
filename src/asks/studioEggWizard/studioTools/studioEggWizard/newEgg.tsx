const abArtifactShard = {
    data: {
        eggStudio: tags.studioStationID ?? authBot.id,
        studioStationID: tags.studioStationID ?? authBot.id,
        eggParameters: {
            toolboxBot: tags.toolbox ?? null,
            gridInformation: tags.gridInformation
        }
    },
    dependencies: [
        {
            askID: 'eggConfigurator'
        }
    ]
};
ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: 'eggConfigurator',
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});

shout("abMenuRefresh");
if (tags.destroyAfterUse == true) {
    destroy(thisBot);
}