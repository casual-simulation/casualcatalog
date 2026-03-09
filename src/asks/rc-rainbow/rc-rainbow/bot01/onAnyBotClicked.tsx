const { bot } = that;

if (bot.tags['rainbowPiece'] === true) {
    if (links.rainbowBots.some(b => b.id === bot.id)) {
        os.showInputForTag(thisBot.id, 'rainbowArc', { autoSelect: true, title: 'Change rainbow arc' });
    }
}