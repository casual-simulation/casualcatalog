const locaRequestBot = getBot("name", "journalRequest");

tags.usingGPS = false;

if (locaRequestBot) {
    locaRequestBot.openApp("awaitingLocationPermission");
}