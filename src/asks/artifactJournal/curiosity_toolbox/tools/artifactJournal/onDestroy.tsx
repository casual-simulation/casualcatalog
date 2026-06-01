const rotBots = getBots(byTag("rotBot", true));

const menuBots = getBots(byTag("rotMenuBot", true));

destroy(menuBots);
destroy(rotBots);