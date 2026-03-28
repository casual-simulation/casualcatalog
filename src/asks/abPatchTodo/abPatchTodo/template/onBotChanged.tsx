if (that.tags.includes('abArtifactShardReconstituted')) {
    thisBot.initialize();
}

if (that.tags.includes('abPatchError') && tags.abPatchError) {
    thisBot.changeAnimationState('error_in');
}
