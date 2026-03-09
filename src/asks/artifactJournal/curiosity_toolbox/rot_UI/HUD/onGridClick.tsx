
const journal = getBot("artifactJournal", true);
if (tags.currentRegisteredApp != 'hudApp' && journal.tags.rotShown) {
    os.unregisterApp(tags.currentRegisteredApp);
    thisBot.openApp();
}
