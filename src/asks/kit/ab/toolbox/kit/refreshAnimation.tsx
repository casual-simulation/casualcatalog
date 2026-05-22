if (!masks.formAddressAnimations) {
    // Ensure that animations have been loaded.
    return;
}

const onEnterAnim = tags.animationStates?.[tags.animationState]?.onEnter;

if (!onEnterAnim) {
    return;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] start form animation '${onEnterAnim}'`);
}

os.startFormAnimation(thisBot, onEnterAnim, {
    initialTime: 0,
    crossFadeWarp: true,
    crossFadeDuration: 200,
    clampWhenFinished: true,
});
