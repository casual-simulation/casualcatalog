if (configBot.tags.inAR) {
    os.disableAR();
    return;
} else if (configBot.tags.inVR) {
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