const { modality, buttonId } = that;

if (modality === 'mouse' && buttonId !== 'left') {
    return;
}

if (configBot.tags.inAR) {
    shout('onExitARClick');
    await os.sleep(500);
    os.disableAR();
    return;
} else if (configBot.tags.inVR) {
    shout('onExitVRClick');
    await os.sleep(500);
    os.disableVR();
    return;
}

if (os.device().supportsAR) {
    os.enableAR();
} else if (os.device().supportsVR) {
    os.enableVR();
} else {
    os.toast('WebXR is not available on this device.');
}