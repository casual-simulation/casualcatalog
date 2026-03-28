if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] animationState: ${tags.animationState}`);
}

const staticMap = {
    'incomplete': 'incomplete_static',
    'processing': 'processing_loop',
    'complete': 'complete_static',
    'error': 'error_static',
};

const staticAnim = staticMap[tags.animationState];
if (!staticAnim || !masks.formAddressAnimations) return;

os.startFormAnimation(thisBot, staticAnim, {
    initialTime: 0,
    crossFadeWarp: true,
    crossFadeDuration: 200,
    loop: { mode: 'repeat' },
});
