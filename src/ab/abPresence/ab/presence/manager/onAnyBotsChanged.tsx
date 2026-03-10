const gridPortalBotIndex = that.findIndex((el) => {
    if (el && globalThis.gridPortalBot && el.bot === gridPortalBot) {
        return true;
    }
});

if (gridPortalBotIndex >= 0) {
    const changedTags = that[gridPortalBotIndex].tags;
    const cameraChanged = changedTags.some((t) => {
        return t === 'cameraPositionX' ||
            t === 'cameraPositionY' ||
            t === 'cameraPositionZ' ||
            t === 'cameraPositionOffsetX' ||
            t === 'cameraPositionOffsetY' ||
            t === 'cameraPositionOffsetz' ||
            t === 'cameraRotationX' ||
            t === 'cameraRotationY' ||
            t === 'cameraRotationZ' ||
            t === 'cameraRotationOffsetX' ||
            t === 'cameraRotationOffsetY' ||
            t === 'cameraRotationOffsetZ' ||
            t === 'cameraRotationOffsetW' ||
            t === 'cameraFocusX' ||
            t === 'cameraFocusY' ||
            t === 'cameraFocusZ' ||
            t === 'cameraZoom' ||
            t === 'cameraZoomOffset';
    })

    if (cameraChanged) {
        shout('onGridPortalCameraChanged', { changedTags });
    }
}