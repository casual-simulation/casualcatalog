shout('arWebSlingerMenuReset');

configBot.masks.menuPortal = 'arWebSlingerMenu';

const device = os.device();

if (device.supportsAR || device.supportsVR || tags.devMode) {
    masks.color = null;
    
    if (device.supportsAR || tags.devMode) {
        const arButton = ab.links.menu.abCreateMenuButton({
            arWebSlingerMenu: true,
            label: 'enter ar',
            arWebSlingerMenuReset: `@destroy(thisBot)`,
            onClick: `@
                os.enableAR();
            `
        })
    }

    if (device.supportsVR || tags.devMode) {
        const vrButton = ab.links.menu.abCreateMenuButton({
            arWebSlingerMenu: true,
            label: 'enter vr',
            arWebSlingerMenuReset: `@destroy(thisBot)`,
            onClick: `@
                os.enableVR();
            `
        })
    }

    if (tags.devMode) {
        if (!masks.isXRSetup) {
            const devXRSetupButton = ab.links.menu.abCreateMenuButton({
                arWebSlingerMenu: true,
                label: '[dev mode] xr setup',
                manager: getLink(thisBot),
                arWebSlingerMenuReset: `@destroy(thisBot)`,
                onClick: `@
                    links.manager.xrSetup();
                `
            })
        }
    }
} else {
    // Device does not support WebXR.
    ab.links.utils.abLogAndToast({ message: 'WebXR is not available on this device.'});
    masks.color = 'red';
}
