if (!masks.formAddressAnimations) {
    return;
}

const todoFormConfig = tags.todoFormConfigs[tags.todoForm];
const animName = todoFormConfig?.animInMap?.[tags.animationState];

if (!animName) {
    return;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] start form animation '${animName}'`);
}

os.startFormAnimation(thisBot, animName, {
    initialTime: 0,
    crossFadeWarp: true,
    crossFadeDuration: 200,
    clampWhenFinished: true,
});
