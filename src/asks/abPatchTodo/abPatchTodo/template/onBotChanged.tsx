for (const tag of that.tags) {
    if (tag === 'abArtifactShardReconstituted') {
        thisBot.initialize();
    }

    if (tag === 'animationState' && masks.formAddressAnimations) {
        whisper(thisBot, 'refreshAnimation');
    }

    if (tag === 'pointerOver') {
        clearAnimations(thisBot, 'scale');

        const maxDuration = 0.125;
        const overScale = 1.3;
        const normalScale = 1;
        const targetScale = tags.pointerOver ? overScale : normalScale;
        const duration = maxDuration * (Math.abs(tags.scale - targetScale) / (overScale - normalScale));
        
        animateTag(thisBot, {
            fromValue: {
                scale: tags.scale,
            },
            toValue: {
                scale: tags.pointerOver ? overScale : normalScale,
            },
            easing: 'sinusoidal',
            duration
        }).catch(() => {});
    }
}
