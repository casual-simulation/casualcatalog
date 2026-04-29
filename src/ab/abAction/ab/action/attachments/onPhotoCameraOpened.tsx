masks.abAttachmentCameraState = 'opened';

const inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;

if (inXR) {
    const timerSeconds = Number(tags.captureTimerSeconds ?? 3);

    for (let i = 0; i < timerSeconds; i++) {
        os.sleep(i * 1000).then(async () => {
            if (masks.abAttachmentCameraState === 'opened') {
                if (links.captureLoadingBar) {
                    links.captureLoadingBar.tags.label = timerSeconds - i;
                }
                const soundURL = await ab.abBuildCasualCatalogURL(tags.beepSoundUrl);
                if (soundURL) {
                    os.playSound(soundURL);
                }
            }
        });
    }
}
