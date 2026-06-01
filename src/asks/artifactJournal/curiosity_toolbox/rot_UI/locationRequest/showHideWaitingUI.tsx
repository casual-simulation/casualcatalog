const journal = getBot(byTag("artifactJournal", true))
if (!journal.tags.usingGPS) {
    thisBot.openApp("awaitingLocationPermission")
}
else {
    thisBot.closeApp()
}