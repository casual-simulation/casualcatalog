let formAddress = ab.abBuildCasualCatalogURL("/asks/meshes/kit_icon_animated.glb");

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