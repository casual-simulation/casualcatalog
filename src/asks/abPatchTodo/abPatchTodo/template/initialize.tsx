if (!masks.initialized && tags.abArtifactShardReconstituted && masks.abInitialized) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] invoke`);
    }

    masks.initialized = true;

    await thisBot.refreshForm();

    if (!tags.animationState) {
        tags.animationState = 'incomplete';
    }
    
    thisBot.refreshConnections();
    thisBot.refreshArrow();

    if (tags.todoPlanId && tags.todoOrder === 0 && !tags.playedCreateSound) {
        ab.links.sound.abPlaySound({ value: [ 'ab/audio/writing-short-1.mp3', 'ab/audio/writing-short-2.mp3', 'ab/audio/writing-short-3.mp3', ] });
        tags.playedCreateSound = true;
    }
}
