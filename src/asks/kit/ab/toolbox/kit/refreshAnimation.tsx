if (tags.hasCustomMesh) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] invoke but early exit because using custom mesh`);
    }
    return;
}

if (!masks.formAddressAnimations) {
    // Ensure that animations have been loaded.
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] invoke but early exit because animations not loaded yet`);
    }
    return;
}


if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] invoke`);
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
