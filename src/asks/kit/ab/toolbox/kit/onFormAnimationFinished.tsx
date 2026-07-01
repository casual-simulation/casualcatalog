if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] animationState: ${tags.animationState}, finished animation: ${that.animation}`);
}

if (!masks.formAddressAnimations) return;

const stateConfig = tags.animationStates?.[tags.animationState];
const onEnterAnim = stateConfig?.onEnter;
const onIdleAnim = stateConfig?.onIdle;

if (that.animation !== onEnterAnim) return;

if (onIdleAnim) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] start form animation: ${onIdleAnim}`);
    }

    os.startFormAnimation(thisBot, onIdleAnim, {
        crossFadeWarp: true,
        crossFadeDuration: 200,
        loop: { mode: 'repeat' },
    });
    return;
}

if (tags.animationState === 'disappear') {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] disappear finished, removing from dimension`);
    }

    const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? tags.dimension ?? 'home';
    tags[dimension] = null;
    masks[dimension] = null;
    masks.pointable = null;
}
