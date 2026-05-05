if (that.eggParameters) {
    const dimension = that.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = that.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = that.eggParameters.gridInformation?.position?.y ?? 0;

    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;

    

    tags.color = abPersonality?.tags?.abBaseColor ?? '#0000FF';
    tags.strokeColor = abPersonality?.tags?.abBaseColor ?? '#0000FF';
    tags.labelFloatingBackgroundColor = abPersonality?.tags?.abBaseColor ?? '#0000FF'; 
    tags.labelColor = abPersonality?.tags?.abBaseLabelColor ?? 'black';

    setTagMask(thisBot, "studioId", that.eggParameters.studioId, "shared");
    setTagMask(thisBot, "originType", that.eggParameters.originType, "shared");

    setTagMask(thisBot, "gridInformation", that.eggParameters.gridInformation, "shared");
    setTagMask(thisBot, "chosenBIOS", "free", "shared");
    
    tags.toolbox = data.eggParameters.toolboxBot;
    if (links?.toolbox?.tags?.studioId && !data.studioId) {
        setTagMask(thisBot, "studioId", links.toolbox.tags.studioId, "shared");
    }

    if (that.eggParameters.initializationInfo) {
        if (that.eggParameters.initializationInfo.pattern) {
            setTagMask(thisBot, "chosenPattern", that.eggParameters.initializationInfo.pattern, "shared");
        }
        if (that.eggParameters.initializationInfo.studio) {
            setTagMask(thisBot, "chosenStudio", that.eggParameters.initializationInfo.studio, "shared");
        }
        if (that.eggParameters.initializationInfo.linkTo) {
            setTagMask(thisBot, "linkTo", that.eggParameters.initializationInfo.linkTo, "shared");
        }
        if (that.eggParameters.initializationInfo.form) {
            setTagMask(thisBot, "chosenForm", that.eggParameters.initializationInfo.form, "shared");
        }
        if (that.eggParameters.initializationInfo.color) {
            setTagMask(thisBot, "chosenColor", that.eggParameters.initializationInfo.color, "shared");
        }
        if (that.eggParameters.initializationInfo.bios) {
            setTagMask(thisBot, "chosenBIOS", that.eggParameters.initializationInfo.bios, "shared");
        }
        if (that.eggParameters.initializationInfo.label) {
            setTagMask(thisBot, "chosenLabel", that.eggParameters.initializationInfo.label, "shared");
        }
        if (that.eggParameters.initializationInfo.instName) {
            setTagMask(thisBot, "chosenInstName", that.eggParameters.initializationInfo.instName, "shared");
        }
        if (that.eggParameters.initializationInfo.abAwake) {
            setTagMask(thisBot, "abAwake", that.eggParameters.initializationInfo.abAwake, "shared");
        }
        if (that.eggParameters.initializationInfo.comId) {
            setTagMask(thisBot, "comIdSetting", that.eggParameters.initializationInfo.comId, "shared");
        }
        if(that.eggParameters.initializationInfo.urlVariables) {
            setTagMask(thisBot, "urlVariables", that.eggParameters.initializationInfo.urlVariables, "shared");
        }
        if (that.eggParameters.initializationInfo.completeOnLoad) {
            thisBot.createNewInst();
        }
    }
    
    thisBot.showInstCreatorMenu();
}