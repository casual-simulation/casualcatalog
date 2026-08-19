let selectedBots = [];

if (ab.links.remember.links.abBotFocus) {
    selectedBots.push(ab.links.remember.links.abBotFocus);
}
else if (ab.links.remember.links.abMultipleBotFocus) {
    for (let i = 0; i < ab.links.remember.links.abMultipleBotFocus.length; i++) {
        selectedBots.push(ab.links.remember.links.abMultipleBotFocus[i]);
}
}
thisBot.abCopyBotsToClipboard({bots: selectedBots});