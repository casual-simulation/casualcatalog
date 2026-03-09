if (that.portal == 'gridPortal') {
    if (that.dimension == tags.chosenDimension) {
        gridPortalBot.tags.portalCameraType = "perspective";
    } else if (that.dimension == 'home' || that.dimension == 'blueprint') {
        gridPortalBot.tags.portalCameraType = "orthographic";
    }
}