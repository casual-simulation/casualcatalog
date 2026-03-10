os.unregisterApp("helpApp");

if (that == "x"){
    let journal = getBot(byTag("artifactJournal", true));
    journal.tags.currentRegisteredApp = null;
}