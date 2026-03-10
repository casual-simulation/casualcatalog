if (that.eggParameters) {
    const dimension = that.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = that.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = that.eggParameters.gridInformation?.position?.y ?? 0;

    tags.studioStatioID = that.eggParameters.studioStationID;

    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;

    setTagMask(thisBot, "gridInformation", that.eggParameters.gridInformation, "shared");
    
    thisBot.showEggWizardMenu();
}