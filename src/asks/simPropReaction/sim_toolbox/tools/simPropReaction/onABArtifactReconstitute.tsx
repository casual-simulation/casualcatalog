let data = that.data;
if (data.config) {
    data = data.config;
}
tags.label = data.label ?? 'prop reaction';
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? 'white';
tags.simID = data.simID ?? uuid();
tags.propReactionType = data.propReactionType ?? 'onClick';
tags.actionTriggers = data.actionTriggers;
tags.actionStory = data.actionStory;
tags.roleTags = data.roleTags ?? [];

//Handle lineTo
if (tags.lineTo) {
    tags.lineTo = null;
}
shout("onActionReconstituted", thisBot);

//clear possible extra data
if (tags.choosingProp) {
    tags.choosingProp = null;
}

//Place bot correctly
if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

//If new action
if (data.eggParameters) {
    const dimension = data.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = data.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = data.eggParameters.gridInformation?.position?.y ?? 0;

    tags.dimension = dimension;
    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;

    thisBot.onClick();
}

if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
    ab.links.console.masks.open = true;
}