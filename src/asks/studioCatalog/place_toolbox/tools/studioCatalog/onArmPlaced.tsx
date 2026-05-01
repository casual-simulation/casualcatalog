shout("abMenuRefresh");

if (masks.selectedBots) {
    masks.selectedBots = null;
}

if (!tags.studioId) {
    thisBot.onClick();
} else {
  thisBot.handleToolMenu(that);  
}