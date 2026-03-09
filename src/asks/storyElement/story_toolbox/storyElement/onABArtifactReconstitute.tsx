const data = that.data;
tags.label = data.label ?? 'story element';
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? 'white';
tags.elementQuip = data.elementQuip;
tags.storyElementLocked = data.storyElementLocked;
tags.elementPrompt = data.elementPrompt;
tags.scaleX = data.scaleX;
tags.scaleY = data.scaleY;
tags.scaleZ = data.scaleZ;
tags.storyElementType = data.storyElementType;

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

     if (data.eggParameters && data.eggParameters.storyParameters) {
        thisBot.aiGenerateStoryElement({"prompt": data.eggParameters.storyParameters.prompt, "target": data.eggParameters.storyParameters.target});
    } else {
        thisBot.aiGenerateStoryElement();
    }
}

if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
    ab.links.console.masks.open = true;
}
