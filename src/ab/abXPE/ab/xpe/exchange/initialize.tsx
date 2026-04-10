if (masks.initialized) {
    return;
}

masks.initialized = true;

if (configBot.tags.abDisableXPE) {
    return;
}

globalThis.abXPE = thisBot;

shout('onABXPEInitialized');
