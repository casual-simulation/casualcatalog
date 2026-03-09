if (configBot.tags.menuPortal === 'rcCupMenu') {
    configBot.tags.menuPortal = null;
}

const cupMenuBots = getBots(b => b.tags.rcCupMenu != null);
destroy(cupMenuBots);