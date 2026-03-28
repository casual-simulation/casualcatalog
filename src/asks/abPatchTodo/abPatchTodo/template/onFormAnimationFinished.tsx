if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] animationState: ${tags.animationState}, finished animation: ${that.animation}`);
}

const staticMap = {
    'incomplete': 'incomplete_static',
    'processing': 'processing_loop',
    'complete': 'complete_static',
    'error': 'error_static',
};

const inMap = {
    'incomplete': 'incomplete_in',
    'processing': 'processing_in',
    'complete': 'complete_in',
    'error': 'error_in',
};

const expectedInAnim = inMap[tags.animationState];
const staticAnim = staticMap[tags.animationState];
if (!staticAnim || !masks.formAddressAnimations || that.animation !== expectedInAnim) return;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] start form animation: ${staticAnim}`);
}

os.startFormAnimation(thisBot, staticAnim, {
    crossFadeWarp: true,
    crossFadeDuration: 200,
    loop: { mode: 'repeat' },
});
