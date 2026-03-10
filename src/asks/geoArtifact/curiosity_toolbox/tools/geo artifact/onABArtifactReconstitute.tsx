const data = that.data;

tags.artifactTitle = data.artifactTitle;
tags.artifactDescription = data.artifactDescription;
tags.artifactLink = data.artifactLink;
tags.longitude = data.longitude;
tags.latitude = data.latitude;
tags.artifactLocked = data.artifactLocked;
tags.scaleX = data.scaleX ?? 1;
tags.scaleY = data.scaleY ?? 1;
tags.scaleZ = data.scaleZ ?? 1;
tags.color = data.color ?? '#4BB7E6';
tags.form = data.form;
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
}