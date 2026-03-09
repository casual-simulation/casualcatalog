let data = that.data;
if (data.config) {
    data = data.config;
}

tags.label = data.label ?? 'sim place';
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? 'white';
tags.placePrompt = data.placePrompt;
tags.formAddress = data.formAddress;
tags.chosenDimension = data.chosenDimension;
tags.simID = data.simID ?? uuid();
tags.doors = data.doors ?? [];

tags.skyboxGenerating = false;

if (tags.formAddress) {
    tags.color = null;
}

//Handle lineTo
if (tags.lineTo) {
    tags.lineTo = null;
}
shout("onPlaceReconstituted", thisBot);

//clear possible extra data
if (tags.choosingDoor) {
    tags.choosingDoor = null;
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
        [tags.chosenDimension + 'X']: 0,
        [tags.chosenDimension + 'Y']: 0,
        [tags.chosenDimension]: true,
        anchorPoint: 'center',
        [tags.chosenDimension + "RotationX"]: 1.5708,
        system: 'story_toolbox.genBots.skybox',
        abIgnore: true
    });

    tags.skybox = getLink(skybox);

    thisBot.makeMiniSkybox();

} else if (tags.placePrompt && tags.label && tags.chosenDimension) {
    thisBot.createSkybox({"prompt": tags.placePrompt, "target": tags.label, 'dimension': tags.chosenDimension});
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