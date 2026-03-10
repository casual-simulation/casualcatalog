const { botIDs } = that;

if (masks.targetBotId) {
    if (botIDs.includes(masks.targetBotId)) {
        // Hide keyboard if target bot gets destroyed.
        thisBot.hide();
    }
}