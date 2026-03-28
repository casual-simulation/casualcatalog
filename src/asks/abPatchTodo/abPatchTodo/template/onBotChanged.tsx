if (that.tags.includes('abArtifactShardReconstituted')) {
    thisBot.initialize();
}

if (that.tags.includes('animationState') && masks.formAddressAnimations) {
    whisper(thisBot, 'refreshAnimation');
}
