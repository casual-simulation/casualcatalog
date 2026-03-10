if (!masks.initialized) {
    return;
}

const { portal, dimension } = that;

if (portal === 'menuPortal') {
    if (masks.showingMenuPortal !== dimension) {
        masks.showingMenuPortal = dimension;
        
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] going to refresh menu 3d portal because menu portal dimension was changed: ${dimension}`);
        }

        thisBot.refreshPortal();
    }
}