if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

// [IMPORTANT NOTE] (September 4, 2025): This is a workaround until we have ab artifact experience state working. As soon as experience state hooked
// up, this process should be eliminated because it changes the artifact instance id which is not ideal - but is servicable until
// then for the needs we have now.

// Naively update all artifact shards in this inst before ab publishes an egg.
await thisBot.abUpdateAllArtifactShards();