configBot.tags.mapPortal = "map";
configBot.tags.miniGridPortal = "sideLoad";
configBot.tags.gridPortal = null;

//let hudBot = getBot(byTag("name", "hudBot"));
//hudBot.openApp();
superShout("openMiniGrid");
let miniGridHudBot = getBot(byTag("name", "miniGridHudBot"));
thisBot.closeApp();
miniGridHudBot.openApp();