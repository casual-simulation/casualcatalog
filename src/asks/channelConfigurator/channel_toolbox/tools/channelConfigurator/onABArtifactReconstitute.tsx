const data = that.data;

tags.chosenBIOS = data.bios;
tags.chosenInstName = data.instName;
tags.chosenPattern = data.defaultPattern;
tags.chosenPatternStudio = data.defaultPatternStudio;
tags.chosenChannelName = data.channelName;
tags.channel_onChannelLoaded = data.onChannelLoaded ?? tags.template_onChannelLoaded;
tags.channelSetupLabel = data.channelSetupLabel ?? "configure channel";
tags.prevBotID = data.prevBotID;

if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

if (data.eggParameters) {
    const dimension = data.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = data.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = data.eggParameters.gridInformation?.position?.y ?? 0;

    tags.dimension = dimension;
    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;

    tags.chosenBIOS = 'free';
    tags.channel_onChannelLoaded = tags.template_onChannelLoaded;
    tags.channelSetupLabel = "configure channel";
    thisBot.showChannelSetupMenu();
}

thisBot.updateBillboardLabel();