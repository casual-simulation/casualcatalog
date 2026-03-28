if (!masks.formAddressAnimations) {
    return;
}
const loopAnimations = ['incomplete_static', 'processing_loop', 'error_static', 'complete_static'];
tags.currAnimation = that;

const animationOptions = { initialTime: 0, crossFadeWarp: true, crossFadeDuration: 200 };

if (loopAnimations.includes(that)) {
    animationOptions.loop = { mode: 'repeat' };
} else {
    animationOptions.clampWhenFinished = true;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] start form animation '${that}' with options:`, animationOptions);
}

os.startFormAnimation(thisBot, that, animationOptions);
``