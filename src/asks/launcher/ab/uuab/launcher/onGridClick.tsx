shout("clearNewMenuItemMenu");
shout("clearLauncherMenu");
shout("clearUUABMenu");

if (tags.uuabLocked) {
    thisBot.showUUABMenu()
} else {
    thisBot.showLauncherMenu();
}