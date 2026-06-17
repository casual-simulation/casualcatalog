const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? tags.dimension ?? 'home';
tags[dimension] = false;
masks[dimension] = null;

if (links.defaultVisualBot.tags.formAnimation == ["closing", "closed_static"]) {
    links.defaultVisualBot.tags[dimension] = false;
    links.defaultVisualBot.masks[dimension] = null;
    return;
}

setTimeout(() => {
    if (tags[dimension] == false) {
        links.defaultVisualBot.tags[dimension] = false;
        links.defaultVisualBot.masks[dimension] = null;
    }
}, 600)
