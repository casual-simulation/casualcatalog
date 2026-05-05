const dimension = tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
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
            "x": pos.x,
            "y": pos.y
        }
}

ab.links.search.onLookupAskID({
    askID: "instCreatorWizard",
    sourceEvent: 'tool',
    eggParameters: {
        gridInformation: gridInfo,
        studioId: tags.studioId,
        initializationInfo: {
            pattern: tags.chosenEggName,
            studio: tags.chosenStudio,
            linkTo: thisBot.id,
            abAwake: true,
            label: tags.chosenEggName + " v" + (tags.chosenVersionNumber ?? tags.maxEggVersion),
            urlVariables: {
                version: tags.chosenVersionNumber == tags.maxEggVersion ? null : tags.chosenVersionNumber
            }
        }
    },
});