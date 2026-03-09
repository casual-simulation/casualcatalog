let playerBot= getBot(byTag("playerID"))
let hudBot= getBot(byTag("name","hudBot"))
playerBot.tags.map="true"
let museumBots= getBots(byTag("abIDOrigin","MuseumStructure"))
os.unregisterApp("museumApp");
os.unregisterApp("backApp");
hudBot.openApp()
configBot.tags.miniMapPortal = null
configBot.tags.mapPortal = "map"
configBot.tags.gridPortal = null
destroy(museumBots)
thisBot.closeApp()