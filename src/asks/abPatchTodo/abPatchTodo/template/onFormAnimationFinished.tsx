if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] animationState: ${tags.animationState}, finished animation: ${that.animation}`);
}

const formConfig = tags.todoFormConfigs?.[tags.todoForm];
const expectedInAnim = formConfig?.animInMap?.[tags.animationState];
const staticAnim = formConfig?.animStaticMap?.[tags.animationState];
if (!staticAnim || !masks.formAddressAnimations || that.animation !== expectedInAnim) return;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] start form animation: ${staticAnim}`);
}

os.startFormAnimation(thisBot, staticAnim, {
    crossFadeWarp: true,
    crossFadeDuration: 200,
    loop: { mode: 'repeat' },
});
