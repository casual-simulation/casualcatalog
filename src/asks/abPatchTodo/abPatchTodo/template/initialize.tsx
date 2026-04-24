if (!masks.initialized && tags.abArtifactShardReconstituted && masks.abInitialized) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] invoke`);
    }

    masks.initialized = true;

    if (!masks.formAddressAnimations) {
        masks.form = 'mesh';
        masks.formAddress = ab.abBuildCasualCatalogURL("/asks/meshes/toDoBot_checklist_animated.glb");
        masks.formAddressAnimations = await os.listFormAnimations(thisBot); // MUST run this before triggering animations. Without it, animations may try to trigger before the animation system is ready.
    }

    if (!tags.animationState) {
        tags.animationState = 'incomplete';
    }
    whisper(thisBot, 'refreshAnimation');
    whisper(thisBot, 'refreshConnections');

    if (tags.todoPlanId && tags.todoOrder === 0 && !tags.playedCreateSound) {
        ab.links.sound.abPlaySound({ value: [ 'ab/audio/writing-short-1.mp3', 'ab/audio/writing-short-2.mp3', 'ab/audio/writing-short-3.mp3', ] });
        tags.playedCreateSound = true;
    }
}
