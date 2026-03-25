const locaRequestBot = getBot("name", "journalRequest");

if (!that) {
    tags.continueLocationPull = false;

    if (locaRequestBot) {
        locaRequestBot.openApp("awaitingLocationPermission");
    }
} else {
    tags.continueLocationPull = true;
    
    if (tags.currentRegisteredApp == "locationApp") {
        locaRequestBot.closeApp()
    }
    
    thisBot.updateLocation();
}