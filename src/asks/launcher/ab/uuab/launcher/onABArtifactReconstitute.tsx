const data = that.data;

thisBot.vars.uuabMenuData = data.uuabMenuData ?? [];

if (thisBot.vars.uuabMenuData == []) {
    tags.chosenOnClick = 'unlock';
    thisBot.addNewMenuItem();
}

tags.uuabMenuData = thisBot.vars.uuabMenuData;

tags.uuabLocked = data.uuabLocked ?? false;
tags.uuabUsingCameraBackground = data.uuabUsingCameraBackground ?? false;

if (tags.uuabUsingCameraBackground) {
    gridPortalBot.tags.portalBackgroundAddress = "casualos://camera-feed/rear";
}

links.console.cmdABSleep();

if (tags.uuabLocked) {
    thisBot.showUUABMenu()
} else {
    thisBot.showLauncherMenu();
}