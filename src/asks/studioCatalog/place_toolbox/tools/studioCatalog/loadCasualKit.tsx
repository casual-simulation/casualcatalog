const dimension = tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
const isMap = configBot.tags.mapPortal ? true : false;
const inRad = isMap ? .0001 : 3;
const rad = isMap ? .0005 : 5;
const space = isMap ? .0005 : 1;

const pos = ab.links.utils.findOpenPositionAround({center: new Vector2(tags[dimension + 'X'], tags[dimension + 'Y']), dimension: dimension, innerRadius: inRad, radius: rad, spacing: space})

await ab.links.search.onLookupAskID({
    askID: 'casual_kit_loader',
    eggParameters: {
        studioId: tags.studioId,
        toolbox_name: 'casual kit',
        gridInformation: {
            dimension: dimension,
            position: {
                x: pos.x,
                y: pos.y
            }
        }
    }
})

