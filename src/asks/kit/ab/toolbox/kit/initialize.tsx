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
}
