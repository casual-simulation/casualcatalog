let data = that.data;

if (data.config) {
    data = data.config;
}

tags.label = data.label ?? 'prop action';
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? 'white';
tags.simID = data.simID ?? uuid();
tags.actionIcon = data.actionIcon ?? 'touch_app';
tags.actionTriggers = data.actionTriggers;
tags.actionTriggerFilter = data.actionTriggerFilter;
tags.completionTriggers = data.completionTriggers;
tags.hideTriggers = data.hideTriggers;
tags.startingAction = data.startingAction ?? false;
tags.actionStory = data.actionStory;
tags.roleTags = data.roleTags ?? [];
tags.groupTags = data.groupTags ?? [];

//Handle lineTo
if (tags.lineTo) {
    tags.lineTo = null;
}
shout("onActionReconstituted", thisBot);

//clear possible extra data
if (tags.choosingTrigger) {
    tags.choosingTrigger = null;
}

if (tags.choosingHideTrigger) {
    tags.choosingHideTrigger = null;
}

if (tags.choosingCompletionTrigger) {
    tags.choosingCompletionTrigger = null;
}

if (tags.choosingTriggerFilter) {
    tags.choosingTriggerFilter = null;
}

if (tags.startingAction == true) {
    tags.scaleZ = 1.4;
} else {
    tags.scaleZ = 1;
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