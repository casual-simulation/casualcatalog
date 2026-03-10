const inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;

if (!inXR) {
    return;
}

configBot.tags.menuPortal = "simWizardLoading";
const loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: 'Starting camera...',
    simWizardLoading: true
});

tags.loadingBar = getLink(loadingBar);
        
os.capturePhoto({
    cameraType: 'auto',
    imageFormat: 'png',
    skipConfirm: true,
    takePhotoAfterSeconds: tags.captureTimerSeconds,
    idealResolution: { width: 1920, height: 1080 }
})