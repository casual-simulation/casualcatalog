if (that.tags.includes("strokeColor")) {
    if (links.strokeBot) {
        links.strokeBot.tags.color = tags.strokeColor;
    }
}

if (that.tags.includes("selected")) {
    const attachedBots = getBots("lineTo", getID(thisBot));
    const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? tags.dimension ?? 'home';

    if (tags.selected) {
        setTagMask(attachedBots, dimension, true);
    } else {
        setTag(attachedBots, dimension, false);
        setTagMask(attachedBots, dimension, null);
    }
}