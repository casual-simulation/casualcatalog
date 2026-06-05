const locaRequestBot = getBot("name", "journalRequest");

if (locaRequestBot) {
    locaRequestBot.openApp("awaitingLocationPermission");
}