if (tags.initialized) {
    return;
}

setTagMask(thisBot, 'initialized', true, 'shared');

setTagMask(thisBot, 'form', 'mesh', 'shared');
setTagMask(thisBot, 'formAddress', ab.abBuildCasualCatalogURL('asks/mispin-assets/MIS_logo.glb'), 'shared');