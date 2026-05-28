const inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;

if (!inXR) {
    return;
}

const { photo } = that;

tags.cameraState = 'captured';

if (tags.shutterSoundUrl) {
    const soundURL = await ab.abBuildCasualCatalogURL(tags.shutterSoundUrl);
    if (soundURL) {
        os.playSound(soundURL);
    }
}

destroy(links.loadingBar);

thisBot.parsePhoto(photo);