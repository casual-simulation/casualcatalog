if (!masks.formAddressAnimations) {
    return;
}

const animMap = {
    'incomplete': 'incomplete_in',
    'processing': 'processing_in',
    'complete': 'complete_in',
    'error': 'error_in',
};

const animName = animMap[tags.animationState];

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] animationState: '${tags.animationState}' → animName: '${animName}'`);
}

if (!animName) return;

os.startFormAnimation(thisBot, animName, {
    initialTime: 0,
    crossFadeWarp: true,
    crossFadeDuration: 200,
    clampWhenFinished: true,
});
