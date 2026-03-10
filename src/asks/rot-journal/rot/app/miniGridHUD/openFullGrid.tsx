configBot.tags.mapPortal = null;
configBot.tags.miniGridPortal = null;
configBot.tags.gridPortal = "home";

let gridHudBot = getBot(byTag("name", "gridHudBot"));
gridHudBot.openApp();
superShout("closeMiniGrid");
thisBot.closeApp();