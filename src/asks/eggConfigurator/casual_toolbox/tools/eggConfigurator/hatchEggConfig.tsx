const dimension = that.dimension ?? tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
const isMap = configBot.tags.mapPortal ? true : false;

let gridInfo;

const inRad = isMap ? .0001 : 3;
const rad = isMap ? .0005 : 5;
const space = isMap ? .0005 : 1;

const pos = ab.links.utils.findOpenPositionAround({center: new Vector2(tags[dimension + 'X'], tags[dimension + 'Y']), dimension: dimension, innerRadius: inRad, radius: rad, spacing: space})

gridInfo = {    
    "dimension": dimension,
    "position":
        {
            "x": that.x ?? pos.x,
            "y": that.y ?? pos.y
        }
}

const abArtifactShard = {
    data: {
        patternSetting: tags.chosenEggName,
        studioSetting: tags.chosenStudio ?? tags.studioId,
        originType: 'eggConfigurator',
        studioId: tags.studioId,
        abAwakeSetting: true,
        labelSetting: tags.chosenEggName + " v" + (tags.chosenVersionNumber ?? tags.maxEggVersion),
        label: tags.chosenEggName + " v" + (tags.chosenVersionNumber ?? tags.maxEggVersion),
        urlVariables: {
            version: tags.chosenVersionNumber == tags.maxEggVersion ? null : tags.chosenVersionNumber
        },
        eggParameters: {
            gridInformation: gridInfo
        }
    },
    dependencies: [
        {
            askID: 'instBot'
        }
    ]
};
ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: 'instBot',
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});