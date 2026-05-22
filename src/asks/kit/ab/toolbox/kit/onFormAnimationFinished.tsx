if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] animationState: ${tags.animationState}, finished animation: ${that.animation}`);
}

const stateConfig = tags.animationStates?.[tags.animationState];
const onEnterAnim = stateConfig?.onEnter;
const onIdleAnim = stateConfig?.onIdle;

if (!onIdleAnim || !masks.formAddressAnimations || that.animation !== onEnterAnim) return;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] start form animation: ${onIdleAnim}`);
}

os.startFormAnimation(thisBot, onIdleAnim, {
    crossFadeWarp: true,
    crossFadeDuration: 200,
    loop: { mode: 'repeat' },
});
