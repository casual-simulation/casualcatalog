os.unregisterApp("locationApp");

if (that == "x"){
    let journal = getBot(byTag("artifactJournal", true));
    journal.tags.currentRegisteredApp = null;
}