const locaRequestBot = getBot("name", "journalRequest");

if (tags.currentRegisteredApp == "locationApp") {
    locaRequestBot.closeApp()
}

shout('clearLandmarkMenu');