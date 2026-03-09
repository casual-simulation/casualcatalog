let playerBot= getBot(byTag("playerID"))
playerBot.tags.map="false"
links.search.onLookupAskID({
    askID: "MuseumStructure",
    sourceEvent: 'tool',
    eggParameters: {
    },
});
configBot.tags.mapPortal = null
miniMapPortalBot.tags.mapPortalBasemap="topo-vector"
configBot.tags.miniMapPortal = "map"
configBot.tags.gridPortal = "home"

thisBot.closeApp()