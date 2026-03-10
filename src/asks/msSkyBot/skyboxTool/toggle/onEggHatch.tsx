const dimension = configBot.tags.gridPortal;
setTagMask(thisBot, dimension, true, 'shared');

let parameters, skyboxImage, toggleTags

if(that.eggParameters){
    parameters = that.eggParameters;
    skyboxImage = that.eggParameters.skyboxImage ?? false;
    toggleTags = that.eggParameters.toggleTags ?? false;
}

if(skyboxImage){
    if (tags.formAddress !== skyboxImage) {
        setTagMask(thisBot, 'formAddress', skyboxImage, 'shared');
    }
}

if(toggleTags){
    for(const tag in toggleTags){
        if (thisBot.tags[tag] !== toggleTags[tag]) {
            setTagMask(thisBot, tag, toggleTags[tags], 'shared');
        }
    }
};

if(parameters){
    const currentHash = crypto.hash('sha1', 'hex', tags.passedEggParameters);
    const incomingHash = crypto.hash('sha1', 'hex', parameters);
    
    if (currentHash !== incomingHash) {
        setTagMask(thisBot, 'passedEggParameters', parameters, 'shared');
    }
};

shout("onSkyboxToggleInitialized", thisBot);