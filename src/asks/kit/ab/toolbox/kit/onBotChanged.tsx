for (const tag of that.tags) {
    if (tag === 'abArtifactShardReconstituted') {
        thisBot.initialize();
    }

    if (tag === 'animationState' && masks.formAddressAnimations) {
        thisBot.refreshAnimation();
    }
}
