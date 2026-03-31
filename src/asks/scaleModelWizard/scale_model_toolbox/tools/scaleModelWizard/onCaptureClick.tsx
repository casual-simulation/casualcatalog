const inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;

if (!inXR) {
    return;
}

configBot.tags.menuPortal = "scaleModelWizardLoading";
const loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: 'Starting camera...',
    scaleModelWizardLoading: true
});

tags.loadingBar = getLink(loadingBar);
        
os.capturePhoto({
    cameraType: 'auto',
    imageFormat: 'png',
    skipConfirm: true,
    takePhotoAfterSeconds: tags.captureTimerSeconds,
    idealResolution: { width: 1920, height: 1080 }
})