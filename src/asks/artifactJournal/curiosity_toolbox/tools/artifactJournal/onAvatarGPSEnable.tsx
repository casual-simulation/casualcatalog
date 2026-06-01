const locaRequestBot = getBot("name", "journalRequest");

tags.usingGPS = true;

if (tags.currentRegisteredApp == "locationApp") {
    locaRequestBot.closeApp()
}

shout('clearLandmarkMenu');
