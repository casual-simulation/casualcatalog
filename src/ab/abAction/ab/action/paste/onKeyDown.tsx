if (!builderVersion || (!ab.links.remember.links.abBotFocus && !ab.links.remember.links.abMultipleBotFocus)) {
    return;
}

if (that.keys == "c") {
    let metaInput = os.getInputState("keyboard", "Meta");

    if (!metaInput) {
        metaInput = os.getInputState("keyboard", "Control");
    }

    if (!metaInput) {
        return;
    }

    let selectedBots = [];

    if (ab.links.remember.links.abBotFocus) {
        selectedBots.push(ab.links.remember.links.abBotFocus);
    }
    else if (ab.links.remember.links.abMultipleBotFocus) {
        for (let i = 0; i < ab.links.remember.links    .abMultipleBotFocus.length; i++) {
            selectedBots.push(ab.links.remember.links.abMultipleBotFocus[i]);
       }
    }
 
    thisBot.abCopyBotsToClipboard({ bots: selectedBots });
}