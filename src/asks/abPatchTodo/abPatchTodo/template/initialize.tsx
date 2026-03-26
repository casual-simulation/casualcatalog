if (!masks.initialized && tags.abArtifactShardReconstituted) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] invoke`);
    }

    masks.initialized = true;

    if (!masks.formAddressAnimations) {
        masks.formAddress = ab.abBuildCasualCatalogURL("/asks/meshes/toDoBot_checklist_animated.glb");
        masks.formAddressAnimations = await os.listFormAnimations(thisBot); // MUST run this before triggering animations. Without it, animations may try to trigger before the animation system is ready.
    }

    thisBot.changeAnimationState("incomplete_in");
}
