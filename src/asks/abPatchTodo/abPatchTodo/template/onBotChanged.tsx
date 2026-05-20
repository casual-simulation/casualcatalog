for (const tag of that.tags) {
    if (tag === 'abArtifactShardReconstituted') {
        thisBot.initialize();
    }

    if (tag === 'animationState' && masks.formAddressAnimations) {
        thisBot.refreshAnimation();
    }
    
    if (masks.initialized) {
        if (tag === 'agentMode' || tag === 'todoForm' || tag === 'isUserAskTodo' || tag === 'isUserApprovalTodo') {
            thisBot.refreshForm();
        }

        if (tag === 'todoShowArrow') {
            thisBot.refreshArrow();
        }

        if (tag === 'todoBaseColor') {
            thisBot.refreshColor();
        }
    }

    if (tag === 'todoReadyForAgent') {
        if (masks.menuOpen) {
            thisBot.abPatchTodoMenuOpen();
        }
    }

    if (tag === 'pointerOver' || tag === 'menuOpen') {
        clearAnimations(thisBot, 'scale');

        const maxDuration = 0.125;
        const overScale = 1.3;
        const normalScale = 1;
        const targetScale = (tags.pointerOver || tags.menuOpen) ? overScale : normalScale;
        const duration = maxDuration * (Math.abs(tags.scale - targetScale) / (overScale - normalScale));
        
        animateTag(thisBot, {
            fromValue: {
                scale: tags.scale,
            },
            toValue: {
                scale: targetScale,
            },
            easing: 'sinusoidal',
            duration
        }).catch(() => {});
    }
}
