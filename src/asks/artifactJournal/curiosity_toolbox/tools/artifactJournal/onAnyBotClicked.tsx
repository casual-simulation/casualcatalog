if (tags.currentRegisteredApp && that.dimension != configBot.tags.menuPortal && that.bot != thisBot && configBot.tags.menuPortal != 'rotJournal_menu') {
    os.unregisterApp(tags.currentRegisteredApp);
    tags.currentRegisteredApp = null;
} 