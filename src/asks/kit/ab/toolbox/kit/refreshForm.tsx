if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] invoke`);
}

let targetFormAddress = ab.abBuildCasualCatalogURL('/asks/meshes/kit_icon_animated.glb');
tags.hasCustomMesh = false;

if (tags.studioId) {
    const studioConfig = await ab.links.search.abStudioConfig({ studioId: tags.studioId });
    if (studioConfig?.studio_kit_mesh_url) {
        targetFormAddress = studioConfig.studio_kit_mesh_url;
        tags.hasCustomMesh = true;
    }
    if (studioConfig?.studio_kit_scale != null) {
        tags.scaleX = studioConfig.studio_kit_scale;
        tags.scaleY = studioConfig.studio_kit_scale;
        tags.scaleZ = studioConfig.studio_kit_scale;
    }
    if (studioConfig?.studio_kit_color) {
        tags.color = studioConfig.studio_kit_color;
    }
    if (studioConfig?.studio_label_color) {
        tags.labelColor = studioConfig?.studio_label_color;
    }
    if (studioConfig?.studio_label_background_color) {
        tags.labelFloatingBackgroundColor = studioConfig?.studio_label_background_color;
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
