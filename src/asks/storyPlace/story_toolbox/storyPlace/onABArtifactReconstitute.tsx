const data = that.data;
tags.label = data.label ?? 'story place';
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? 'white';
tags.placePrompt = data.placePrompt;
tags.formAddress = data.formAddress;

if (tags.formAddress) {
    tags.color = null;
}

//Place bot correctly
if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

if (tags.formAddress) {
    const skybox = create({
        form: 'skybox',
        formAddress: tags.formAddress,
        pointable: false,
        scale: 200,
        [tags.dimension + 'X']: 0,
        [tags.dimension + 'Y']: 0,
        [tags.dimension]: false,
        anchorPoint: 'center',
        [tags.dimension + "RotationX"]: 1.5708,
        system: 'story_toolbox.genBots.skybox',
        abIgnore: true
    });

    tags.skybox = getLink(skybox);
    thisBot.makeMiniSkybox();
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
        thisBot.createSkybox({"prompt": data.eggParameters.storyParameters.prompt, "target": data.eggParameters.storyParameters.target});
    } else {
        thisBot.onClick();
    }
}

if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
    ab.links.console.masks.open = true;
}