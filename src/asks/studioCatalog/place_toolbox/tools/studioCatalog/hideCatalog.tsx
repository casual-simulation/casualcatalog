const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? tags.dimension ?? 'home';
tags[dimension] = null;
masks[dimension] = null;

if (links.defaultVisualBot.tags.formAnimation.includes("closing") || links.defaultVisualBot.tags.formAnimation.includes("closed_static")) {
    links.defaultVisualBot.tags[dimension] = null;
    links.defaultVisualBot.masks[dimension] = null;
    return;
}

setTimeout(() => {
    if (!tags[dimension]) {
        links.defaultVisualBot.tags[dimension] = null;
        links.defaultVisualBot.masks[dimension] = null;
    }
}, 600)
