console.log(`[${tags.system}.${tagName}] that:`, that);

const inXR = configBot.tags.inAR || configBot.tags.inVR || tags.testXR;

masks.cameraState = 'opened';

if (inXR) {
    for (let i = 0; i < tags.captureTimerSeconds; i++) {
        os.sleep(i * 1000).then(() => {
            if (tags.cameraState === 'opened') {
                masks.label = ' ' + String(tags.captureTimerSeconds - i) + ' ';
                os.playSound(tags.beepUrl);
            }
        })
    }
}