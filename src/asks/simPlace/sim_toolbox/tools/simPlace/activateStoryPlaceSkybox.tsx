if (tags.formAddress && that == tags.formAddress) {
    const currentDim = ab.links.remember.tags.abActiveDimension;
    const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";

    configBot.tags.gridPortal = tags.chosenDimension;
    gridPortalBot.tags.portalCameraType = "perspective";

    if (currentPortal == 'map') {
        configBot.tags.mapPortal = null;
        setTagMask(ab.links.remember, "mapZoomPosition", {x: tags[currentDim + 'X'], y: tags[currentDim + 'Y']});
        configBot.tags.miniMapPortal = currentDim;
    }

    setTagMask(thisBot, 'activeSkybox', true, 'shared');
    shout("onStorySceneChange", tags.label);

    gridPortalBot.tags.portalCameraType = "perspective";
} else {
    setTagMask(thisBot, 'activeSkybox', false, 'shared');
}