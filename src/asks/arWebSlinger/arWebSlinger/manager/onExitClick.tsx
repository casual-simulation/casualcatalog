if (configBot.tags.arEnabled) {
    os.disableAR();
} else if (configBot.tags.vrEnabled) {
    os.disableVR();
} else if (tags.devMode && masks.isXRSetup) {
    thisBot.xrTeardown();
}