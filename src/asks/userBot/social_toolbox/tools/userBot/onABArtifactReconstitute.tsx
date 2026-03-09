const data = that.data;
tags.bbLabel = data.label ?? 'user';
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.bbLabelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.bbLabelColor = data.labelColor ?? 'white';
tags.form = data.form ?? null;
tags.formSubtype = data.formSubtype;
tags.formAddress = data.formAddress;
tags.formAddressAspectRatio = data.formAddressAspectRatio;
tags.pokeNotifsAllowed = data.pokeNotifsAllowed ?? false;

//Place bot correctly
if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

if (data.userID) {
    tags.userID = data.userID
} else {
    if (!authBot) {
        await os.requestAuthBotInBackground();
    }

    tags.userID = authBot?.id;
    
    if (authBot.name) {
        tags.bbLabel = authBot.name;
    }

    thisBot.updateBillboardLabel();
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