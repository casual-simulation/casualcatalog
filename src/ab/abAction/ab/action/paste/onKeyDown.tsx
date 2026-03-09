if (!builderVersion || (!links.remember.links.abBotFocus && !links.remember.links.abMultipleBotFocus)) {
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

    if (links.remember.links.abBotFocus) {
        selectedBots.push(links.remember.links.abBotFocus);
    }
    else if (links.remember.links.abMultipleBotFocus) {
        for (let i = 0; i < links.remember.links    .abMultipleBotFocus.length; i++) {
            selectedBots.push(links.remember.links.abMultipleBotFocus[i]);
       }
    }
 
    thisBot.abCopyBotsToClipboard({ bots: selectedBots });
}