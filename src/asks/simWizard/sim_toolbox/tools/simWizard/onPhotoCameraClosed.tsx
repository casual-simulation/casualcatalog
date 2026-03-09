const inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;

if (!inXR) {
    return;
}

if (tags.cameraState === 'opened') {
    // User closed the photo camera early, thus canceling it.
    destroy(links.loadingBar);
}

tags.cameraState = 'closed';