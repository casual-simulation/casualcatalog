const journal = getBot(byTag("artifactJournal", true))
if (!journal.tags.continueLocationPull) {
    thisBot.openApp("awaitingLocationPermission")
}
else {
    thisBot.closeApp()
}