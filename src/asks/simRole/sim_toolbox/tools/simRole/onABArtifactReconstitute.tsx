let data = that.data;
if (data.config) {
    data = data.config;
}
tags.label = data.label ?? 'role';
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? 'white';
tags.simID = data.simID ?? uuid();
tags.form = data.form ?? 'sphere';
tags.formSubtype = data.formSubtype;
tags.formAddress = data.formAddress;
tags.formAddressAspectRatio = data.formAddressAspectRatio;
tags.simAttributes = data.simAttributes;
tags.roleLocked = data.roleLocked ?? false;
tags.roleName = data.roleName;
tags.numUsers = data.numUsers ?? 1;
tags.defaultPlace = data.defaultPlace;

if (!tags.simAttributes) {
    tags.simAttributes = {};
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