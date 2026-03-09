if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

if (os.isCollaborative()) {
    thisBot.startTick();
}