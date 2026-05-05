const { botIDs } = that;

if (botIDs.includes(thisBot.id)) {
    shout("clearEggSetupMenu");
}

if (tags.lineTo && botIDs.includes(tags.lineTo)) {
    // If the bot that this kit was pointed at is removed, then we should remove this egg as well.
    destroy(thisBot);
}