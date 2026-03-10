os.unregisterApp("collectionsMenuApp");

if (that == "x"){
    let journal = getBot(byTag("artifactJournal", true));
    journal.tags.currentRegisteredApp = null;
}