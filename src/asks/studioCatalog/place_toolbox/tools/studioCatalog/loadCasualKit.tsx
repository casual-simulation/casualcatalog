const dimension = tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
const pos = ab.links.shell.findOpenPositionAround({center: new Vector2(tags[dimension + 'X'], tags[dimension + 'Y']), dimension: dimension})

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