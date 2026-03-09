const playerBot = getBot(byTag("#playerID", configBot.id))
if (!playerBot.tags.continueLocationPull) {
    thisBot.openApp("awaitingLocationPermission")
}
else {
    thisBot.closeApp()
}
whisper(playerBot, "updateLocation")