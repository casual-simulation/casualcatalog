if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');
shout("clearRoTJournalMenu");

configBot.tags.menuPortal = 'rotJournal_menu';

const menuOptions = {
    rotJournal_menu: true,
    clearRoTJournalMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    journal: getLink(thisBot)
}

if (tags.currentRegisteredApp) {
    os.unregisterApp(tags.currentRegisteredApp);
    tags.currentRegisteredApp = null;
} 

const collectionsMenu = getBot("name", "collectionsMenu");
collectionsMenu.openApp();