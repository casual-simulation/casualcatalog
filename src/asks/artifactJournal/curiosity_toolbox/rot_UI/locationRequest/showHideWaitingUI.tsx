if (!ab.links.navigation?.tags.usingGPS) {
    thisBot.openApp("awaitingLocationPermission")
}
else {
    thisBot.closeApp()
}