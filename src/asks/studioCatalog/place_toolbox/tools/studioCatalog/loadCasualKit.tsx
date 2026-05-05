const dimension = tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
const isMap = configBot.tags.mapPortal ? true : false;
const inRad = isMap ? .001 : 3;
const rad = isMap ? .002 : 5;
const pos = ab.links.utils.findOpenPositionAround({center: new Vector2(tags[dimension + 'X'], tags[dimension + 'Y']), dimension: dimension, innerRadius: 3, radius: 5})

await ab.links.search.onLookupAskID({
    askID: 'casual_kit_loader',
    eggParameters: {
        studioId: tags.studioId,
        gridInformation: {
            toolbox_name: 'casual kit',
            dimension: dimension,
            position: {
                x: pos.x,
                y: pos.y
            }
        }
    }
})

