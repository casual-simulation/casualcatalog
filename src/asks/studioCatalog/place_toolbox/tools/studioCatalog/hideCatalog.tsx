const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? tags.dimension ?? 'home';
tags[dimension] = false;
masks[dimension] = null;

setTimeout(() => {
    if (tags[dimension] == false) {
        links.defaultVisualBot.tags[dimension] = false;
        links.defaultVisualBot.masks[dimension] = null;
    }
}, 600)
