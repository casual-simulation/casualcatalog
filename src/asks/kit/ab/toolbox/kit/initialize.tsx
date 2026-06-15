if (!masks.initialized && tags.abArtifactShardReconstituted && masks.abInitialized) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] invoke`);
    }

    masks.initialized = true;
    masks.formOpacity = 0;

    await thisBot.refreshForm();

    if (!masks.animationState) {
        os.sleep(100).then(() => {
            let anim = 'appear';
            const catalog = getBot(byID(tags.lineTo));
            if (catalog && !catalog.tags.abEquipmentBaseSelected) {
                anim = 'disappear'
            }
            // Fixes a timing issue where the form briefly plays the incorrect animation when first initializing.
            masks.formOpacity = null;
            masks.animationState = anim;
        })
    }
    
    thisBot.determineLineTo();
} else {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] invoke but early exit because not ready to initialize yet (initialized: ${masks.initialized}, abArtifactShardReconstituted: ${tags.abArtifactShardReconstituted}, abInitialized: ${masks.abInitialized})`);
    }
}
