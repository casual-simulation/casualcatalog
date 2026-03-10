const dimension = configBot.tags.gridPortal;
setTagMask(thisBot, dimension, true, 'shared');
setTagMask(thisBot, dimension + 'RotationX', 1.5708, 'shared');

let parameters, skyboxImage, skyboxTags;

console.log(`[${tags.system}.${tagName}] that:`, that);

if(that.eggParameters){
    parameters = that.eggParameters;
    skyboxImage = that.eggParameters.skyboxImage ?? false;
    skyboxTags = that.eggParameters.skyboxTags ?? false;
}

if(skyboxImage){
    if (tags.formAddress !== skyboxImage) {
        setTagMask(thisBot, 'formAddress', skyboxImage, 'shared');
    }
}

if(skyboxTags){
    for(const tag in skyboxTags){
        if (thisBot.tags[tag] !== skyboxTags[tag]) {
            setTagMask(thisBot, tag, skyboxTags[tags], 'shared');
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

gridPortalBot.tags.portalCameraType = "perspective";
gridPortalBot.tags.portalPannableMaxX = 30;
gridPortalBot.tags.portalPannableMinX = -30;
gridPortalBot.tags.portalPannableMaxY = 30;
gridPortalBot.tags.portalPannableMinY = -30;
gridPortalBot.tags.portalZoomable = false;