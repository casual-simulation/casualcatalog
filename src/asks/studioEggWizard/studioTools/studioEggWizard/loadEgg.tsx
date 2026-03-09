const abID = that;

const egg = await os.getData(tags.studioStationID ?? authBot.id, abID);
if (egg.success) {

    const abArtifactShard = {
        data: {
            eggName: abID,
            eggStudio: tags.studioStationID ?? authBot.id,
            eggSetupLabel: abID,
            eggConfigConfirmed: true,
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
} else {
    os.toast("could not find " + abID + " in studio.");
}