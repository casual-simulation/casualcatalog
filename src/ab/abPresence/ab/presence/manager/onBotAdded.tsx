/** @type ABUserPresenceQueuedCursorData[] */
thisBot.vars.cursorQueue = [];

if (os.isCollaborative()) {
    thisBot.startTick();
}