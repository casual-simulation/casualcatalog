const locaRequestBot = getBot("name", "journalRequest");

if (that == true) {
    tags.continueLocationPull = true;
    
    if (tags.currentRegisteredApp == "locationApp") {
        locaRequestBot.closeApp()
    }
    
    thisBot.updateLocation();
    await os.sleep(500);
    shout('clearLandmarkMenu');
} else {
    tags.continueLocationPull = false;

    if (locaRequestBot) {
        locaRequestBot.openApp("awaitingLocationPermission");
    }
}