if (!thisBot.vars.uuabMenuData) {
    thisBot.vars.uuabMenuData = tags.uuabMenuData ?? [];
}

await os.sleep(1000);
if (tags.uuabLocked) {
    thisBot.showUUABMenu()
} else {
    thisBot.showLauncherMenu();
}