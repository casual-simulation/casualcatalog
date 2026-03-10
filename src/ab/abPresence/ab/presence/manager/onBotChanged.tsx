if (that.tags.includes('tickIntervalMS')) {
    thisBot.stopTick();

    if (os.isCollaborative() && thisBot.getPresenceEnabled()) {
        thisBot.startTick();
    }
} else if (that.tags.some((t) => t === 'cursorEnabled' || t === 'cameraEnabled')) {
    if (thisBot.getPresenceEnabled()) {
        thisBot.startTick();
    } else {
        thisBot.stopTick();
    }
}