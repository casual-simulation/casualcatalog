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
        for (let i = 0; i < ab.links.remember.links.abMultipleBotFocus.length; i++) {
            selectedBots.push(ab.links.remember.links.abMultipleBotFocus[i]);
       }
    }
 
    thisBot.abCopyBotsToClipboard({ bots: selectedBots });
}

if (that.keys == "x") {
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
        for (let i = 0; i < ab.links.remember.links.abMultipleBotFocus.length; i++) {
            selectedBots.push(ab.links.remember.links.abMultipleBotFocus[i]);
       }
    }
 
    thisBot.abCopyBotsToClipboard({ bots: selectedBots });
    destroy(selectedBots);
}

if (that.keys == "d") {
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
        for (let i = 0; i < ab.links.remember.links.abMultipleBotFocus.length; i++) {
            selectedBots.push(ab.links.remember.links.abMultipleBotFocus[i]);
       }
    }
 
    // const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
    const newBotsArr = [];
    const lineToArr = [];
    for (const newBotData of selectedBots) {
        const newBot = create(newBotData);
        // newBot.tags[dimension + 'Z'] = (newBot.tags[dimension + 'Z'] ?? 0) + (newBot.tags[newBot.tags.scale ? 'scale' : newBot.tags.scaleZ ? 'scaleZ' : 'scale'] ?? 1);
        newBotsArr.push(newBot);
        lineToArr.push(newBot.id)
    }

    ab.links.manifestation.links.abBot.links.armBot?.originSetSelection(lineToArr);
    ab.links.manifestation.links.abBot.links.armBot?.setArmVisible(false);
    ab.links.manifestation.links.abBot.masks.lineTo = lineToArr;

    await os.sleep(0)
    if (lineToArr.length > 1) {
        ab.links.remember.masks.abMultipleBotFocus = getLink(lineToArr);
        ab.links.manifestation.abClick({ menu: 'multipleBot' });
    } else {
        ab.links.remember.masks.abBotFocus = getLink(lineToArr[0]);
        ab.links.manifestation.abClick({ menu: 'bot' });
    }
}