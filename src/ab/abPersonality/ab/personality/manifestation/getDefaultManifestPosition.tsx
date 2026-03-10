async function getDefaultManifestPosition(portal: 'map' | 'grid'): { x: number, y: number } {
    if (portal === 'grid') {
        return { x: 0, y: 0 }
    } else if (portal === 'map') {
        if (typeof links.remember.tags.mapZoomPosition?.x === 'number' &&  typeof links.remember.tags.mapZoomPosition?.y === 'number') {
            return links.remember.tags.mapZoomPosition;
        } else {
            let currentPosition = undefined;
            let hasGeolocationPermission = await links.utils.hasGeolocationPermission();

            // Current work-around for allowing geolocation for iOS app
            if (getBot("system", "ab.iosbridge.messenger")) {
                hasGeolocationPermission = true;
            }

            if (hasGeolocationPermission) {
                const geolocation = await os.getGeolocation();
                if (geolocation.success) {
                    currentPosition = { x: geolocation.longitude, y: geolocation.latitude }
                }
            }

            if (currentPosition) {
                return currentPosition;
            } else {
                // GRPM Position
                return { x: -85.6761894822434, y: 42.9656756756756 };
            }
        }
    } else {
        console.error(`[${tags.system}.${tagName}] unrecongized portal type provided to getDefaultManifestPosition:`, portal);
        return { x: 0, y: 0 }
    }
}

return getDefaultManifestPosition(that);