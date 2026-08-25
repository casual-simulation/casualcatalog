let selectedBots = [];

if (ab.links.remember.links.abBotFocus) {
    selectedBots.push(ab.links.remember.links.abBotFocus);
}
else if (ab.links.remember.links.abMultipleBotFocus) {
    for (let i = 0; i < ab.links.remember.links.abMultipleBotFocus.length; i++) {
        selectedBots.push(ab.links.remember.links.abMultipleBotFocus[i]);
    }
}

const newBotsArr = [];
const lineToArr = [];
for (const newBotData of selectedBots) {
    const newBot = create(newBotData);
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