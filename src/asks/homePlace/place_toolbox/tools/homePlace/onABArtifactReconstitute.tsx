const data = that.data;

tags.homeBase = data.homeBase ?? false;
tags.placeLabel = data.label ?? 'name me';
tags.scaleX = data.scaleX ?? 1;
tags.scaleY = data.scaleY ?? 1;
tags.scaleZ = data.scaleZ ?? 2;
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.placeLabelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.placeLabelColor = data.labelColor ?? abPersonality?.tags?.abBaseLabelColor ?? 'black';
tags.form = data.form ?? 'hex';
tags.formSubtype = data.formSubtype;
tags.formAddress = data.formAddress;
tags.formAddressAspectRatio = data.formAddressAspectRatio;

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

    const name = await os.showInput('', {
        autoSelect: true,
        title: 'Name this place bot'
    });

    if (name) {
        tags.placeLabel = name;
    }

}

if (!tags.form) {
    tags.form = 'hex';
}

thisBot.updateBillboardLabel();