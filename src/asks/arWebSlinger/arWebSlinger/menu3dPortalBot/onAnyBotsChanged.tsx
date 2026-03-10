if (!masks.initialized) {
    return;
}

if (!configBot) {
    return;
}

const menuPortal = configBot.tags.menuPortal;

if (menuPortal) {
    let needRefreshPortal = false;

    for (let entry of that) {
        if (entry.tags.includes(menuPortal)) {
            needRefreshPortal = true;
            break;
        }
    }

    if (needRefreshPortal) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] going to refresh menu 3d portal because bots entered/exited the menu portal.`);
        }
        
        thisBot.refreshPortal();
    }
}