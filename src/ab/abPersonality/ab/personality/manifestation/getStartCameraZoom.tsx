async function getStartCameraZoom(portal: 'map' | 'grid'): number | null {
    if (portal === 'grid') {
        return null;
    } else if (portal === 'map') {
        if (typeof links.remember.tags.mapStartZoom === 'number') {
            return links.remember.tags.mapStartZoom;
        } else {
            return null;
        }
    } else {
        console.error(`[${tags.system}.${tagName}] unrecongized portal type provided to getStartCameraZoom:`, portal);
        return null;
    }
}

return getStartCameraZoom(that);