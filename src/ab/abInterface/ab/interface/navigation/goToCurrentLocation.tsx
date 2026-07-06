const location = await os.getGeolocation();

if (location.success) {
    const currentDim = ab.links.remember.tags.abActiveDimension;
    const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";

    if (currentPortal != 'map') {
        configBot.tags.mapPortal = currentDim;
    }

    os.focusOn({x: location.longitude, y: location.latitude}, {portal: 'map', zoom: ab.links.manifestation.tags.defaultMapPortalZoom, rotation: {x: 45, y: 45}});
} else {
    os.toast("Location services not available")
}