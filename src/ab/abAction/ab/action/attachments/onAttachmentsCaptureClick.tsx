const inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;

if (inXR) {
    tags.previousMenuPortal = configBot.tags.menuPortal;
    configBot.masks.menuPortal = 'abAttachmentsLoading';
    const loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
        abAttachmentsLoading: true,
        label: 'Starting camera...',
    });
    masks.captureLoadingBar = getLink(loadingBar);
    masks.abAttachmentCameraState = 'starting';

    os.capturePhoto({
        cameraType: 'auto',
        imageFormat: 'png',
        skipConfirm: true,
        takePhotoAfterSeconds: Number(tags.captureTimerSeconds ?? 3),
        idealResolution: { width: 1920, height: 1080 }
    });
} else {
    // Desktop: skip countdown, let the built-in modal handle capture.
    masks.abAttachmentCameraState = 'opened';
    os.capturePhoto();
}
