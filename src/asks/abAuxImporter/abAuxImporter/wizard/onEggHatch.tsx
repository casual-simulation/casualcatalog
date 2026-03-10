if (that.eggParameters) {
    const dimension = that.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = that.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = that.eggParameters.gridInformation?.position?.y ?? 0;

    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;
}

tags.color = ab.links.personality.tags.abBaseColor;
tags.strokeColor = ab.links.personality.tags.abBaseStrokeColor;
tags.labelFloatingBackgroundColor = ab.links.personality.tags.abBaseColor;
tags.labelColor = ab.links.personality.tags.abBaseLabelColor;

thisBot.onClick();