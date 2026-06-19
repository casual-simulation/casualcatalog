tags.uuabUsingCameraBackground = that;
if (tags.uuabUsingCameraBackground) {
    gridPortalBot.tags.portalBackgroundAddress = "casualos://camera-feed/rear";
} else {
    gridPortalBot.tags.portalBackgroundAddress = null;
}

thisBot.showLauncherMenu();