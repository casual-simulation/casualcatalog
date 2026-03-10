const data = that.data;

thisBot.vars.uuabMenuData = data.uuabMenuData ?? [];

if (thisBot.vars.uuabMenuData == []) {
    tags.chosenOnClick = 'unlock';
    thisBot.addNewMenuItem();
}

tags.uuabMenuData = thisBot.vars.uuabMenuData;

tags.uuabLocked = data.uuabLocked ?? false;

links.console.cmdABSleep();

if (tags.uuabLocked) {
    thisBot.showUUABMenu()
} else {
    thisBot.showLauncherMenu();
}