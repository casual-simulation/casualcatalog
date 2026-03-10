// First click
if (!thisBot.vars.doubleClickTimer) {
    if (masks.selected && !masks.justSelected) {
        const selectedBots = getBots("selected");
        if (selectedBots.length === 1 || configBot.tags.keyboard_Shift) {
            whisper(thisBot, "onDeselect");
        }
    }
    thisBot.vars.doubleClickTimer = true;
    thisBot.vars.clickTimeout = setTimeout(() => {
        thisBot.vars.doubleClickTimer = null;
    }, 500);

    let stickyAppBot = getBot("system", "stickies.app");
    whisper(stickyAppBot, "setStickyHighlight", [bot.id]);

    return;
}

// Second click
if (!configBot.tags.keyboard_Shift) {
    whisper(thisBot, 'onDeselect');

    let stickyAppBot = getBot("system", "stickies.app");
    whisper(stickyAppBot, "showNoteEditor", thisBot);
}