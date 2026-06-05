shout("clearRoTJournalMenu");
if (tags.currentRegisteredApp) {
    os.unregisterApp(tags.currentRegisteredApp);
    tags.currentRegisteredApp = null;
}