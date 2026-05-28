const inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;

if (!inXR) {
    return;
} 

tags.cameraState = 'opened';

for (let i = 0; i < tags.captureTimerSeconds; i++) {
    os.sleep(i * 1000).then(() => {
        if (tags.cameraState === 'opened') {
            links.loadingBar?.tags.label = tags.captureTimerSeconds - i;
            const soundURL = await ab.abBuildCasualCatalogURL(tags.beepSoundUrl);
            if (soundURL) {
                os.playSound(soundURL);
            }
        }
    })
}