if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] invoke`);
}

let targetFormAddress = ab.abBuildCasualCatalogURL('/asks/meshes/kit_icon_animated.glb');

if (tags.studioId) {
    const studioConfig = await ab.links.search.abStudioConfig({ studioId: tags.studioId });
    if (studioConfig?.studio_kit_mesh_url) {
        targetFormAddress = studioConfig.studio_kit_mesh_url;
    }
}

if (masks.form !== 'mesh') {
    masks.form = 'mesh';
}

if (masks.formSubtype !== 'gltf') {
    masks.formSubtype = 'gltf';
}

if (masks.formAddress !== targetFormAddress) {
    masks.formAddress = targetFormAddress;

    masks.formAddressAnimations = null; // Clear cached animations while loading new form.
    masks.formAddressAnimations = await os.listFormAnimations(thisBot);
}

thisBot.refreshAnimation();
