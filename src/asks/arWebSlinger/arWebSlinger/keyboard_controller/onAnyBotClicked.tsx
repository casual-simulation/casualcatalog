const { bot } = that;

if (links.targetBot) {
    if (bot !== links.targetBot && bot !== links.keyboardBot) {
        thisBot.blur();
    }
}