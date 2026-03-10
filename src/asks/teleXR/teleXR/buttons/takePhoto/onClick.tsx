const { modality, buttonId } = that;

if (modality === 'mouse' && buttonId !== 'left') {
    return;
}

if (tags.busy) {
    return;
}

masks.busy = true;

const inXR = configBot.tags.inAR || configBot.tags.inVR || tags.testXR;

if (inXR) {
    os.capturePhoto({
        cameraType: 'auto',
        imageFormat: 'png',
        skipConfirm: true,
        takePhotoAfterSeconds: tags.captureTimerSeconds,
        idealResolution: { width: 1280, height: 720 }
    })
} else {
    os.openPhotoCamera({
        cameraType: 'rear',
        imageFormat: 'png',
        idealResolution: { width: 1280, height: 720 },
    })
}