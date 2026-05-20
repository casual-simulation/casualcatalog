shout("abMenuRefresh");

if (masks.selectedBots) {
    masks.selectedBots = null;
}

if (!tags.studioId) {
    thisBot.onClick();
    destroy(links.armBot);
} else {
    thisBot.handleToolMenu(that);  
    if (!masks.selected) {
        masks.selected = true;
    }
}