if (!masks.initialized && tags.abArtifactShardReconstituted && masks.abInitialized) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] invoke`);
    }

    masks.initialized = true;

    await thisBot.refreshForm();

    if (!tags.animationState) {
        tags.animationState = 'appear';
    }
    
    thisBot.determineLineTo();
} else {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] invoke but early exit because not ready to initialize yet (initialized: ${masks.initialized}, abArtifactShardReconstituted: ${tags.abArtifactShardReconstituted}, abInitialized: ${masks.abInitialized})`);
    }
}
