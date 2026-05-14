if (that.tags.includes("strokeColor")) {
    if (links.strokeBot) {
        links.strokeBot.tags.color = tags.strokeColor;
    }
}

if (that.tags.includes("eggConfigConfirmed")) {
    thisBot.updateEggData();
}

if (that.tags.includes(tags.dimension)) {
    if (links.strokeBot) {
        links.strokeBot.tags[tags.dimension] = tags[tags.dimension];
    }

    const connectedBots = getBots("lineTo", getID(thisBot));
    setTag(connectedBots, tags.dimension, tags[tags.dimension]);
}