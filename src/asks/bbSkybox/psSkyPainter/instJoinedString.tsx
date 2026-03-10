console.log(`remote joined: ${gridPortalBot.tags.portalCameraType}`)

if (gridPortalBot.tags.portalCameraType != "perspective") {
    gridPortalBot.tags.portalCameraType = "perspective";
    gridPortalBot.tags.portalPannableMaxX = 30;
    gridPortalBot.tags.portalPannableMinX = -30;
    gridPortalBot.tags.portalPannableMaxY = 30;
    gridPortalBot.tags.portalPannableMinY = -30;
    gridPortalBot.tags.portalZoomable = false;
}