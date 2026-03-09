const data = that.data;

tags.placeLabel = data.label ?? 'artifact';
tags.form = data.form;
tags.formSubtype = data.formSubtype;
tags.formAddress = data.formAddress;
tags.formAddressAspectRatio = data.formAddressAspectRatio;
tags.artifactName = data.artifactName;
tags.artifactLink = data.artifactLink;
tags.landmarkIDs = data.landmarkIDs;
tags.artifactID = data.artifactID ?? uuid();
tags.artifactImage = data.artifactImage;
tags.realArtifactImage = data.realArtifactImage;
tags.artifactDescription = data.artifactDescription;
tags.artifactYear = data.artifactYear;
tags.artifactLocked = data.artifactLocked;
tags.collectionID = data.collectionID;
tags.collectable = false;
tags.pointable = false;
tags.collected = data.collected ?? false;

if (data.artifactImage) {
    tags.formAddress = data.artifactImage;
    tags.form = 'sprite';
    tags.orientationMode = 'billboard';
    tags.scale = 3;
}

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

    thisBot.onClick();
}