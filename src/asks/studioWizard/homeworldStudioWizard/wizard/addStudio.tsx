const studioData = that;

//get meta data
const homeWorldMetaData = await os.getData(studioData?.studioId, 'homeworldMetaData');
let positionX;
let positionY;
if (!homeWorldMetaData.success) {
    positionX = tags.homeX;
    positionY = tags.homeY;
} else {
    positionX = homeWorldMetaData?.data?.position?.x;
    positionY = homeWorldMetaData?.data?.position?.y;
}

//setup hub
const abArtifactShard = {
    data: {
        studioId: studioData?.studioId,
        label: studioData?.displayName,
        eggParameters: {
            toolboxBot: getLink(thisBot),
            gridInformation: {
                dimension: 'home',
                position: {
                    x: positionX,
                    y: positionY
                }
            }
        }
    },
    dependencies: [
        {
            askID: 'studioStation'
        }
    ]
};
await ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: 'studioStation',
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});

if (tags.destroyAfterUse == true) {
    destroy(thisBot);
}