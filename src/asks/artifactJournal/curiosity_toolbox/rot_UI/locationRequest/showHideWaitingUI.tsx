const journal = getBot(byTag("artifactJournal", true))
if (!journal.links.homeworld?.tags.usingGPS) {
    thisBot.openApp("awaitingLocationPermission")
}
else {
    thisBot.closeApp()
}