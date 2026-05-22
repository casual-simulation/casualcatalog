if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] animationState: ${tags.animationState}, finished animation: ${that.animation}`);
}

const onEnterAnim = tags.animationStates[tags.animationState]['onEnter'];
const onIdleAnim = tags.animationStates[tags.animationState]['onIdle'];

if (masks.formAddressAnimations && that.animation === onEnterAnim && onIdleAnim) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] start form animation: ${onIdleAnim}`);
    }

    os.startFormAnimation(thisBot, onIdleAnim, {
        crossFadeWarp: true,
        crossFadeDuration: 200,
        loop: { mode: 'repeat' },
    });
}
