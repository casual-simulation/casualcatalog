masks.menuOpen = null;

if (configBot.tags.menuPortal === 'ppgMenu') {
    configBot.tags.menuPortal = null;
}

const menuBots = getBots(b => b.tags.ppgMenu != null);
destroy(menuBots);