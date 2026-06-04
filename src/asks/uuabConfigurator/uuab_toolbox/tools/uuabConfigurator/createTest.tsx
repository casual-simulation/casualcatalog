if (!tags.chosenUUABName || !tags.chosenBIOS) {
    return;
}

const dimension = that?.dimension ?? tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
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
            "x": that?.x ?? pos.x,
            "y": that?.y ?? pos.y
        }
}

const abArtifactShard = {
    data: {
        patternSetting: null,
        studioSetting: null,
        originType: 'uuabConfigurator',
        abAwakeSetting: null,
        labelSetting: tags.chosenUUABName,
        label: tags.chosenUUABName,
        instSetting: 'uuab-redirect',
        biosSetting: 'local',
        studioId: tags.studioId,
        completeOnLoad: true,
        urlVariables: [{
            variable: 'uuab',
            value: tags.chosenUUABName
        },
        {
            variable: 'auxlink',
            value: 'uuab'
        }],
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