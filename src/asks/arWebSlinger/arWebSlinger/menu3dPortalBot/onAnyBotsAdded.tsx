if (!masks.initialized) {
    return;
}

if (!configBot) {
    return;
}

const menuPortal = configBot.tags.menuPortal;

if (menuPortal) {
    // Add bots that are in the current menu portal to the web slinger's 3d menu.
    let needRefreshPortal = false;

    for (let i = 0; i < that.bots.length; i++) {
        const bot = that.bots[i];

        if (bot) {
            if (bot.tags[menuPortal] == true) {
                needRefreshPortal = true;
                break;
            }
        }
    }

    if (needRefreshPortal) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] going to refresh menu 3d portal because new bots were added to the menu portal.`);
        }
        
        thisBot.refreshPortal();
    }
}
